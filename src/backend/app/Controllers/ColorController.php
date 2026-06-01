<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/ColorModel.php';
require_once __DIR__ . '/../Core/Response.php';

class ColorController
{
    private ColorModel $colorModel;

    public function __construct()
    {
        // Modelo de colores
        $this->colorModel = new ColorModel();
    }

    // Lista todos los colores
    public function index(): void
    {
        // Pedir listado al modelo
        $colores = $this->colorModel->getAll();

        // Respuesta JSON
        Response::json([
            'success' => true,
            'data' => $colores
        ]);
    }

    // Devuelve un color concreto
    public function show(int $id): void
    {
        // Buscar por id
        $color = $this->colorModel->getById($id);

        // Si no existe
        if ($color === null) {
            Response::json([
                'success' => false,
                'message' => 'Color no encontrado'
            ], 404);

            // Cortar ejecución para no seguir devolviendo respuesta
            return;
        }

        // Si existe
        Response::json([
            'success' => true,
            'data' => $color
        ]);
    }
}