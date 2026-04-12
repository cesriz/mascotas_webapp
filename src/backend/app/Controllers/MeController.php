<?php

declare(strict_types=1);

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';
require_once __DIR__ . '/../Models/UsuarioModel.php';
require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/AvistamientoModel.php';
require_once __DIR__ . '/../Models/ContactoModel.php';
require_once __DIR__ . '/../Validators/UsuarioValidator.php';

/**
 * Controlador de la zona privada del usuario autenticado.
 *
 * Aquí se agrupan las acciones que solo puede ejecutar
 * el usuario que ha iniciado sesión:
 * - ver y editar su perfil
 * - cambiar contraseña
 * - desactivar su cuenta
 * - consultar sus mascotas y avistamientos
 * - consultar y marcar notificaciones
 */
class MeController
{
    private UsuarioModel $usuarioModel;
    private MascotaModel $mascotaModel;
    private AvistamientoModel $avistamientoModel;
    private ContactoModel $contactoModel;

    /**
     * Inicializa los modelos necesarios.
     */
    public function __construct()
    {
        $this->usuarioModel = new UsuarioModel();
        $this->mascotaModel = new MascotaModel();
        $this->avistamientoModel = new AvistamientoModel();
        $this->contactoModel = new ContactoModel();
    }

    /**
     * Obtiene el usuario autenticado desde Request.
     *
     * Si no existe, responde 401 y corta la ejecución.
     */
    private function getAuthUserOrFail(): array
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            exit;
        }

        return $usuario;
    }

    /**
     * Devuelve el perfil privado del usuario autenticado.
     */
    public function perfil(): void
    {
        $usuario = $this->getAuthUserOrFail();
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

    /**
     * Actualiza los datos del perfil del usuario autenticado.
     *
     * Campos esperados:
     * - nombre
     * - apellidos
     * - correo
     * - telefono
     * - direccion
     */
    public function updatePerfil(): void
    {
        $usuario = $this->getAuthUserOrFail();
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

    /**
     * Cambia la contraseña del usuario autenticado.
     *
     * Se comprueba:
     * - que la contraseña actual sea correcta
     * - que la nueva cumpla la validación definida
     */
    public function cambiarPassword(): void
    {
        $usuario = $this->getAuthUserOrFail();
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

        if (
            !isset($usuario['password_hash']) ||
            !password_verify($data['current_password'], $usuario['password_hash'])
        ) {
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

    /**
     * Desactiva la cuenta del usuario autenticado.
     *
     * Se trata de una baja lógica, no de un borrado físico.
     */
    public function eliminarCuenta(): void
    {
        $usuario = $this->getAuthUserOrFail();

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

    /**
     * Devuelve las notificaciones del usuario autenticado.
     *
     * Incluye:
     * - mensajes de contacto recibidos
     * - avistamientos recibidos sobre sus mascotas
     * - resumen de no leídas
     */
    public function notificaciones(): void
    {
        $usuario = $this->getAuthUserOrFail();
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

    /**
     * Marca un mensaje de contacto como leído.
     *
     * Solo puede hacerlo el usuario destinatario del mensaje.
     */
    public function marcarContactoLeido(int $id): void
    {
        $usuario = $this->getAuthUserOrFail();
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

    /**
     * Marca como leído un avistamiento recibido sobre una mascota del usuario.
     */
    public function marcarAvistamientoLeido(int $id): void
    {
        $usuario = $this->getAuthUserOrFail();
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

    /**
     * Devuelve las mascotas publicadas por el usuario autenticado.
     */
    public function mascotas(): void
    {
        $usuario = $this->getAuthUserOrFail();
        $userId = (int) $usuario['id'];

        $mascotas = $this->mascotaModel->getCardsByUsuarioId($userId);

        Response::json([
            'success' => true,
            'data' => $mascotas
        ]);
    }

    /**
     * Devuelve los avistamientos creados por el usuario autenticado.
     */
    public function avistamientos(): void
    {
        $usuario = $this->getAuthUserOrFail();
        $userId = (int) $usuario['id'];

        $avistamientos = $this->avistamientoModel->getCardsByUsuarioId($userId);

        Response::json([
            'success' => true,
            'data' => $avistamientos
        ]);
    }
}