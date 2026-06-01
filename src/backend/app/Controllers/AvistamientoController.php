<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/AvistamientoModel.php';
require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/FotoModel.php';
require_once __DIR__ . '/../Services/AvistamientoService.php';
require_once __DIR__ . '/../Validators/AvistamientoValidator.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';
require_once __DIR__ . '/../Services/AuthService.php';
require_once __DIR__ . '/../Helpers/FileHelper.php';

/**
 * Controlador de avistamientos.
 *
 * Mantiene en controlador:
 * - comprobaciones simples
 * - lectura de input
 * - validación
 * - respuesta HTTP
 *
 * Deja en service:
 * - creación compleja con ubicación y fotos
 */
class AvistamientoController
{
    private AvistamientoModel $avistamientoModel;
    private MascotaModel $mascotaModel;
    private FotoModel $fotoModel;
    private AvistamientoService $avistamientoService;
    private AuthService $authService;

    /**
     * Inicializa modelos y servicio.
     */
    public function __construct()
    {
        $this->avistamientoModel = new AvistamientoModel();
        $this->mascotaModel = new MascotaModel();
        $this->fotoModel = new FotoModel();
        $this->avistamientoService = new AvistamientoService();
        $this->authService = new AuthService();
    }

    /**
     * Lista los avistamientos de una mascota concreta.
     */
    public function index(int $mascotaId): void
    {
        $mascota = $this->mascotaModel->getById($mascotaId);

        if ($mascota === null) {
            Response::json([
                'success' => false,
                'message' => 'Mascota no encontrada'
            ], 404);
            return;
        }

        $avistamientos = $this->avistamientoModel->getByMascotaId($mascotaId);

        foreach ($avistamientos as &$avistamiento) {
            $avistamiento['fotos'] = $this->fotoModel->getByAvistamientoId((int) $avistamiento['id']);
        }

        Response::json([
            'success' => true,
            'data' => $avistamientos
        ]);
    }

    /**
     * Crea un nuevo avistamiento para una mascota.
     *
     * Acepta dos casos:
     * - usuario autenticado
     * - usuario público/anónimo
     */
    public function store(int $mascotaId): void
    {
        $usuario = $this->getOptionalUser();
        $mascota = $this->mascotaModel->getById($mascotaId);

        if ($mascota === null) {
            Response::json([
                'success' => false,
                'message' => 'Mascota no encontrada'
            ], 404);
            return;
        }

        $input = $this->getInputData();

        if ($usuario !== null) {
            $input['usuario_id'] = (int) $usuario['id'];

            if (empty($input['telefono']) && !empty($usuario['telefono'])) {
                $input['telefono'] = $usuario['telefono'];
            }

            if (empty($input['correo']) && !empty($usuario['correo'])) {
                $input['correo'] = $usuario['correo'];
            }
        } else {
            $input['usuario_id'] = null;
        }

        $result = AvistamientoValidator::validateStore($input);

        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);
            return;
        }

        $data = $result['data'];

        try {
            $created = $this->avistamientoService->create(
                $mascotaId,
                $data,
                Request::hasFile('fotos') ? Request::file('fotos') : null
            );

            Response::json([
                'success' => true,
                'message' => 'Avistamiento creado correctamente',
                'data' => $created
            ], 201);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al crear el avistamiento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Intenta obtener el usuario autenticado actual sin obligar a que exista.
     */
    private function getOptionalUser(): ?array
    {
        return $this->authService->validateCurrentToken();
    }

    /**
     * Obtiene los datos de entrada.
     *
     * Soporta:
     * - multipart/form-data
     * - JSON
     */
    private function getInputData(): array
    {
        if (!empty($_POST)) {
            return [
                'telefono' => Request::input('telefono'),
                'correo' => Request::input('correo'),
                'descripcion' => Request::input('descripcion'),
                'fecha_hora' => Request::input('fecha_hora'),
                'ubicacion' => [
                    'latitud' => Request::input('latitud'),
                    'longitud' => Request::input('longitud'),
                    'direccion_formateada' => Request::input('direccion_formateada'),
                    'municipio' => Request::input('municipio'),
                    'provincia' => Request::input('provincia'),
                    'codigo_postal' => Request::input('codigo_postal'),
                    'pais' => Request::input('pais'),
                    'descripcion' => Request::input('ubicacion_descripcion'),
                ]
            ];
        }

        return Request::json();
    }

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

        $avistamiento = $this->avistamientoModel->getByIdWithOwner($id);

        if ($avistamiento === null) {
            Response::json([
                'success' => false,
                'message' => 'Avistamiento no encontrado'
            ], 404);
            return;
        }

        $esAutor = (int) $avistamiento['usuario_id'] === (int) $usuario['id'];
        $esDuenoMascota = (int) $avistamiento['propietario_mascota_id'] === (int) $usuario['id'];
        $esAdmin = ($usuario['rol'] ?? null) === 'ADMIN';

        if (!$esDuenoMascota && !$esAdmin && !$esAutor) {
            Response::json([
                'success' => false,
                'message' => 'No tienes permiso para eliminar este avistamiento'
            ], 403);
            return;
        }

        try {
            $deleted = $this->avistamientoService->delete($id);

            if (!$deleted) {
                Response::json([
                    'success' => false,
                    'message' => 'No se pudo eliminar el avistamiento'
                ], 500);
                return;
            }

            Response::json([
                'success' => true,
                'message' => 'Avistamiento eliminado correctamente',
                'data' => [
                    'id' => $id
                ]
            ]);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al eliminar el avistamiento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteFoto(int $fotoId): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            return;
        }

        $foto = $this->fotoModel->getAvistamientoFotoById($fotoId);

        if ($foto === null) {
            Response::json([
                'success' => false,
                'message' => 'Foto no encontrada'
            ], 404);
            return;
        }

        $esAutor = (int) $foto['autor_avistamiento_id'] === (int) $usuario['id'];
        $esDuenoMascota = (int) $foto['propietario_mascota_id'] === (int) $usuario['id'];
        $esAdmin = ($usuario['rol'] ?? null) === 'ADMIN';

        if (!$esDuenoMascota && !$esAdmin && !$esAutor) {
            Response::json([
                'success' => false,
                'message' => 'No tienes permiso para eliminar esta foto'
            ], 403);
            return;
        }

        try {
            FileHelper::destroyImage($foto['public_id'] ?? null);

            $deleted = $this->fotoModel->deleteAvistamientoFotoById($fotoId);

            if (!$deleted) {
                Response::json([
                    'success' => false,
                    'message' => 'No se pudo eliminar la foto'
                ], 500);
                return;
            }

            $this->fotoModel->ensureAvistamientoHasPrincipal((int) $foto['avistamiento_id']);

            Response::json([
                'success' => true,
                'message' => 'Foto de avistamiento eliminada correctamente',
                'data' => [
                    'id' => $fotoId,
                    'avistamiento_id' => (int) $foto['avistamiento_id']
                ]
            ]);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al eliminar la foto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
