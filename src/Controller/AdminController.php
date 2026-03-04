<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Wallet;
use App\Repository\UserRepository;
use App\Service\MarketDataService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Admin panel for managing users and viewing market data.
 * All routes require ROLE_ADMIN.
 */
#[Route('/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    /**
     * Lists all users.
     */
    #[Route('/', name: 'admin_index', methods: ['GET'])]
    public function index(UserRepository $userRepository): Response
    {
        return $this->render('admin/index.html.twig', [
            'users' => $userRepository->findAll(),
        ]);
    }

    /**
     * Creates a new user with a generated temporary password.
     * The account is credited with 500 EUR on creation.
     */
    #[Route('/user/new', name: 'admin_user_new', methods: ['GET', 'POST'])]
    public function new(
        Request $request,
        UserPasswordHasherInterface $hasher,
        EntityManagerInterface $em
    ): Response {
        if ($request->isMethod('POST')) {
            $firstName = trim($request->request->get('firstName', ''));
            $lastName  = trim($request->request->get('lastName', ''));
            $email     = trim($request->request->get('email', ''));
            $role      = $request->request->get('role', 'ROLE_USER');

            if ($firstName && $lastName && $email) {
                $user = new User();
                $user->setFirstName($firstName);
                $user->setLastName($lastName);
                $user->setEmail($email);
                $user->setRoles([$role]);

                // Generate an 8-character temporary password
                $tempPassword = bin2hex(random_bytes(4));
                $user->setPassword($hasher->hashPassword($user, $tempPassword));

                // Credit the new account with 500 EUR
                $wallet = new Wallet();
                $wallet->setCurrency('EUR');
                $wallet->setBalance('500.00000000');
                $user->addWallet($wallet);

                $em->persist($user);
                $em->persist($wallet);
                $em->flush();

                $this->addFlash('success', "User created. Temporary password: $tempPassword");
                return $this->redirectToRoute('admin_index');
            }

            $this->addFlash('error', 'All fields are required.');
        }

        return $this->render('admin/create.html.twig');
    }

    /**
     * Edits a user's personal data and role.
     * Passwords cannot be modified from this form.
     */
    #[Route('/user/{id}/edit', name: 'admin_user_edit', methods: ['GET', 'POST'])]
    public function edit(
        Request $request,
        User $user,
        EntityManagerInterface $em
    ): Response {
        if ($request->isMethod('POST')) {
            $firstName = trim($request->request->get('firstName', ''));
            $lastName  = trim($request->request->get('lastName', ''));
            $email     = trim($request->request->get('email', ''));
            $role      = $request->request->get('role', 'ROLE_USER');

            if ($firstName && $lastName && $email) {
                $user->setFirstName($firstName);
                $user->setLastName($lastName);
                $user->setEmail($email);
                $user->setRoles([$role]);
                $em->flush();

                $this->addFlash('success', 'User updated.');
                return $this->redirectToRoute('admin_index');
            }

            $this->addFlash('error', 'All fields are required.');
        }

        return $this->render('admin/edit.html.twig', ['user' => $user]);
    }

    /**
     * Deletes a user. Protected by CSRF token.
     */
    #[Route('/user/{id}/delete', name: 'admin_user_delete', methods: ['POST'])]
    public function delete(
        Request $request,
        User $user,
        EntityManagerInterface $em
    ): Response {
        if ($this->isCsrfTokenValid('delete' . $user->getId(), $request->request->get('_token'))) {
            $em->remove($user);
            $em->flush();
            $this->addFlash('success', 'User deleted.');
        }

        return $this->redirectToRoute('admin_index');
    }

    /**
     * Displays current simulated prices for all supported cryptocurrencies.
     */
    #[Route('/prices', name: 'admin_prices', methods: ['GET'])]
    public function prices(MarketDataService $marketData): Response
    {
        return $this->render('admin/prices.html.twig', [
            'prices' => $marketData->getCurrentPrices(),
        ]);
    }
}
