<?php

namespace App\DataFixtures;

use App\Entity\Transaction;
use App\Entity\User;
use App\Entity\Wallet;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Loads a minimal dataset: 1 admin + 2 clients with EUR wallets and sample BUY transactions.
 * Run with: php bin/console doctrine:fixtures:load
 */
class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $hasher
    ) {}

    public function load(ObjectManager $manager): void
    {
        // --- Admin ---
        $admin = new User();
        $admin->setEmail('admin@bitchest.fr');
        $admin->setFirstName('Admin');
        $admin->setLastName('BitChest');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->hasher->hashPassword($admin, 'admin1234'));
        $manager->persist($admin);

        // --- Client 1 : Alice ---
        $alice = new User();
        $alice->setEmail('alice@bitchest.fr');
        $alice->setFirstName('Alice');
        $alice->setLastName('Dupont');
        $alice->setRoles([]);
        $alice->setPassword($this->hasher->hashPassword($alice, 'client1234'));
        $manager->persist($alice);

        // EUR wallet pour Alice (solde initial €1000)
        $aliceEur = new Wallet();
        $aliceEur->setCurrency('EUR');
        $aliceEur->setBalance('1000.00000000');
        $alice->addWallet($aliceEur);
        $manager->persist($aliceEur);

        // Bitcoin wallet pour Alice + transaction d'achat (2 BTC à €100)
        $aliceBtc = new Wallet();
        $aliceBtc->setCurrency('Bitcoin');
        $aliceBtc->setBalance('2.00000000');
        $alice->addWallet($aliceBtc);
        $manager->persist($aliceBtc);

        $tx1 = new Transaction();
        $tx1->setType('BUY');
        $tx1->setAmount('2.00000000');
        $tx1->setPriceAtTransaction('100.00');
        $tx1->setWallet($aliceBtc);
        $manager->persist($tx1);

        // --- Client 2 : Bob ---
        $bob = new User();
        $bob->setEmail('bob@bitchest.fr');
        $bob->setFirstName('Bob');
        $bob->setLastName('Martin');
        $bob->setRoles([]);
        $bob->setPassword($this->hasher->hashPassword($bob, 'client1234'));
        $manager->persist($bob);

        // EUR wallet pour Bob (solde initial €500)
        $bobEur = new Wallet();
        $bobEur->setCurrency('EUR');
        $bobEur->setBalance('500.00000000');
        $bob->addWallet($bobEur);
        $manager->persist($bobEur);

        // Ethereum wallet pour Bob + deux transactions d'achat (pour démontrer le PMP)
        $bobEth = new Wallet();
        $bobEth->setCurrency('Ethereum');
        $bobEth->setBalance('5.00000000');
        $bob->addWallet($bobEth);
        $manager->persist($bobEth);

        // Achat 1 : 2 ETH à €80
        $tx2 = new Transaction();
        $tx2->setType('BUY');
        $tx2->setAmount('2.00000000');
        $tx2->setPriceAtTransaction('80.00');
        $tx2->setWallet($bobEth);
        $manager->persist($tx2);

        // Achat 2 : 3 ETH à €120 → PMP = (2*80 + 3*120) / 5 = €104
        $tx3 = new Transaction();
        $tx3->setType('BUY');
        $tx3->setAmount('3.00000000');
        $tx3->setPriceAtTransaction('120.00');
        $tx3->setWallet($bobEth);
        $manager->persist($tx3);

        $manager->flush();
    }
}
