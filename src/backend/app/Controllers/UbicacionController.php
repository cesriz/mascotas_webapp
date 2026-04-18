<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/UbicacionModel.php';
require_once __DIR__ . '/../Core/Response.php';

class UbicacionController
{
    private UbicacionModel $ubicacionModel;

    public function __construct()
    {
        $this->ubicacionModel = new UbicacionModel();
    }

    public function provincias(): void
    {
        $provincias = $this->ubicacionModel->getProvincias();

        Response::json([
            'success' => true,
            'data' => $provincias
        ]);
    }

    public function municipios(): void
    {
        $provincia = isset($_GET['provincia'])
            ? trim((string) $_GET['provincia'])
            : null;

        if ($provincia === '') {
            $provincia = null;
        }

        $municipios = $this->ubicacionModel->getMunicipios($provincia);

        Response::json([
            'success' => true,
            'data' => $municipios
        ]);
    }
}