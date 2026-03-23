<?php
declare(strict_types=1);

use Throwable;

require_once __DIR__ . '/../Models/AvistamientoModel.php';
require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/UbicacionModel.php';
require_once __DIR__ . '/../Validators/AvistamientoValidator.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

class AvistamientoController
{
    private AvistamientoModel $avistamientoModel;
    private MascotaModel $mascotaModel;
    private UbicacionModel $ubicacionModel;

    public function __construct()
    {
        // Modelo de avistamientos
        $this->avistamientoModel = new AvistamientoModel();

        // Modelo de mascotas
        $this->mascotaModel = new MascotaModel();

        // Modelo de ubicaciones
        $this->ubicacionModel = new UbicacionModel();
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

        // Leer JSON de entrada
        $input = Request::json();

        // Validar y normalizar datos
        $result = AvistamientoValidator::validateStore($input);

        // Si hay errores
        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);

            return;
        }

        // Datos ya limpios
        $data = $result['data'];

        try {
            // Iniciar transacción
            $this->avistamientoModel->beginTransaction();

            // Crear ubicación del avistamiento
            $ubicacionId = $this->ubicacionModel->create($data['ubicacion']);

            // Crear avistamiento
            $newId = $this->avistamientoModel->create([
                'anuncio_mascotas_id' => $mascotaId,
                'usuarios_id' => $data['usuarios_id'],
                'ubicaciones_avistamientos_id' => $ubicacionId,
                'telefono' => $data['telefono'],
                'email' => $data['email'],
                'descripcion' => $data['descripcion'],
                'fecha_avistamiento' => $data['fecha_avistamiento'],
                'hora_avistamiento' => $data['hora_avistamiento'],
            ]);

            // Confirmar cambios
            $this->avistamientoModel->commit();

            // Respuesta final
            Response::json([
                'success' => true,
                'message' => 'Avistamiento creado correctamente',
                'data' => [
                    'id' => $newId,
                    'mascota_id' => $mascotaId,
                    'ubicacion_id' => $ubicacionId
                ]
            ], 201);
        } catch (Throwable $e) {
            // Si algo falla, deshacer todo
            $this->avistamientoModel->rollBack();

            Response::json([
                'success' => false,
                'message' => 'Error al crear el avistamiento'
            ], 500);

            return;
        }
    }
}
