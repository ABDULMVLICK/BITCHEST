<?php

namespace App\Tests\Entity;

use App\Entity\User;
use App\Entity\Wallet;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function testUserInitialization(): void
    {
        $user = new User();

        $this->assertNull($user->getId());
        $this->assertNull($user->getEmail());
        $this->assertEmpty($user->getWallets());

        // Test default role
        $this->assertContains('ROLE_USER', $user->getRoles());
    }

    public function testUserSettersAndGetters(): void
    {
        $user = new User();

        $email = 'test@bitchest.com';
        $firstName = 'John';
        $lastName = 'Doe';
        $password = 'hashed_password';

        $user->setEmail($email)
            ->setFirstName($firstName)
            ->setLastName($lastName)
            ->setPassword($password);

        $this->assertEquals($email, $user->getEmail());
        $this->assertEquals($email, $user->getUserIdentifier());
        $this->assertEquals($firstName, $user->getFirstName());
        $this->assertEquals($lastName, $user->getLastName());
        $this->assertEquals($password, $user->getPassword());
    }

    public function testWalletRelation(): void
    {
        $user = new User();
        $wallet = new Wallet();

        // Add wallet
        $user->addWallet($wallet);

        $this->assertCount(1, $user->getWallets());
        $this->assertTrue($user->getWallets()->contains($wallet));
        $this->assertSame($user, $wallet->getOwner());

        // Remove wallet
        $user->removeWallet($wallet);

        $this->assertCount(0, $user->getWallets());
        $this->assertNull($wallet->getOwner());
    }
}
