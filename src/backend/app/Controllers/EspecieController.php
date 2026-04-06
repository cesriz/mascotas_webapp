<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/EspecieModel.php';
require_once __DIR__ . '/../Core/Response.php';

class EspecieController
{
    private EspecieModel $especieModel;

    public function __construct()
    {
        $this->especieModel = new EspecieModel();
    }

    public function index(): void
    {
        $especies = $this->especieModel->getAll();

        Response::json([
            'success' => true,
            'data' => $especies
        ]);
    }
}