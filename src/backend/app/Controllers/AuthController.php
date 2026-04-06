<?php

declare(strict_types=1);

require_once __DIR__ . '/../Services/AuthService.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

class AuthController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    // Login del usuario. Devuelve token + datos básicos.
    public function login(): void
    {
        $input = Request::json();

        $correo = isset($input['correo']) ? trim((string) $input['correo']) : '';
        $password = isset($input['password']) ? (string) $input['password'] : '';

        if ($correo === '' || $password === '') {
            Response::json([
                'success' => false,
                'message' => 'correo y password son obligatorios'
            ], 422);
            return;
        }

        $result = $this->authService->login($correo, $password);

        if ($result === null) {
            Response::json([
                'success' => false,
                'message' => 'Credenciales no válidas'
            ], 401);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Login correcto',
            'data' => $result
        ]);
    }

    // Devuelve el usuario autenticado actual.
    public function me(): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            return;
        }

        Response::json([
            'success' => true,
            'data' => [
                'id' => (int) $usuario['id'],
                'nombre' => $usuario['nombre'],
                'apellidos' => $usuario['apellidos'],
                'correo' => $usuario['correo'],
                'telefono' => $usuario['telefono'],
                'direccion' => $usuario['direccion'],
                'rol' => $usuario['rol']
            ]
        ]);
    }

    // Cierra sesión invalidando el token guardado en base de datos.
    public function logout(): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            return;
        }

        $ok = $this->authService->logout((int) $usuario['id']);

        if (!$ok) {
            Response::json([
                'success' => false,
                'message' => 'No se pudo cerrar la sesión'
            ], 500);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Logout correcto'
        ]);
    }
}