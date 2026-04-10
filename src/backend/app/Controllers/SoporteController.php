<?php

declare(strict_types=1);

use Throwable;

require_once __DIR__ . '/../Models/SoporteModel.php';
require_once __DIR__ . '/../Validators/SoporteValidator.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

class SoporteController
{
    private SoporteModel $soporteModel;

    public function __construct()
    {
        $this->soporteModel = new SoporteModel();
    }

    public function store(): void
    {
        $usuario = Request::user(); // puede ser null
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