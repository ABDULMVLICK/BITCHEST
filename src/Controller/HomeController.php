<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Redirects the root URL to the appropriate page based on authentication state.
 */
class HomeController extends AbstractController
{
    /**
     * Sends admins to the admin panel, clients to their dashboard,
     * and unauthenticated users to the login page.
     */
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {
            return $this->redirectToRoute('admin_index');
        }

        if ($this->isGranted('ROLE_USER')) {
            return $this->redirectToRoute('client_dashboard');
        }

        return $this->redirectToRoute('app_login');
    }
}
