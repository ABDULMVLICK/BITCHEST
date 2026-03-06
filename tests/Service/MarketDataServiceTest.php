<?php

namespace App\Tests\Service;

use App\Service\MarketDataService;
use PHPUnit\Framework\TestCase;

class MarketDataServiceTest extends TestCase
{
    private MarketDataService $service;

    // setUp() est appelée automatiquement avant chaque test
    protected function setUp(): void
    {
        $this->service = new MarketDataService();
    }

    // Test 1 : il y a bien 10 cryptomonnaies supportées
    public function testDixCryptos(): void
    {
        $this->assertCount(10, MarketDataService::COINS);
    }

    // Test 2 : Bitcoin est dans la liste
    public function testBitcoinEstDansLaListe(): void
    {
        $this->assertContains('Bitcoin', MarketDataService::COINS);
    }

    // Test 3 : le prix du Bitcoin est un nombre positif
    public function testPrixBitcoinPositif(): void
    {
        $prix = $this->service->getCurrentPrice('Bitcoin');

        $this->assertNotNull($prix);
        $this->assertGreaterThan(0, $prix);
    }

    // Test 4 : une crypto inconnue retourne null
    public function testCryptoInconnueRetourneNull(): void
    {
        $prix = $this->service->getCurrentPrice('Dogecoin');

        $this->assertNull($prix);
    }

    // Test 5 : appeler deux fois le même prix donne le même résultat
    // (les prix sont reproductibles, pas aléatoires)
    public function testPrixReproductible(): void
    {
        $prix1 = $this->service->getCurrentPrice('Ethereum');
        $prix2 = $this->service->getCurrentPrice('Ethereum');

        $this->assertEquals($prix1, $prix2);
    }

    // Test 6 : l'historique contient bien 30 jours pour Bitcoin
    public function testHistorique30Jours(): void
    {
        $historique = $this->service->getMarketData();

        $this->assertCount(30, $historique['Bitcoin']);
    }
}
