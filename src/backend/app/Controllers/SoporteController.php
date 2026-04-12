<?php

declare(strict_types=1);

use Throwable;

require_once __DIR__ . '/../Models/SoporteModel.php';
require_once __DIR__ . '/../Validators/SoporteValidator.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

/**
 * Controlador de soporte.
 *
 * Permite enviar mensajes al canal de soporte del sistema.
 */
class SoporteController
{
    private SoporteModel $soporteModel;

    /**
     * Inicializa el modelo de soporte.
     */
    public function __construct()
    {
        $this->soporteModel = new SoporteModel();
    }

    /**
     * Crea un nuevo mensaje de soporte.
     *
     * Puede venir de:
     * - usuario autenticado
     * - usuario público
     */
    public function store(): void
    {
        $usuario = Request::user();
        $input = Request::json();

        if ($usuario !== null) {
            $input['usuario_id'] = (int) $usuario['id'];

            if (empty($input['nombre'])) {
                $input['nombre'] = trim(($usuario['nombre'] ?? '') . ' ' . ($usuario['apellidos'] ?? ''));
            }

            if (empty($input['correo']) && !empty($usuario['correo'])) {
                $input['correo'] = $usuario['correo'];
            }

            if (empty($input['telefono']) && !empty($usuario['telefono'])) {
                $input['telefono'] = $usuario['telefono'];
            }
        } else {
            $input['usuario_id'] = null;
        }

        $result = SoporteValidator::validateStore($input);

        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);
            return;
        }

        $data = $result['data'];

        try {
            $newId = $this->soporteModel->create($data);

            Response::json([
                'success' => true,
                'message' => 'Mensaje de soporte enviado correctamente',
                'data' => [
                    'id' => $newId
                ]
            ], 201);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al enviar el mensaje de soporte',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}