<?php
declare(strict_types=1);

class AvistamientoController
{
    // GET /mascotas/{id}/avistamientos (opcional)
    public function index(int $mascotaId): void
    {
        // $avistamientos = AvistamientoModel::porMascota($mascotaId);
        $avistamientos = [];

        require __DIR__ . '/../Views/avistamientos/index.php';
    }

    // POST /mascotas/{id}/avistamientos
    public function store(int $mascotaId): void
    {
        // Validar: lat, lng, notas, fecha...
        // $data = $_POST;
        // AvistamientoModel::create($mascotaId, $data);

        header('Location: /mascotas/' . $mascotaId);
        exit;
    }
}
