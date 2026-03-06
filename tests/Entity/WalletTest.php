<?php

namespace App\Tests\Entity;

use App\Entity\Transaction;
use App\Entity\Wallet;
use PHPUnit\Framework\TestCase;

class WalletTest extends TestCase
{
    // Test 1 : un nouveau wallet a une balance de 0 par défaut
    public function testBalanceParDefaut(): void
    {
        $wallet = new Wallet();

        $this->assertEquals('0.00000000', $wallet->getBalance());
    }

    // Test 2 : on peut changer la devise et la balance
    public function testDeviseEtBalance(): void
    {
        $wallet = new Wallet();
        $wallet->setCurrency('EUR');
        $wallet->setBalance('500.00000000');

        $this->assertEquals('EUR', $wallet->getCurrency());
        $this->assertEquals('500.00000000', $wallet->getBalance());
    }

    // Test 3 : on peut ajouter une transaction au wallet
    public function testAjoutTransaction(): void
    {
        $wallet = new Wallet();
        $tx     = new Transaction();

        $wallet->addTransaction($tx);

        // Le wallet doit contenir 1 transaction
        $this->assertCount(1, $wallet->getTransactions());
    }

    // Test 4 : calcul du PMP avec un seul achat
    // J'achète 2 Bitcoin à €100 → PMP = €100
    public function testPmpUnSeulAchat(): void
    {
        $wallet = new Wallet();

        $tx = new Transaction();
        $tx->setType('BUY');
        $tx->setAmount('2.0');               // 2 Bitcoin achetés
        $tx->setPriceAtTransaction('100.00'); // au prix de €100 chacun
        $wallet->addTransaction($tx);

        $pmp = $this->calculerPmp($wallet);

        $this->assertEquals(100.0, $pmp);
    }

    // Test 5 : calcul du PMP avec deux achats
    // Achat 1 : 2 BTC à €100  →  coût total = €200
    // Achat 2 : 3 BTC à €150  →  coût total = €450
    // PMP = (200 + 450) / (2 + 3) = 650 / 5 = €130
    public function testPmpDeuxAchats(): void
    {
        $wallet = new Wallet();

        $tx1 = new Transaction();
        $tx1->setType('BUY');
        $tx1->setAmount('2.0');
        $tx1->setPriceAtTransaction('100.00');
        $wallet->addTransaction($tx1);

        $tx2 = new Transaction();
        $tx2->setType('BUY');
        $tx2->setAmount('3.0');
        $tx2->setPriceAtTransaction('150.00');
        $wallet->addTransaction($tx2);

        $pmp = $this->calculerPmp($wallet);

        $this->assertEquals(130.0, $pmp);
    }

    // Fonction helper : calcule le PMP à partir des transactions BUY du wallet
    // (même logique que dans TransactionController)
    private function calculerPmp(Wallet $wallet): float
    {
        $totalCout = 0.0;
        $totalQte  = 0.0;

        foreach ($wallet->getTransactions() as $tx) {
            if ($tx->getType() === 'BUY') {
                $totalCout += (float) $tx->getAmount() * (float) $tx->getPriceAtTransaction();
                $totalQte  += (float) $tx->getAmount();
            }
        }

        return $totalQte > 0 ? $totalCout / $totalQte : 0.0;
    }
}
