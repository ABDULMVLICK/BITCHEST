<?php

namespace App\Controller;

use App\Entity\Transaction;
use App\Entity\Wallet;
use App\Entity\User;
use App\Service\MarketDataService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Handles buy and sell transactions for authenticated clients.
 */
#[Route('/api')]
#[IsGranted('ROLE_USER')]
class TransactionController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private MarketDataService $marketData
    ) {}

    /**
     * Buy a cryptocurrency using EUR.
     *
     * Request body: { "coin": "Bitcoin", "amount": 50.00 }
     * The amount is in EUR. The equivalent crypto quantity is calculated
     * from the current simulated price.
     */
    #[Route('/buy', name: 'api_buy', methods: ['POST'])]
    public function buy(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $coin = $data['coin'] ?? null;
        $amount = (float) ($data['amount'] ?? 0);

        if (!$coin || $amount <= 0) {
            return $this->json(['error' => 'Invalid parameters'], 400);
        }

        /** @var User $user */
        $user = $this->getUser();
        $eurWallet = $this->findWallet($user, 'EUR');

        if (!$eurWallet || (float) $eurWallet->getBalance() < $amount) {
            return $this->json(['error' => 'Insufficient EUR balance'], 400);
        }

        $currentPrice = $this->marketData->getCurrentPrice($coin);
        if ($currentPrice === null) {
            return $this->json(['error' => 'Unknown cryptocurrency'], 404);
        }

        $cryptoQty = $amount / $currentPrice;

        // Create the crypto wallet on first purchase
        $cryptoWallet = $this->findWallet($user, $coin);
        if (!$cryptoWallet) {
            $cryptoWallet = new Wallet();
            $cryptoWallet->setCurrency($coin);
            $cryptoWallet->setBalance('0');
            $user->addWallet($cryptoWallet);
            $this->em->persist($cryptoWallet);
        }

        // Deduct EUR, credit crypto
        $eurWallet->setBalance((string) ((float) $eurWallet->getBalance() - $amount));
        $cryptoWallet->setBalance((string) ((float) $cryptoWallet->getBalance() + $cryptoQty));

        // Record the transaction with a price snapshot
        $tx = new Transaction();
        $tx->setType('BUY');
        $tx->setAmount((string) $cryptoQty);
        $tx->setPriceAtTransaction((string) $currentPrice);
        $tx->setWallet($cryptoWallet);

        $this->em->persist($tx);
        $this->em->flush();

        return $this->json([
            'message' => 'Purchase successful',
            'eur_balance' => (float) $eurWallet->getBalance(),
            'crypto_received' => $cryptoQty,
        ]);
    }

    /**
     * Sell a cryptocurrency for EUR.
     *
     * Request body: { "coin": "Bitcoin", "quantity": 0.001 }
     * The gain is calculated using PMP (weighted average purchase price).
     */
    #[Route('/sell', name: 'api_sell', methods: ['POST'])]
    public function sell(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $coin = $data['coin'] ?? null;
        $qty = (float) ($data['quantity'] ?? 0);

        if (!$coin || $qty <= 0) {
            return $this->json(['error' => 'Invalid parameters'], 400);
        }

        /** @var User $user */
        $user = $this->getUser();
        $cryptoWallet = $this->findWallet($user, $coin);

        if (!$cryptoWallet || (float) $cryptoWallet->getBalance() < $qty) {
            return $this->json(['error' => 'Insufficient crypto balance'], 400);
        }

        $currentPrice = $this->marketData->getCurrentPrice($coin);
        if ($currentPrice === null) {
            return $this->json(['error' => 'Unknown cryptocurrency'], 404);
        }

        $eurReceived = $qty * $currentPrice;

        // Calculate PMP from all BUY transactions on this wallet
        $totalCost = 0.0;
        $totalQty = 0.0;
        foreach ($cryptoWallet->getTransactions() as $tx) {
            if ($tx->getType() === 'BUY') {
                $totalCost += (float) $tx->getAmount() * (float) $tx->getPriceAtTransaction();
                $totalQty += (float) $tx->getAmount();
            }
        }
        $pmp = $totalQty > 0 ? $totalCost / $totalQty : 0.0;
        $gain = ($currentPrice - $pmp) * $qty;

        // Update balances
        $eurWallet = $this->findWallet($user, 'EUR');
        $cryptoWallet->setBalance((string) ((float) $cryptoWallet->getBalance() - $qty));
        $eurWallet->setBalance((string) ((float) $eurWallet->getBalance() + $eurReceived));

        // Record the transaction
        $tx = new Transaction();
        $tx->setType('SELL');
        $tx->setAmount((string) $qty);
        $tx->setPriceAtTransaction((string) $currentPrice);
        $tx->setWallet($cryptoWallet);

        $this->em->persist($tx);
        $this->em->flush();

        return $this->json([
            'message' => 'Sale successful',
            'eur_balance' => (float) $eurWallet->getBalance(),
            'eur_received' => $eurReceived,
            'gain' => round($gain, 2),
            'pmp' => round($pmp, 2),
        ]);
    }

    /** Finds the wallet for a given currency, or returns null. */
    private function findWallet(User $user, string $currency): ?Wallet
    {
        foreach ($user->getWallets() as $wallet) {
            if (strtolower($wallet->getCurrency()) === strtolower($currency)) {
                return $wallet;
            }
        }
        return null;
    }
}
