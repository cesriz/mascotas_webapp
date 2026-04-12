<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/AdminModel.php';
require_once __DIR__ . '/../Models/ReporteModel.php';
require_once __DIR__ . '/../Models/SoporteModel.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

/**
 * Controlador de administración.
 *
 * Gestiona operaciones reservadas al rol ADMIN:
 * - moderación de anuncios
 * - revisión de reportes
 * - gestión de soporte
 * - activación/desactivación de usuarios
 */
class AdminController
{
    private AdminModel $adminModel;
    private ReporteModel $reporteModel;
    private SoporteModel $soporteModel;

    /**
     * Inicializa los modelos necesarios para la parte admin.
     */
    public function __construct()
    {
        $this->adminModel = new AdminModel();
        $this->reporteModel = new ReporteModel();
        $this->soporteModel = new SoporteModel();
    }

    /**
     * Devuelve el listado de anuncios para moderación.
     */
    public function anuncios(): void
    {
        $data = $this->adminModel->getAnunciosModeracion();

        Response::json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Cambia el estado de publicación de un anuncio.
     *
     * Estados permitidos:
     * - PUBLICADO
     * - OCULTO
     */
    public function cambiarEstadoAnuncio(int $id): void
    {
        $input = Request::json();
        $estado = strtoupper(trim((string) ($input['estado_publicacion'] ?? '')));

        if (!in_array($estado, ['PUBLICADO', 'OCULTO'], true)) {
            Response::json([
                'success' => false,
                'message' => 'estado_publicacion no válido'
            ], 422);
            return;
        }

        $ok = $this->adminModel->changeEstadoPublicacionAnuncio($id, $estado);

        if (!$ok) {
            Response::json([
                'success' => false,
                'message' => 'No se pudo cambiar el estado del anuncio'
            ], 500);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Estado del anuncio actualizado correctamente'
        ]);
    }

    /**
     * Elimina un anuncio desde el panel de administración.
     */
    public function eliminarAnuncio(int $id): void
    {
        $ok = $this->adminModel->deleteAnuncio($id);

        if (!$ok) {
            Response::json([
                'success' => false,
                'message' => 'No se pudo eliminar el anuncio'
            ], 500);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Anuncio eliminado correctamente'
        ]);
    }

    /**
     * Devuelve todos los reportes con información relacionada.
     */
    public function reportes(): void
    {
        $data = $this->reporteModel->getAllWithRelations();

        Response::json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Cambia el estado de un reporte.
     *
     * Estados permitidos:
     * - PENDIENTE
     * - REVISADO
     * - DESCARTADO
     */
    public function cambiarEstadoReporte(int $id): void
    {
        $usuario = Request::user();
        $input = Request::json();

        $estado = strtoupper(trim((string) ($input['estado'] ?? '')));
        $notasAdmin = isset($input['notas_admin']) ? trim((string) $input['notas_admin']) : null;

        if (!in_array($estado, ['PENDIENTE', 'REVISADO', 'DESCARTADO'], true)) {
            Response::json([
                'success' => false,
                'message' => 'estado no válido'
            ], 422);
            return;
        }

        $ok = $this->reporteModel->updateEstado($id, $estado, (int) $usuario['id'], $notasAdmin);

        if (!$ok) {
            Response::json([
                'success' => false,
                'message' => 'No se pudo actualizar el reporte'
            ], 500);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Reporte actualizado correctamente'
        ]);
    }

    /**
     * Devuelve todos los mensajes de soporte con sus relaciones.
     */
    public function soporte(): void
    {
        $data = $this->soporteModel->getAllWithRelations();

        Response::json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Cambia el estado de un mensaje de soporte.
     *
     * Estados permitidos:
     * - ABIERTO
     * - CERRADO
     */
    public function cambiarEstadoSoporte(int $id): void
    {
        $usuario = Request::user();
        $input = Request::json();

        $estado = strtoupper(trim((string) ($input['estado'] ?? '')));
        $notasAdmin = isset($input['notas_admin']) ? trim((string) $input['notas_admin']) : null;

        if (!in_array($estado, ['ABIERTO', 'CERRADO'], true)) {
            Response::json([
                'success' => false,
                'message' => 'estado no válido'
            ], 422);
            return;
        }

        $ok = $this->soporteModel->updateEstado($id, $estado, (int) $usuario['id'], $notasAdmin);

        if (!$ok) {
            Response::json([
                'success' => false,
                'message' => 'No se pudo actualizar el mensaje de soporte'
            ], 500);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Mensaje de soporte actualizado correctamente'
        ]);
    }

    /**
     * Devuelve el listado de usuarios para gestión administrativa.
     */
    public function usuarios(): void
    {
        $data = $this->adminModel->getUsuariosGestion();

        Response::json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Activa o desactiva un usuario.
     *
     * Valores permitidos:
     * - 1 = activo
     * - 0 = inactivo
     */
    public function cambiarEstadoUsuario(int $id): void
    {
        $input = Request::json();
        $activo = isset($input['activo']) ? (int) $input['activo'] : -1;

        if (!in_array($activo, [0, 1], true)) {
            Response::json([
                'success' => false,
                'message' => 'activo debe ser 0 o 1'
            ], 422);
            return;
        }

        $ok = $this->adminModel->changeEstadoUsuario($id, $activo);

        if (!$ok) {
            Response::json([
                'success' => false,
                'message' => 'No se pudo actualizar el estado del usuario'
            ], 500);
            return;
        }

        Response::json([
            'success' => true,
            'message' => 'Estado del usuario actualizado correctamente'
        ]);
    }
}