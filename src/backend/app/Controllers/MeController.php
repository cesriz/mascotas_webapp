<?php

declare(strict_types=1);

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';
require_once __DIR__ . '/../Models/UsuarioModel.php';
require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/AvistamientoModel.php';
require_once __DIR__ . '/../Models/ContactoModel.php';
require_once __DIR__ . '/../Validators/UsuarioValidator.php';

class MeController
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

    // Devuelve el perfil privado del usuario autenticado.
    public function perfil(): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            return;
        }

        $perfil = $this->usuarioModel->getPrivateById((int) $usuario['id']);

        if ($perfil === null) {
            Response::json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
            return;
        }

        Response::json([
            'success' => true,
            'data' => $perfil
        ]);
    }

    // Actualiza nombre, apellidos, correo, teléfono y dirección.
    public function updatePerfil(): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            return;
        }

        $input = Request::json();

        $result = UsuarioValidator::validateProfileUpdate($input);

        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);
            return;
        }

        $data = $result['data'];
        $userId = (int) $usuario['id'];

        if ($this->usuarioModel->existsEmailForOtherUser($data['correo'], $userId)) {
            Response::json([
                'success' => false,
                'errors' => ['Ese correo ya está en uso por otro usuario']
            ], 422);
            return;
        }

        $ok = $this->usuarioModel->updateProfileById($userId, $data);

        if (!$ok) {
            Response::json([
                'success' => false,
                'message' => 'No se pudo actualizar el perfil'
            ], 500);
            return;
        }

        $perfilActualizado = $this->usuarioModel->getPrivateById($userId);

        Response::json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente',
            'data' => $perfilActualizado
        ]);
    }

    // Cambia la contraseña del usuario autenticado.
    public function cambiarPassword(): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            return;
        }

        $input = Request::json();

        $result = UsuarioValidator::validatePasswordChange($input);

        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);
            return;
        }

        $data = $result['data'];

        // Request::user() viene del token validado y AuthService ya mete password_hash.
        if (!isset($usuario['password_hash']) || !password_verify($data['current_password'], $usuario['password_hash'])) {
            Response::json([
                'success' => false,
                'errors' => ['La contraseña actual no es correcta']
            ], 422);
            return;
        }

        $ok = $this->usuarioModel->updatePasswordById((int) $usuario['id'], $data['new_password']);

        if (!$ok) {
            Response::json([
                'success' => false,
                'message' => 'No se pudo actualizar la contraseña'
            ], 500);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Contraseña actualizada correctamente'
        ]);
    }

    // "Eliminar cuenta" de forma lógica: desactiva el usuario y limpia token.
    public function eliminarCuenta(): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            return;
        }

        $ok = $this->usuarioModel->deactivateAccountById((int) $usuario['id']);

        if (!$ok) {
            Response::json([
                'success' => false,
                'message' => 'No se pudo eliminar la cuenta'
            ], 500);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Cuenta desactivada correctamente'
        ]);
    }

    // Devuelve las notificaciones del usuario autenticado.
    public function notificaciones(): void
    {
        $usuario = Request::user();
        $userId = (int) $usuario['id'];

        $contactos = $this->contactoModel->getReceivedByUsuarioId($userId);
        $contactosNoLeidos = $this->contactoModel->countUnreadByUsuarioId($userId);

        $avistamientos = $this->avistamientoModel->getReceivedNotificationsByUsuarioId($userId);
        $avistamientosNoLeidos = $this->avistamientoModel->countUnreadReceivedByUsuarioId($userId);

        Response::json([
            'success' => true,
            'data' => [
                'resumen' => [
                    'total_no_leidas' => $contactosNoLeidos + $avistamientosNoLeidos,
                    'contactos_no_leidos' => $contactosNoLeidos,
                    'avistamientos_no_leidos' => $avistamientosNoLeidos
                ],
                'contactos' => $contactos,
                'avistamientos' => $avistamientos
            ]
        ]);
    }

    // Marca un mensaje de contacto como leído.
    public function marcarContactoLeido(int $id): void
    {
        $usuario = Request::user();
        $userId = (int) $usuario['id'];

        $contacto = $this->contactoModel->getById($id);

        if ($contacto === null) {
            Response::json([
                'success' => false,
                'message' => 'Mensaje no encontrado'
            ], 404);
            return;
        }

        if ((int) $contacto['usuario_destinatario_id'] !== $userId) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado para marcar este mensaje'
            ], 403);
            return;
        }

        $ok = $this->contactoModel->markAsRead($id, $userId);

        if (!$ok) {
            Response::json([
                'success' => false,
                'message' => 'No se pudo marcar el mensaje como leído'
            ], 500);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Mensaje marcado como leído'
        ]);
    }

    // Marca un avistamiento recibido como leído.
    public function marcarAvistamientoLeido(int $id): void
    {
        $usuario = Request::user();
        $userId = (int) $usuario['id'];

        $avistamiento = $this->avistamientoModel->getById($id);

        if ($avistamiento === null) {
            Response::json([
                'success' => false,
                'message' => 'Avistamiento no encontrado'
            ], 404);
            return;
        }

        if (!$this->avistamientoModel->belongsToOwner($id, $userId)) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado para marcar este avistamiento'
            ], 403);
            return;
        }

        $ok = $this->avistamientoModel->markAsReadForOwner($id);

        if (!$ok) {
            Response::json([
                'success' => false,
                'message' => 'No se pudo marcar el avistamiento como leído'
            ], 500);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Avistamiento marcado como leído'
        ]);
    }

    // Devuelve las mascotas del usuario autenticado.
    public function mascotas(): void
    {
        $usuario = Request::user();
        $userId = (int) $usuario['id'];

        $mascotas = $this->mascotaModel->getCardsByUsuarioId($userId);

        Response::json([
            'success' => true,
            'data' => $mascotas
        ]);
    }

    // Devuelve los avistamientos creados por el usuario autenticado.
    public function avistamientos(): void
    {
        $usuario = Request::user();
        $userId = (int) $usuario['id'];

        $avistamientos = $this->avistamientoModel->getCardsByUsuarioId($userId);

        Response::json([
            'success' => true,
            'data' => $avistamientos
        ]);
    }
}