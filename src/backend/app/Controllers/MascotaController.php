<?php

declare(strict_types=1);

use Throwable;

require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/UbicacionModel.php';
require_once __DIR__ . '/../Models/MascotaColorModel.php';
require_once __DIR__ . '/../Validators/MascotaValidator.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

class MascotaController
{
    private MascotaModel $mascotaModel;
    private UbicacionModel $ubicacionModel;
    private MascotaColorModel $mascotaColorModel;

    public function __construct()
    {
        // Modelo principal
        $this->mascotaModel = new MascotaModel();

        // Modelo de ubicaciones
        $this->ubicacionModel = new UbicacionModel();

        // Modelo relación mascota-color
        $this->mascotaColorModel = new MascotaColorModel();
    }

    /*
     * Pendiente para más adelante:
     * - Asociar anuncio a usuario_id real
     * - Subida de fotos en FOTOS_ANUNCIOS
     * - Editar mascota
     * - Cambiar estado
     * - Eliminar mascota
     * - Validar que los ids de color existan en la tabla colores
     * - Añadir colores también al index() si el frontend lo necesita
     */

    // Lista mascotas con filtros opcionales
    public function index(): void
    {
        // Filtros desde la URL
        $filters = [
            'estado' => $_GET['estado'] ?? null,
            'especie_id' => isset($_GET['especie_id']) ? (int) $_GET['especie_id'] : null,
            'raza_id' => isset($_GET['raza_id']) ? (int) $_GET['raza_id'] : null,
            'sexo' => $_GET['sexo'] ?? null,
            'tamano' => $_GET['tamano'] ?? null,
            'municipio' => $_GET['municipio'] ?? null,
            'provincia' => $_GET['provincia'] ?? null,
        ];

        // Pedir listado al modelo
        $mascotas = $this->mascotaModel->getAll($filters);

        // Respuesta JSON
        // De momento el listado devuelve mascota + raza + especie + ubicación,
        // pero no añade colores para no complicar el listado todavía
        Response::json([
            'success' => true,
            'data' => $mascotas
        ]);
    }

    // Devuelve una mascota concreta
    public function show(int $id): void
    {
        // Buscar mascota por id
        $mascota = $this->mascotaModel->getById($id);

        // Si no existe
        if ($mascota === null) {
            Response::json([
                'success' => false,
                'message' => 'Mascota no encontrada'
            ], 404);

            // Cortar ejecución para no seguir devolviendo respuesta
            return;
        }

        // Buscar colores asociados a la mascota
        $colores = $this->mascotaColorModel->getByMascotaId($id);

        // Añadir colores al resultado final
        $mascota['colores'] = $colores;

        // Respuesta JSON
        Response::json([
            'success' => true,
            'data' => $mascota
        ]);
    }

    // Crea una nueva mascota
    public function store(): void
    {
        // Leer JSON de entrada
        $input = Request::json();

        // Validar y normalizar datos
        $result = MascotaValidator::validateStore($input);

        // Si hay errores
        if (!empty($result['errors'])) {
            Response::json([
                'success' => false,
                'errors' => $result['errors']
            ], 422);

            // Cortar ejecución para no seguir creando registros
            return;
        }

        // Datos ya limpios
        $data = $result['data'];

        try {
            // Iniciar transacción
            // Como todos los modelos comparten la misma conexión PDO,
            // la transacción afectará también a ubicación y colores
            $this->mascotaModel->beginTransaction();

            // Crear ubicación primero
            $ubicacionId = $this->ubicacionModel->create($data['ubicacion']);

            // Crear mascota después
            $newId = $this->mascotaModel->create([
                'usuario_id' => $data['usuario_id'],
                'nombre' => $data['nombre'],
                'razas_id' => $data['razas_id'],
                'sexo' => $data['sexo'],
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

            // Guardar relación con colores
            $this->mascotaColorModel->syncColors($newId, $data['colores']);

            // Si todo ha ido bien, confirmar cambios
            $this->mascotaModel->commit();

            // Respuesta final
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
            // Si algo falla, deshacer todo lo que se haya hecho
            $this->mascotaModel->rollBack();

            // Respuesta de error genérica
            // Más adelante, en desarrollo, podrías devolver también $e->getMessage()
            Response::json([
                'success' => false,
                'message' => 'Error al crear la mascota'
            ], 500);

            return;
        }
    }
}