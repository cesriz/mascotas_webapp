<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/MascotaColorModel.php';
require_once __DIR__ . '/../Models/AvistamientoModel.php';
require_once __DIR__ . '/../Models/UsuarioModel.php';
require_once __DIR__ . '/../Models/FotoModel.php';
require_once __DIR__ . '/../Models/UbicacionModel.php';
require_once __DIR__ . '/../Services/MascotaService.php';
require_once __DIR__ . '/../Validators/MascotaValidator.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';
require_once __DIR__ . '/../Helpers/FileHelper.php';

/**
 * Controlador de mascotas.
 *
 * Mantiene la lógica simple en controlador:
 * - listados
 * - detalle
 * - comprobación de pertenencia
 * - respuestas HTTP
 *
 * Delega en service la lógica compleja:
 * - crear mascota
 * - actualizar mascota
 * - subir fotos
 */
class MascotaController
{
    private MascotaModel $mascotaModel;
    private MascotaColorModel $mascotaColorModel;
    private AvistamientoModel $avistamientoModel;
    private UsuarioModel $usuarioModel;
    private FotoModel $fotoModel;
    private UbicacionModel $ubicacionModel;
    private MascotaService $mascotaService;

    /**
     * Inicializa modelos y servicio.
     */
    public function __construct()
    {
        $this->mascotaModel = new MascotaModel();
        $this->mascotaColorModel = new MascotaColorModel();
        $this->avistamientoModel = new AvistamientoModel();
        $this->usuarioModel = new UsuarioModel();
        $this->fotoModel = new FotoModel();
        $this->ubicacionModel = new UbicacionModel();
        $this->mascotaService = new MascotaService();
    }

    /**
     * Comprueba que la mascota exista y que pertenezca al usuario autenticado.
     */
    private function getOwnedMascotaOrFail(int $mascotaId, int $userId): array
    {
        $mascota = $this->mascotaModel->getById($mascotaId);

        if ($mascota === null) {
            Response::json([
                'success' => false,
                'message' => 'Mascota no encontrada'
            ], 404);
            exit;
        }

        if ((int) $mascota['usuario_id'] !== $userId) {
            Response::json([
                'success' => false,
                'message' => 'No tienes permiso para acceder a esta mascota'
            ], 403);
            exit;
        }

        return $mascota;
    }

    /**
     * Lista mascotas públicas con filtros, orden y paginación.
     */
    public function index(): void
    {
        $result = MascotaValidator::validateIndexFilters($_GET);

        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);
            return;
        }

        $filters = $result['data'];

        $mascotas = $this->mascotaModel->getCards($filters);
        $total = $this->mascotaModel->countCards($filters);

        $page = (int) $filters['page'];
        $limit = (int) $filters['limit'];
        $pages = $limit > 0 ? (int) ceil($total / $limit) : 1;

        Response::json([
            'success' => true,
            'data' => $mascotas,
            'meta' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => $pages,
                'has_next_page' => $page < $pages,
                'has_prev_page' => $page > 1,
                'filters' => $filters
            ]
        ]);
    }

    /**
     * Devuelve las mascotas recientes para la home.
     */
    public function recientes(): void
    {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 4;

        if ($limit <= 0) {
            $limit = 4;
        }

        $mascotas = $this->mascotaModel->getRecentCards($limit);

        Response::json([
            'success' => true,
            'data' => $mascotas
        ]);
    }

    /**
     * Devuelve el detalle completo de una mascota.
     */
    public function show(int $id): void
    {
        $mascota = $this->mascotaModel->getById($id);

        if ($mascota === null) {
            Response::json([
                'success' => false,
                'message' => 'Mascota no encontrada'
            ], 404);
            return;
        }

        $usuario = Request::user();

        if (($mascota['estado_publicacion'] ?? 'PUBLICADO') === 'OCULTO') {
            $esDueno = $usuario !== null && (int) $usuario['id'] === (int) $mascota['usuario_id'];
            $esAdmin = $usuario !== null && ($usuario['rol'] ?? null) === 'ADMIN';

            if (!$esDueno && !$esAdmin) {
                Response::json([
                    'success' => false,
                    'message' => 'Anuncio no disponible'
                ], 403);
                return;
            }
        }

        $mascota['colores'] = $this->mascotaColorModel->getByMascotaId($id);
        $mascota['fotos'] = $this->fotoModel->getByMascotaId($id);
        $mascota['dueno'] = !empty($mascota['usuario_id'])
            ? $this->usuarioModel->getPublicById((int) $mascota['usuario_id'])
            : null;

        $avistamientos = $this->avistamientoModel->getByMascotaId($id);

        foreach ($avistamientos as &$avistamiento) {
            $avistamiento['fotos'] = $this->fotoModel->getByAvistamientoId((int) $avistamiento['id']);
        }

        $mascota['avistamientos'] = $avistamientos;

        Response::json([
            'success' => true,
            'data' => $mascota
        ]);
    }

    /**
     * Crea una mascota nueva del usuario autenticado.
     *
     * El controlador valida y delega la operación compleja al servicio.
     */
    public function store(): void
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
        $result = MascotaValidator::validateStore($input);

        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);
            return;
        }

        $data = $result['data'];
        $data['usuario_id'] = (int) $usuario['id'];

        try {
            $created = $this->mascotaService->create($data);

            Response::json([
                'success' => true,
                'message' => 'Mascota creada correctamente',
                'data' => $created
            ], 201);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al crear la mascota',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualiza una mascota del usuario autenticado.
     *
     * El controlador valida y el service ejecuta la operación transaccional.
     */
    public function update(int $id): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            return;
        }

        $userId = (int) $usuario['id'];
        $mascota = $this->getOwnedMascotaOrFail($id, $userId);

        $input = Request::json();
        $result = MascotaValidator::validateUpdate($input);

        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);
            return;
        }

        $data = $result['data'];
        $data['usuario_id'] = $userId;

        try {
            $updated = $this->mascotaService->update(
                $id,
                (int) $mascota['ubicacion_id'],
                $data
            );

            Response::json([
                'success' => true,
                'message' => 'Mascota actualizada correctamente',
                'data' => $updated
            ]);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al actualizar la mascota',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marca una mascota como recuperada.
     *
     * Esta acción sigue siendo simple y se puede mantener aquí.
     */
    public function marcarRecuperada(int $id): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            return;
        }

        $userId = (int) $usuario['id'];
        $mascota = $this->getOwnedMascotaOrFail($id, $userId);

        if (($mascota['estado'] ?? null) === 'RECUPERADA') {
            Response::json([
                'success' => false,
                'message' => 'La mascota ya está marcada como recuperada'
            ], 422);
            return;
        }

        $fechaRecuperada = date('Y-m-d');

        try {
            $this->mascotaModel->update($id, [
                'usuario_id' => $mascota['usuario_id'],
                'nombre' => $mascota['nombre'],
                'raza_id' => $mascota['raza_id'],
                'sexo' => $mascota['sexo'],
                'tiene_chip' => $mascota['tiene_chip'],
                'tamano' => $mascota['tamano'],
                'peso' => $mascota['peso'],
                'fecha_nacimiento' => $mascota['fecha_nacimiento'],
                'descripcion' => $mascota['descripcion'],
                'fecha_perdida' => $mascota['fecha_perdida'],
                'fecha_encontrada' => $mascota['fecha_encontrada'],
                'fecha_recuperada' => $fechaRecuperada,
                'estado' => 'RECUPERADA',
                'recompensa' => $mascota['recompensa'],
            ]);

            Response::json([
                'success' => true,
                'message' => 'Mascota marcada como recuperada correctamente',
                'data' => [
                    'id' => $id,
                    'estado' => 'RECUPERADA',
                    'fecha_recuperada' => $fechaRecuperada
                ]
            ]);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al marcar la mascota como recuperada',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Borra una mascota y sus datos relacionados.
     *
     * De momento la dejamos como está en controller porque ya tiene
     * una lógica concreta que no querías mover todavía.
     */
    public function destroy(int $id): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            return;
        }

        $userId = (int) $usuario['id'];
        $mascota = $this->getOwnedMascotaOrFail($id, $userId);

        $mascotaFotos = $this->fotoModel->getByMascotaId($id);
        $avistamientos = $this->avistamientoModel->getByMascotaId($id);

        $fotosToDelete = $mascotaFotos;
        $ubicacionesAvistamientosIds = [];

        foreach ($avistamientos as $avistamiento) {
            $avistamientoId = (int) $avistamiento['id'];
            $ubicacionesAvistamientosIds[] = (int) $avistamiento['ubicacion_id'];

            $fotosAvistamiento = $this->fotoModel->getByAvistamientoId($avistamientoId);

            $fotosToDelete = array_merge($fotosToDelete, $fotosAvistamiento);
        }

        try {
            $this->mascotaModel->beginTransaction();

            foreach ($avistamientos as $avistamiento) {
                $this->fotoModel->deleteByAvistamientoId((int) $avistamiento['id']);
            }

            $this->avistamientoModel->deleteByMascotaId($id);

            foreach ($ubicacionesAvistamientosIds as $ubicacionId) {
                $this->ubicacionModel->deletePublicById($ubicacionId);
            }

            $this->fotoModel->deleteByMascotaId($id);
            $this->mascotaColorModel->deleteByMascotaId($id);
            $this->mascotaModel->deletePublicById($id);
            $this->ubicacionModel->deletePublicById((int) $mascota['ubicacion_id']);

            $this->mascotaModel->commit();

            FileHelper::destroyImages($fotosToDelete);

            Response::json([
                'success' => true,
                'message' => 'Mascota y datos relacionados eliminados correctamente',
                'data' => [
                    'id' => $id,
                    'avistamientos_eliminados' => count($avistamientos),
                    'fotos_eliminadas' => count($fotosToDelete)
                ]
            ]);
        } catch (Throwable $e) {
            $this->mascotaModel->rollBack();

            Response::json([
                'success' => false,
                'message' => $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sube fotos para una mascota ya existente.
     *
     * La parte compleja de guardado físico y base de datos se delega al service.
     */
    public function uploadFotos(int $id): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            return;
        }

        $userId = (int) $usuario['id'];
        $this->getOwnedMascotaOrFail($id, $userId);

        if (!Request::hasFile('fotos')) {
            Response::json([
                'success' => false,
                'message' => 'Debes enviar al menos una imagen en el campo fotos'
            ], 422);
            return;
        }

        try {
            $fotos = $this->mascotaService->uploadFotos(
                $id,
                Request::file('fotos')
            );

            Response::json([
                'success' => true,
                'message' => 'Fotos subidas correctamente',
                'data' => $fotos
            ], 201);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al subir las fotos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}