<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Handles the full forgot-password flow:
 *  1. User submits their email → receive a reset link
 *  2. User clicks the link → enter and confirm new password
 */
class ForgotPasswordController extends AbstractController
{
    /**
     * Step 1 — Request a password reset email.
     *
     * We always show the same success message whether or not the email
     * exists, to avoid leaking which addresses are registered.
     */
    #[Route('/forgot-password', name: 'forgot_password', methods: ['GET', 'POST'])]
    public function request(
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $em,
        MailerInterface $mailer
    ): Response {
        $sent = false;

        if ($request->isMethod('POST')) {
            $email = trim($request->request->get('email', ''));
            $user  = $userRepository->findOneBy(['email' => $email]);

            if ($user) {
                // Generate a secure random token valid for 1 hour
                $token     = bin2hex(random_bytes(32));
                $expiresAt = new \DateTimeImmutable('+1 hour');

                $user->setResetToken($token);
                $user->setResetTokenExpiresAt($expiresAt);
                $em->flush();

                // Build the reset link
                $resetUrl = $this->generateUrl(
                    'reset_password',
                    ['token' => $token],
                    UrlGeneratorInterface::ABSOLUTE_URL
                );

                // Send the email (caught by Mailpit in dev)
                $mail = (new Email())
                    ->from('noreply@bitchest.local')
                    ->to($user->getEmail())
                    ->subject('BitChest — Reset your password')
                    ->html($this->renderView('emails/reset_password.html.twig', [
                        'user'     => $user,
                        'resetUrl' => $resetUrl,
                    ]));

                $mailer->send($mail);
            }

            // Always show success to avoid email enumeration
            $sent = true;
        }

        return $this->render('security/forgot_password.html.twig', ['sent' => $sent]);
    }

    /**
     * Step 2 — Validate the token and set a new password.
     */
    #[Route('/reset-password/{token}', name: 'reset_password', methods: ['GET', 'POST'])]
    public function reset(
        string $token,
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): Response {
        $user = $userRepository->findOneBy(['resetToken' => $token]);

        // Reject invalid or expired tokens
        if (!$user || !$user->isResetTokenValid()) {
            $this->addFlash('error', 'This reset link is invalid or has expired.');
            return $this->redirectToRoute('forgot_password');
        }

        $errors = [];

        if ($request->isMethod('POST')) {
            $password = $request->request->get('password', '');
            $confirm  = $request->request->get('confirmPassword', '');

            if (strlen($password) < 6) {
                $errors[] = 'Password must be at least 6 characters.';
            } elseif ($password !== $confirm) {
                $errors[] = 'Passwords do not match.';
            } else {
                $user->setPassword($hasher->hashPassword($user, $password));
                $user->setResetToken(null);
                $user->setResetTokenExpiresAt(null);
                $em->flush();

                $this->addFlash('success', 'Password updated. You can now sign in.');
                return $this->redirectToRoute('app_login');
            }
        }

        return $this->render('security/reset_password.html.twig', [
            'token'  => $token,
            'errors' => $errors,
        ]);
    }
}
