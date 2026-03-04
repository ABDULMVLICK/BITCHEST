<?php

namespace App\Controller;

use App\Service\MarketDataService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Provides JSON API endpoints for market data and portfolio information.
 */
#[Route('/api')]
class ApiController extends AbstractController
{
    public function __construct(private MarketDataService $marketData) {}

    /**
     * Returns the current price for all 10 supported coins.
     * Public access — used by the market overview.
     */
    #[Route('/prices', name: 'api_prices', methods: ['GET'])]
    public function prices(): JsonResponse
    {
        return $this->json($this->marketData->getCurrentPrices());
    }

    /**
     * Returns 30 days of price history for all 10 coins.
     * Public access — used by price charts.
     */
    #[Route('/history', name: 'api_history', methods: ['GET'])]
    public function history(): JsonResponse
    {
        return $this->json($this->marketData->getMarketData());
    }

    /**
     * Returns the authenticated user's portfolio with PMP and unrealised gains.
     *
     * PMP (Prix Moyen Pondéré) = weighted average purchase price per unit.
     * Gain = (current price - PMP) * quantity held.
     */
    #[Route('/portfolio', name: 'api_portfolio', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function portfolio(): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $currentPrices = $this->marketData->getCurrentPrices();

        $eurBalance = 0.0;
        $portfolio = [];

        foreach ($user->getWallets() as $wallet) {
            $currency = $wallet->getCurrency();
            $balance = (float) $wallet->getBalance();

            if ($currency === 'EUR') {
                $eurBalance = $balance;
                continue;
            }

            // Skip empty wallets
            if ($balance <= 0) {
                continue;
            }

            // Build purchase history and compute PMP from BUY transactions
            $transactions = [];
            $totalCost = 0.0;
            $totalQty = 0.0;

            foreach ($wallet->getTransactions() as $tx) {
                if ($tx->getType() === 'BUY') {
                    $qty = (float) $tx->getAmount();
                    $price = (float) $tx->getPriceAtTransaction();
                    $totalCost += $qty * $price;
                    $totalQty += $qty;
                    $transactions[] = [
                        'date' => $tx->getDate()->format('Y-m-d'),
                        'quantity' => $qty,
                        'price' => $price,
                    ];
                }
            }

            $pmp = $totalQty > 0 ? $totalCost / $totalQty : 0.0;
            $currentPrice = $currentPrices[$currency] ?? 0.0;
            $currentValue = $balance * $currentPrice;
            $gain = $currentValue - ($balance * $pmp);

            $portfolio[] = [
                'currency' => $currency,
                'balance' => $balance,
                'pmp' => round($pmp, 2),
                'current_price' => $currentPrice,
                'current_value' => round($currentValue, 2),
                'gain' => round($gain, 2),
                'transactions' => $transactions,
            ];
        }

        return $this->json([
            'eur_balance' => $eurBalance,
            'portfolio' => $portfolio,
        ]);
    }
}
