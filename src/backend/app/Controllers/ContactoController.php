<?php

declare(strict_types=1);

use Throwable;

require_once __DIR__ . '/../Models/ContactoModel.php';
require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Validators/ContactoValidator.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

class ContactoController
{
    private ContactoModel $contactoModel;
    private MascotaModel $mascotaModel;

    public function __construct()
    {
        $this->contactoModel = new ContactoModel();
        $this->mascotaModel = new MascotaModel();
    }

    // Guarda un mensaje de contacto asociado a una mascota.
    public function store(int $mascotaId): void
    {
        $usuario = Request::user(); // puede ser null si viene público

        $mascota = $this->mascotaModel->getById($mascotaId);

        if ($mascota === null) {
            Response::json([
                'success' => false,
                'message' => 'Mascota no encontrada'
            ], 404);
            return;
        }

        $input = Request::json();

        /*
         * Caso 1: usuario autenticado
         * El usuario remitente es el del token.
         */
        if ($usuario !== null) {
            $input['usuario_remitente_id'] = (int) $usuario['id'];

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
            /*
             * Caso 2: usuario público / anónimo
             * No hay usuario interno asociado.
             */
            $input['usuario_remitente_id'] = null;
        }

        $result = ContactoValidator::validateStore($input);

        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);
            return;
        }

        $data = $result['data'];

        try {
            $newId = $this->contactoModel->create([
                'mascota_id' => $mascotaId,
                'usuario_destinatario_id' => (int) $mascota['usuario_id'],
                'usuario_remitente_id' => $data['usuario_remitente_id'], // puede ser int o null
                'nombre' => $data['nombre'],
                'correo' => $data['correo'],
                'telefono' => $data['telefono'],
                'mensaje' => $data['mensaje'],
            ]);

            Response::json([
                'success' => true,
                'message' => 'Mensaje de contacto enviado correctamente',
                'data' => [
                    'id' => $newId,
                    'mascota_id' => $mascotaId,
                    'usuario_destinatario_id' => (int) $mascota['usuario_id'],
                    'usuario_remitente_id' => $data['usuario_remitente_id']
                ]
            ], 201);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al enviar el mensaje de contacto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}