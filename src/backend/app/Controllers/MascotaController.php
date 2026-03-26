<?php

declare(strict_types=1);

use Throwable;

require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/UbicacionModel.php';
require_once __DIR__ . '/../Models/MascotaColorModel.php';
require_once __DIR__ . '/../Validators/MascotaValidator.php';
require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';
require_once __DIR__ . '/../Services/MascotaService.php';

class MascotaController
{
    private MascotaModel $mascotaModel;
    private MascotaColorModel $mascotaColorModel;
    private MascotaService $mascotaService;

    public function __construct()
    {
        $this->mascotaModel = new MascotaModel();
        $this->mascotaColorModel = new MascotaColorModel();
        $this->mascotaService = new MascotaService();
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
            $created = $this->mascotaService->create($data);

            // Respuesta final
            Response::json([
                'success' => true,
                'message' => 'Mascota creada correctamente',
                'data' => $created
            ], 201);
        } catch (Throwable $e) {
            // Respuesta de error genérica
            Response::json([
                'success' => false,
                'message' => 'Error al crear la mascota'
            ], 500);

            return;
        }
    }


    public function update(int $id): void
    {
        $mascota = $this->mascotaModel->getById($id);

        if ($mascota === null) {
            Response::json([
                'success' => false,
                'message' => 'Mascota no encontrada'
            ], 404);
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

        try {
            $updated = $this->mascotaService->update($id, $result['data']);

            Response::json([
                'success' => true,
                'message' => 'Mascota actualizada correctamente',
                'data' => $updated
            ]);
        } catch (Throwable $e) {
            Response::json([
                'success' => false,
                'message' => 'Error al actualizar la mascota'
            ], 500);
        }
    }
}
