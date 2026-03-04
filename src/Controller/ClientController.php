<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Serves the client dashboard — the main React application entry point.
 */
#[Route('/dashboard')]
#[IsGranted('ROLE_USER')]
class ClientController extends AbstractController
{
    /**
     * Renders the dashboard shell. User data is passed as data-attributes
     * so the React app can read them without an extra API call.
     */
    #[Route('', name: 'client_dashboard', methods: ['GET'])]
    public function dashboard(): Response
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        return $this->render('client/dashboard.html.twig', [
            'user' => $user,
        ]);
    }
}
