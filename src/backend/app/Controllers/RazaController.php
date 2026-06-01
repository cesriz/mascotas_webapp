<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/RazaModel.php';
require_once __DIR__ . '/../Core/Response.php';

class RazaController
{
    private RazaModel $razaModel;

    public function __construct()
    {
        $this->razaModel = new RazaModel();
    }

    public function index(): void
    {
        $especieId = isset($_GET['especie_id']) && (int)$_GET['especie_id'] > 0
            ? (int)$_GET['especie_id']
            : null;

        $razas = $this->razaModel->getAll($especieId);

        Response::json([
            'success' => true,
            'data' => $razas
        ]);
    }
}