<?php

declare(strict_types=1);

use Throwable;

require_once __DIR__ . '/../Models/AvistamientoModel.php';
require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/UbicacionModel.php';
require_once __DIR__ . '/../Validators/AvistamientoValidator.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';
require_once __DIR__ . '/../Services/AvistamientoService.php';

class AvistamientoController
{
    private AvistamientoModel $avistamientoModel;
    private MascotaModel $mascotaModel;
    private AvistamientoService $avistamientoService;

    public function __construct()
    {
        $this->avistamientoModel = new AvistamientoModel();
        $this->mascotaModel = new MascotaModel();
        $this->avistamientoService = new AvistamientoService();
    }

    /*
     * Pendiente para más adelante:
     * - Asociar usuarios_id real cuando haya autenticación
     * - Validar formato de email
     * - Validar formato de teléfono
     * - Restringir si el estado de la mascota ya no admite avistamientos
     */

    // Lista los avistamientos de una mascota
    public function index(int $mascotaId): void
    {
        // Comprobar que la mascota existe
        $mascota = $this->mascotaModel->getById($mascotaId);

        // Si no existe
        if ($mascota === null) {
            Response::json([
                'success' => false,
                'message' => 'Mascota no encontrada'
            ], 404);

            return;
        }

        // Pedir listado al modelo
        $avistamientos = $this->avistamientoModel->getByMascotaId($mascotaId);

        // Respuesta JSON
        Response::json([
            'success' => true,
            'data' => $avistamientos
        ]);
    }

    // Crea un nuevo avistamiento para una mascota
    public function store(int $mascotaId): void
    {
        $mascota = $this->mascotaModel->getById($mascotaId);

        if ($mascota === null) {
            Response::json([
                'success' => false,
                'message' => 'Mascota no encontrada'
            ], 404);
            return;
        }

        $input = Request::json();

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
            $created = $this->avistamientoService->create($mascotaId, $data);

            Response::json([
                'success' => true,
                'message' => 'Avistamiento creado correctamente',
                'data' => $created
            ], 201);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al crear el avistamiento'
            ], 500);
        }
    }
}
