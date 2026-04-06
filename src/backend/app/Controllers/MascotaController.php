<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/UbicacionModel.php';
require_once __DIR__ . '/../Models/MascotaColorModel.php';
require_once __DIR__ . '/../Models/AvistamientoModel.php';
require_once __DIR__ . '/../Models/UsuarioModel.php';
require_once __DIR__ . '/../Models/FotoModel.php';
require_once __DIR__ . '/../Validators/MascotaValidator.php';
require_once __DIR__ . '/../Helpers/FileHelper.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

class MascotaController
{
    private MascotaModel $mascotaModel;
    private UbicacionModel $ubicacionModel;
    private MascotaColorModel $mascotaColorModel;
    private AvistamientoModel $avistamientoModel;
    private UsuarioModel $usuarioModel;
    private FotoModel $fotoModel;

    public function __construct()
    {
        $this->mascotaModel = new MascotaModel();
        $this->ubicacionModel = new UbicacionModel();
        $this->mascotaColorModel = new MascotaColorModel();
        $this->avistamientoModel = new AvistamientoModel();
        $this->usuarioModel = new UsuarioModel();
        $this->fotoModel = new FotoModel();
    }

    // Comprueba que la mascota exista y que sea del usuario autenticado.
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

    // Lista mascotas aplicando filtros, orden y paginación.
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

    // Devuelve las mascotas recientes para la home.
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

    // Devuelve el detalle completo de una mascota.
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

    // Crea una mascota nueva usando el usuario autenticado como propietario.
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

        // El usuario autenticado manda sobre cualquier usuario_id que venga del frontend.
        $data['usuario_id'] = (int) $usuario['id'];

        try {
            $this->mascotaModel->beginTransaction();

            $ubicacionId = $this->ubicacionModel->create($data['ubicacion']);

            $newId = $this->mascotaModel->create([
                'usuario_id' => $data['usuario_id'],
                'nombre' => $data['nombre'],
                'raza_id' => $data['raza_id'],
                'sexo' => $data['sexo'],
                'tiene_chip' => $data['tiene_chip'],
                'tamano' => $data['tamano'],
                'peso' => $data['peso'],
                'fecha_nacimiento' => $data['fecha_nacimiento'],
                'descripcion' => $data['descripcion'],
                'fecha_perdida' => $data['fecha_perdida'],
                'fecha_encontrada' => $data['fecha_encontrada'],
                'fecha_recuperada' => $data['fecha_recuperada'],
                'estado' => $data['estado'],
                'recompensa' => $data['recompensa'],
                'ubicaciones_perdida_id' => $ubicacionId,
            ]);

            $this->mascotaColorModel->syncColors($newId, $data['colores']);
            $this->mascotaModel->commit();

            Response::json([
                'success' => true,
                'message' => 'Mascota creada correctamente',
                'data' => [
                    'id' => $newId,
                    'ubicacion_id' => $ubicacionId,
                    'colores' => $data['colores']
                ]
            ], 201);
        } catch (Throwable $e) {
            $this->mascotaModel->rollBack();

            Response::json([
                'success' => false,
                'message' => 'Error al crear la mascota',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Actualiza una mascota solo si pertenece al usuario autenticado.
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

        // El backend fija siempre el propietario real.
        $data['usuario_id'] = $userId;

        try {
            $this->mascotaModel->beginTransaction();

            $this->mascotaModel->update($id, [
                'usuario_id' => $data['usuario_id'],
                'nombre' => $data['nombre'],
                'raza_id' => $data['raza_id'],
                'sexo' => $data['sexo'],
                'tiene_chip' => $data['tiene_chip'],
                'tamano' => $data['tamano'],
                'peso' => $data['peso'],
                'fecha_nacimiento' => $data['fecha_nacimiento'],
                'descripcion' => $data['descripcion'],
                'fecha_perdida' => $data['fecha_perdida'],
                'fecha_encontrada' => $data['fecha_encontrada'],
                'fecha_recuperada' => $data['fecha_recuperada'],
                'estado' => $data['estado'],
                'recompensa' => $data['recompensa'],
            ]);

            $this->ubicacionModel->update((int) $mascota['ubicacion_id'], $data['ubicacion']);
            $this->mascotaColorModel->syncColors($id, $data['colores']);

            $this->mascotaModel->commit();

            Response::json([
                'success' => true,
                'message' => 'Mascota actualizada correctamente',
                'data' => [
                    'id' => $id,
                    'ubicacion_id' => (int) $mascota['ubicacion_id'],
                    'colores' => $data['colores']
                ]
            ]);
        } catch (Throwable $e) {
            $this->mascotaModel->rollBack();

            Response::json([
                'success' => false,
                'message' => 'Error al actualizar la mascota',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Marca una mascota como recuperada si pertenece al usuario autenticado.
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

    // Borra una mascota y todo lo que depende de ella.
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

        $fileUrlsToDelete = [];
        $ubicacionesAvistamientosIds = [];

        foreach ($mascotaFotos as $foto) {
            if (!empty($foto['url'])) {
                $fileUrlsToDelete[] = $foto['url'];
            }
        }

        foreach ($avistamientos as $avistamiento) {
            $avistamientoId = (int) $avistamiento['id'];
            $ubicacionesAvistamientosIds[] = (int) $avistamiento['ubicacion_id'];

            $fotosAvistamiento = $this->fotoModel->getByAvistamientoId($avistamientoId);

            foreach ($fotosAvistamiento as $foto) {
                if (!empty($foto['url'])) {
                    $fileUrlsToDelete[] = $foto['url'];
                }
            }
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

            $this->deletePhysicalFiles($fileUrlsToDelete);

            Response::json([
                'success' => true,
                'message' => 'Mascota y datos relacionados eliminados correctamente',
                'data' => [
                    'id' => $id,
                    'avistamientos_eliminados' => count($avistamientos),
                    'fotos_eliminadas' => count($fileUrlsToDelete)
                ]
            ]);
        } catch (Throwable $e) {
            $this->mascotaModel->rollBack();

            Response::json([
                'success' => false,
                'message' => 'Error al eliminar la mascota y sus datos relacionados',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Sube una o varias fotos y las asocia a una mascota existente.
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
            $savedFiles = FileHelper::saveImages(
                Request::file('fotos'),
                'mascotas'
            );

            foreach ($savedFiles as $file) {
                $this->fotoModel->createForMascota($id, $file);
            }

            Response::json([
                'success' => true,
                'message' => 'Fotos subidas correctamente',
                'data' => $this->fotoModel->getByMascotaId($id)
            ], 201);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al subir las fotos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Intenta borrar del disco los archivos ya eliminados en base de datos.
    private function deletePhysicalFiles(array $urls): void
    {
        $uniqueUrls = array_values(array_unique(array_filter($urls)));

        foreach ($uniqueUrls as $url) {
            $path = __DIR__ . '/../../public' . $url;

            if (is_file($path)) {
                @unlink($path);
            }
        }
    }
}