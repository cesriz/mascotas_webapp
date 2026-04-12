<?php

declare(strict_types=1);

require_once __DIR__ . '/../Services/AuthService.php';
require_once __DIR__ . '/../Validators/AuthValidator.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

/**
 * Controlador de autenticación.
 *
 * Gestiona:
 * - login
 * - usuario autenticado actual
 * - logout
 */
class AuthController
{
    private AuthService $authService;

    /**
     * Inicializa el servicio de autenticación.
     */
    public function __construct()
    {
        $this->authService = new AuthService();
    }

    /**
     * Inicia sesión de un usuario.
     *
     * Flujo:
     * 1. Lee el JSON de entrada
     * 2. Valida los datos con AuthValidator
     * 3. Llama al servicio de autenticación
     * 4. Devuelve token y datos básicos del usuario
     */
    public function login(): void
    {
        $input = Request::json();
        $result = AuthValidator::validateLogin($input);

        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);
            return;
        }

        $data = $result['data'];

        $authResult = $this->authService->login(
            $data['correo'],
            $data['password']
        );

        if ($authResult === null) {
            Response::json([
                'success' => false,
                'message' => 'Credenciales no válidas'
            ], 401);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Login correcto',
            'data' => $authResult
        ]);
    }

    /**
     * Devuelve los datos del usuario autenticado actual.
     */
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

    /**
     * Cierra sesión invalidando el token guardado en base de datos.
     */
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