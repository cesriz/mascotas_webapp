<?php
declare(strict_types=1);

use Throwable;

require_once __DIR__ . '/../Models/AvistamientoModel.php';
require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/UbicacionModel.php';
require_once __DIR__ . '/../Models/FotoModel.php';
require_once __DIR__ . '/../Validators/AvistamientoValidator.php';
require_once __DIR__ . '/../Helpers/FileHelper.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

class AvistamientoController
{
    private AvistamientoModel $avistamientoModel;
    private MascotaModel $mascotaModel;
    private UbicacionModel $ubicacionModel;
    private FotoModel $fotoModel;

    public function __construct()
    {
        $this->avistamientoModel = new AvistamientoModel();
        $this->mascotaModel = new MascotaModel();
        $this->ubicacionModel = new UbicacionModel();
        $this->fotoModel = new FotoModel();
    }

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

        $input = $this->getInputData();

        /*
         * Caso 1: usuario autenticado
         * Guardamos su usuario_id real y, si faltan datos de contacto,
         * podemos completar con su perfil.
         */
        if ($usuario !== null) {
            $input['usuario_id'] = (int) $usuario['id'];

            if (empty($input['telefono']) && !empty($usuario['telefono'])) {
                $input['telefono'] = $usuario['telefono'];
            }

            if (empty($input['correo']) && !empty($usuario['correo'])) {
                $input['correo'] = $usuario['correo'];
            }
        } else {
            /*
             * Caso 2: usuario público / anónimo
             * No hay usuario interno asociado.
             */
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
            $this->avistamientoModel->beginTransaction();

            $ubicacionId = $this->ubicacionModel->create($data['ubicacion']);

            $newId = $this->avistamientoModel->create([
                'mascota_id' => $mascotaId,
                'usuario_id' => $data['usuario_id'], // puede ser int o null
                'ubicaciones_avistamientos_id' => $ubicacionId,
                'telefono' => $data['telefono'],
                'correo' => $data['correo'],
                'descripcion' => $data['descripcion'],
                'fecha_hora' => $data['fecha_hora'],
            ]);

            if (Request::hasFile('fotos')) {
                $savedFiles = FileHelper::saveImages(Request::file('fotos'), 'avistamientos');

                foreach ($savedFiles as $file) {
                    $this->fotoModel->createForAvistamiento($newId, $file);
                }
            }

            $this->avistamientoModel->commit();

            Response::json([
                'success' => true,
                'message' => 'Avistamiento creado correctamente',
                'data' => [
                    'id' => $newId,
                    'mascota_id' => $mascotaId,
                    'usuario_id' => $data['usuario_id'],
                    'ubicacion_id' => $ubicacionId
                ]
            ], 201);
        } catch (Throwable $e) {
            $this->avistamientoModel->rollBack();

            Response::json([
                'success' => false,
                'message' => 'Error al crear el avistamiento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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
}