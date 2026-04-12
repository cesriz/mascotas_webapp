<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/UsuarioModel.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';
require_once __DIR__ . '/../Validators/UsuarioValidator.php';

/**
 * Controlador de usuarios públicos.
 *
 * En esta fase del proyecto se utiliza únicamente para el registro
 * de nuevos usuarios desde la parte pública de la aplicación.
 *
 * La gestión del usuario autenticado se centraliza en MeController.
 */
class UsuarioController
{
    private UsuarioModel $usuarioModel;

    /**
     * Inicializa el modelo de usuarios.
     */
    public function __construct()
    {
        $this->usuarioModel = new UsuarioModel();
    }

    /**
     * Registra un nuevo usuario.
     *
     * Reglas importantes:
     * - el rol siempre se fuerza a USUARIO
     * - la validación se delega en UsuarioValidator
     * - si todo va bien, se devuelve el id creado
     */
    public function store(): void
    {
        $input = Request::json();

        // Seguridad: aunque el cliente mande un rol, se ignora
        // y se fuerza siempre a USUARIO.
        $input['rol'] = 'USUARIO';

        $result = UsuarioValidator::validateStore($input);

        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);
            return;
        }

        $data = $result['data'];

        try {
            $newId = $this->usuarioModel->create($data);

            Response::json([
                'success' => true,
                'message' => 'Usuario creado correctamente',
                'data' => [
                    'id' => $newId
                ]
            ], 201);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al crear el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}