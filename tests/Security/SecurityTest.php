<?php

namespace App\Tests\Security;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

/**
 * Vérifie que les routes protégées redirigent bien les visiteurs non connectés.
 * Un utilisateur non authentifié doit recevoir un code HTTP 302 (redirection vers /login).
 */
class SecurityTest extends WebTestCase
{
    // Test 1 : la page admin est protégée
    public function testAdminSansAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/admin/');

        // Doit rediriger vers la page de connexion
        $this->assertResponseRedirects();
        $this->assertResponseStatusCodeSame(302);
    }

    // Test 2 : le tableau de bord client est protégé
    public function testDashboardSansAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/dashboard');

        $this->assertResponseRedirects();
        $this->assertResponseStatusCodeSame(302);
    }

    // Test 3 : l'API portfolio est protégée
    public function testApiPortfolioSansAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/portfolio');

        $this->assertResponseRedirects();
        $this->assertResponseStatusCodeSame(302);
    }

    // Test 4 : l'API achat est protégée
    public function testApiBuySansAuth(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/buy', [], [], ['CONTENT_TYPE' => 'application/json'], '{}');

        $this->assertResponseRedirects();
        $this->assertResponseStatusCodeSame(302);
    }

    // Test 5 : l'API vente est protégée
    public function testApiSellSansAuth(): void
    {
        $client = static::createClient();
        $client->request('POST', '/api/sell', [], [], ['CONTENT_TYPE' => 'application/json'], '{}');

        $this->assertResponseRedirects();
        $this->assertResponseStatusCodeSame(302);
    }

    // Test 6 : la page de profil est protégée
    public function testProfilSansAuth(): void
    {
        $client = static::createClient();
        $client->request('GET', '/profile/edit');

        $this->assertResponseRedirects();
        $this->assertResponseStatusCodeSame(302);
    }

    // Test 7 : les prix sont publics (pas de redirection)
    public function testPrixSontPublics(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/prices');

        // Cette route est publique, pas de redirection
        $this->assertResponseStatusCodeSame(200);
    }
}
