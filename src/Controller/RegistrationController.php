<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Wallet;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Handles public user registration.
 */
class RegistrationController extends AbstractController
{
    /**
     * Registers a new client account.
     *
     * On success: creates the user, credits 500 EUR, and logs the user in.
     * Validates: required fields, email format, password length, password confirmation.
     */
    #[Route('/register', name: 'app_register', methods: ['GET', 'POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $hasher,
        Security $security,
        EntityManagerInterface $em
    ): Response {
        $errors = [];

        if ($request->isMethod('POST')) {
            $firstName = trim($request->request->get('firstName', ''));
            $lastName  = trim($request->request->get('lastName', ''));
            $email     = trim($request->request->get('email', ''));
            $password  = $request->request->get('password', '');
            $confirm   = $request->request->get('confirmPassword', '');

            if (!$firstName)                                  $errors[] = 'First name is required.';
            if (!$lastName)                                   $errors[] = 'Last name is required.';
            if (!filter_var($email, FILTER_VALIDATE_EMAIL))   $errors[] = 'Invalid email address.';
            if (strlen($password) < 6)                        $errors[] = 'Password must be at least 6 characters.';
            if ($password !== $confirm)                        $errors[] = 'Passwords do not match.';

            if (empty($errors)) {
                $user = new User();
                $user->setFirstName($firstName);
                $user->setLastName($lastName);
                $user->setEmail($email);
                $user->setRoles(['ROLE_USER']);
                $user->setPassword($hasher->hashPassword($user, $password));

                // Credit the new account with 500 EUR
                $wallet = new Wallet();
                $wallet->setCurrency('EUR');
                $wallet->setBalance('500.00000000');
                $user->addWallet($wallet);

                $em->persist($user);
                $em->persist($wallet);
                $em->flush();

                return $security->login($user, 'form_login', 'main');
            }
        }

        return $this->render('registration/register.html.twig', ['errors' => $errors]);
    }
}
