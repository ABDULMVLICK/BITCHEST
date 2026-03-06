<?php

namespace App\Tests\Entity;

use App\Entity\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    // Test 1 : un nouvel utilisateur a bien l'email qu'on lui donne
    public function testEmail(): void
    {
        $user = new User();
        $user->setEmail('alice@mail.com');

        $this->assertEquals('alice@mail.com', $user->getEmail());
    }

    // Test 2 : un nouvel utilisateur a bien le prénom et nom qu'on lui donne
    public function testNom(): void
    {
        $user = new User();
        $user->setFirstName('Alice');
        $user->setLastName('Martin');

        $this->assertEquals('Alice', $user->getFirstName());
        $this->assertEquals('Martin', $user->getLastName());
    }

    // Test 3 : par défaut, tout utilisateur a le rôle ROLE_USER
    public function testRoleParDefaut(): void
    {
        $user = new User();

        $this->assertContains('ROLE_USER', $user->getRoles());
    }

    // Test 4 : un admin a le rôle ROLE_ADMIN
    public function testRoleAdmin(): void
    {
        $user = new User();
        $user->setRoles(['ROLE_ADMIN']);

        $this->assertContains('ROLE_ADMIN', $user->getRoles());
    }

    // Test 5 : un token de reset pas encore expiré est valide
    public function testTokenValide(): void
    {
        $user = new User();
        $user->setResetToken('montoken');
        $user->setResetTokenExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->assertTrue($user->isResetTokenValid());
    }

    // Test 6 : un token expiré n'est plus valide
    public function testTokenExpire(): void
    {
        $user = new User();
        $user->setResetToken('montoken');
        $user->setResetTokenExpiresAt(new \DateTimeImmutable('-1 hour'));

        $this->assertFalse($user->isResetTokenValid());
    }
}
