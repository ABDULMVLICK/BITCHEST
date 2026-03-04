<?php

namespace App\Tests\Service;

use App\Service\CryptoPriceService;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class CryptoPriceServiceTest extends TestCase
{
    public function testGetPricesReturnsData(): void
    {
        // 1. Create Mocks
        $httpClient = $this->createMock(HttpClientInterface::class);
        $response = $this->createMock(ResponseInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        // 2. Define Mock Behavior
        // The service calls $response->toArray()
        $mockData = [
            'bitcoin' => ['eur' => 50000],
            'ethereum' => ['eur' => 3000]
        ];

        $response->method('toArray')
            ->willReturn($mockData);

        // The service calls $httpClient->request(...)
        $httpClient->method('request')
            ->willReturn($response);

        // 3. Instantiate Service
        $service = new CryptoPriceService($httpClient, $logger);

        // 4. Run Test
        $prices = $service->getPrices(['bitcoin', 'ethereum'], 'eur');

        // 5. Assertions
        $this->assertIsArray($prices);
        $this->assertArrayHasKey('bitcoin', $prices);
        $this->assertEquals(50000, $prices['bitcoin']);
        $this->assertEquals(3000, $prices['ethereum']);
    }

    public function testGetPricesHandlesEmptyInput(): void
    {
        $httpClient = $this->createMock(HttpClientInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        $service = new CryptoPriceService($httpClient, $logger);

        $this->assertEmpty($service->getPrices([]));
    }

    public function testGetPricesHandlesApiError(): void
    {
        $httpClient = $this->createMock(HttpClientInterface::class);
        $logger = $this->createMock(LoggerInterface::class);

        $httpClient->method('request')
            ->willThrowException(new \Exception('API Error'));

        // Logger should record the error
        $logger->expects($this->once())
            ->method('error');

        $service = new CryptoPriceService($httpClient, $logger);

        $result = $service->getPrices(['bitcoin']);

        $this->assertEmpty($result);
    }
}
