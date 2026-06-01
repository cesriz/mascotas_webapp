<?php

declare(strict_types=1);

require_once __DIR__ . '/../Services/AuthService.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

class AuthMiddleware
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    // Valida el token y deja el usuario cargado en Request.
    public function handle(): void
    {
        $usuario = $this->authService->validateCurrentToken();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            exit;
        }

        Request::setUser($usuario);
    }
}