<?php

namespace App\Service;

/**
 * Generates simulated cryptocurrency market data for prototyping.
 *
 * Uses the official cotation_generator algorithm with srand seeding
 * so that the same coin + date always produces the same price.
 */
class MarketDataService
{
    /** @var string[] The 10 supported cryptocurrencies */
    public const COINS = [
        'Bitcoin',
        'Ethereum',
        'Ripple',
        'Bitcoin Cash',
        'Cardano',
        'Litecoin',
        'Dash',
        'Iota',
        'NEM',
        'Stellar',
    ];

    /**
     * Returns 30 days of price history for every supported coin.
     *
     * @return array<string, list<array{date: string, price: float}>>
     */
    public function getMarketData(): array
    {
        $data = [];
        $today = new \DateTimeImmutable('today');

        foreach (self::COINS as $coin) {
            $data[$coin] = $this->generateHistory($coin, $today);
        }

        return $data;
    }

    /**
     * Returns the current (today's) price for every supported coin.
     *
     * @return array<string, float>
     */
    public function getCurrentPrices(): array
    {
        $prices = [];
        $today = new \DateTimeImmutable('today');

        foreach (self::COINS as $coin) {
            $history = $this->generateHistory($coin, $today);
            $prices[$coin] = end($history)['price'];
        }

        return $prices;
    }

    /**
     * Returns today's price for a single coin, or null if the coin is unknown.
     */
    public function getCurrentPrice(string $coinName): ?float
    {
        if (!in_array($coinName, self::COINS, true)) {
            return null;
        }

        $today = new \DateTimeImmutable('today');
        $history = $this->generateHistory($coinName, $today);

        return end($history)['price'];
    }

    /**
     * Generates 30 data points (one per day) for a given coin.
     *
     * srand(crc32(coin + date)) ensures reproducibility:
     * the same input always yields the same output.
     *
     * @return list<array{date: string, price: float}>
     */
    private function generateHistory(string $coin, \DateTimeImmutable $today): array
    {
        $history = [];

        // Day 0: initial price, 29 days ago
        $date = $today->modify('-29 days');
        $dateStr = $date->format('Y-m-d');
        srand(crc32($coin . $dateStr));
        $price = $this->getFirstCotation($coin);
        $history[] = ['date' => $dateStr, 'price' => round($price, 2)];

        // Days 1-29: apply daily variation
        for ($i = 1; $i < 30; $i++) {
            $date = $today->modify('-' . (29 - $i) . ' days');
            $dateStr = $date->format('Y-m-d');
            srand(crc32($coin . $dateStr));
            $price += $this->getCotationFor($coin);

            // Prices cannot be negative (spec requirement)
            if ($price < 0.01) {
                $price = 0.01;
            }

            $history[] = ['date' => $dateStr, 'price' => round($price, 2)];
        }

        return $history;
    }

    /**
     * Returns the initial market price for a cryptocurrency.
     *
     * Source: cotation_generator.php - getFirstCotation()
     */
    private function getFirstCotation(string $cryptoname): float
    {
        return ord(substr($cryptoname, 0, 1)) + rand(0, 10);
    }

    /**
     * Returns the daily price variation for a cryptocurrency.
     *
     * Source: cotation_generator.php - getCotationFor()
     */
    private function getCotationFor(string $cryptoname): float
    {
        return ((rand(0, 99) > 40) ? 1 : -1)
            * ((rand(0, 99) > 49) ? ord(substr($cryptoname, 0, 1)) : ord(substr($cryptoname, -1)))
            * (rand(1, 10) * .01);
    }
}
