<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Allows any authenticated user to manage their own profile and password.
 */
#[Route('/profile')]
#[IsGranted('ROLE_USER')]
class ProfileController extends AbstractController
{
    /**
     * Edit personal data: first name, last name, email.
     */
    #[Route('/edit', name: 'profile_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, EntityManagerInterface $em): Response
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if ($request->isMethod('POST')) {
            $firstName = trim($request->request->get('firstName', ''));
            $lastName  = trim($request->request->get('lastName', ''));
            $email     = trim($request->request->get('email', ''));

            if ($firstName && $lastName && $email) {
                $user->setFirstName($firstName);
                $user->setLastName($lastName);
                $user->setEmail($email);
                $em->flush();

                $this->addFlash('success', 'Profile updated.');
                return $this->redirectToRoute('profile_edit');
            }

            $this->addFlash('error', 'All fields are required.');
        }

        return $this->render('profile/edit.html.twig', ['user' => $user]);
    }

    /**
     * Change the user's own password.
     * Requires the current password for verification.
     */
    #[Route('/password', name: 'profile_password', methods: ['GET', 'POST'])]
    public function password(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): Response {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if ($request->isMethod('POST')) {
            $current = $request->request->get('currentPassword', '');
            $new     = $request->request->get('newPassword', '');
            $confirm = $request->request->get('confirmPassword', '');

            if (!$hasher->isPasswordValid($user, $current)) {
                $this->addFlash('error', 'Current password is incorrect.');
            } elseif (strlen($new) < 6) {
                $this->addFlash('error', 'Password must be at least 6 characters.');
            } elseif ($new !== $confirm) {
                $this->addFlash('error', 'Passwords do not match.');
            } else {
                $user->setPassword($hasher->hashPassword($user, $new));
                $em->flush();
                $this->addFlash('success', 'Password changed.');
                return $this->redirectToRoute('profile_password');
            }
        }

        return $this->render('profile/password.html.twig');
    }
}
