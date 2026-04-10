<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/UsuarioModel.php';
require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/AvistamientoModel.php';
require_once __DIR__ . '/../Models/ContactoModel.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';
require_once __DIR__ . '/../Validators/UsuarioValidator.php';

class UsuarioController
{
    private UsuarioModel $usuarioModel;
    private MascotaModel $mascotaModel;
    private AvistamientoModel $avistamientoModel;
    private ContactoModel $contactoModel;

    public function __construct()
    {
        $this->usuarioModel = new UsuarioModel();
        $this->mascotaModel = new MascotaModel();
        $this->avistamientoModel = new AvistamientoModel();
        $this->contactoModel = new ContactoModel();
    }

    // Devuelve el listado de usuarios.
    public function index(): void
    {
        $usuarios = $this->usuarioModel->getAll();

        Response::json([
            'success' => true,
            'data' => $usuarios
        ]);
    }

    // Devuelve un usuario por id.
    public function show(int $id): void
    {
        $usuario = $this->usuarioModel->getById($id);

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
            return;
        }

        Response::json([
            'success' => true,
            'data' => $usuario
        ]);
    }

    // Devuelve las mascotas del usuario.
    public function mascotas(int $id): void
    {
        $usuario = $this->usuarioModel->getById($id);

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
            return;
        }

        $mascotas = $this->mascotaModel->getCardsByUsuarioId($id);

        Response::json([
            'success' => true,
            'data' => $mascotas
        ]);
    }

    // Devuelve los avistamientos enviados por el usuario.
    public function avistamientos(int $id): void
    {
        $usuario = $this->usuarioModel->getById($id);

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
            return;
        }

        $avistamientos = $this->avistamientoModel->getCardsByUsuarioId($id);

        Response::json([
            'success' => true,
            'data' => $avistamientos
        ]);
    }

    // Devuelve el centro de notificaciones del usuario.
    public function notificaciones(int $id): void
    {
        $usuario = $this->usuarioModel->getById($id);

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
            return;
        }

        // Contactos recibidos.
        $contactos = $this->contactoModel->getReceivedByUsuarioId($id);
        $contactosNoLeidos = $this->contactoModel->countUnreadByUsuarioId($id);

        // Avistamientos recibidos.
        $avistamientosRecibidos = $this->avistamientoModel->getReceivedNotificationsByUsuarioId($id);
        $avistamientosNoLeidos = $this->avistamientoModel->countUnreadReceivedByUsuarioId($id);

        Response::json([
            'success' => true,
            'data' => [
                'resumen' => [
                    'total_no_leidas' => $contactosNoLeidos + $avistamientosNoLeidos,
                    'contactos_no_leidos' => $contactosNoLeidos,
                    'avistamientos_no_leidos' => $avistamientosNoLeidos
                ],
                'contactos' => $contactos,
                'avistamientos' => $avistamientosRecibidos
            ]
        ]);
    }

    // Marca un mensaje de contacto como leído.
    public function marcarContactoLeido(int $id, int $contactoId): void
    {
        $usuario = $this->usuarioModel->getById($id);

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
            return;
        }

        $contacto = $this->contactoModel->getById($contactoId);

        if ($contacto === null) {
            Response::json([
                'success' => false,
                'message' => 'Mensaje de contacto no encontrado'
            ], 404);
            return;
        }

        if ((int) $contacto['usuario_destinatario_id'] !== $id) {
            Response::json([
                'success' => false,
                'message' => 'Ese mensaje no pertenece a este usuario'
            ], 403);
            return;
        }

        $updated = $this->contactoModel->markAsRead($contactoId, $id);

        if (!$updated) {
            Response::json([
                'success' => false,
                'message' => 'El mensaje ya estaba leído o no se pudo actualizar'
            ], 409);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Mensaje de contacto marcado como leído'
        ]);
    }

    // Marca un avistamiento como leído.
    public function marcarAvistamientoLeido(int $id, int $avistamientoId): void
    {
        $usuario = $this->usuarioModel->getById($id);

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
            return;
        }

        $avistamiento = $this->avistamientoModel->getById($avistamientoId);

        if ($avistamiento === null) {
            Response::json([
                'success' => false,
                'message' => 'Avistamiento no encontrado'
            ], 404);
            return;
        }

        if (!$this->avistamientoModel->belongsToOwner($avistamientoId, $id)) {
            Response::json([
                'success' => false,
                'message' => 'Ese avistamiento no pertenece a una mascota de este usuario'
            ], 403);
            return;
        }

        $updated = $this->avistamientoModel->markAsReadForOwner($avistamientoId);

        if (!$updated) {
            Response::json([
                'success' => false,
                'message' => 'El avistamiento ya estaba leído o no se pudo actualizar'
            ], 409);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Avistamiento marcado como leído'
        ]);
    }

    // Crea un usuario nuevo.
    public function store(): void
    {
        $input = Request::json();

        // Seguridad: aunque venga rol en el body, se fuerza siempre a USUARIO
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
