<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/AvistamientoModel.php';
require_once __DIR__ . '/../Models/UbicacionModel.php';

class AvistamientoService
{
    private AvistamientoModel $avistamientoModel;
    private UbicacionModel $ubicacionModel;

    public function __construct()
    {
        $this->avistamientoModel = new AvistamientoModel();
        $this->ubicacionModel = new UbicacionModel();
    }

    public function create(int $mascotaId, array $data): array
    {
        try {
            $this->avistamientoModel->beginTransaction();

            // 1. Crear ubicación del avistamiento
            $ubicacionId = $this->ubicacionModel->create($data['ubicacion']);

            // 2. Crear avistamiento
            $avistamientoId = $this->avistamientoModel->create([
                'anuncio_mascotas_id' => $mascotaId,
                'usuarios_id' => $data['usuarios_id'],
                'ubicaciones_avistamientos_id' => $ubicacionId,
                'telefono' => $data['telefono'],
                'email' => $data['email'],
                'descripcion' => $data['descripcion'],
                'fecha_avistamiento' => $data['fecha_avistamiento'],
                'hora_avistamiento' => $data['hora_avistamiento'],
            ]);

            $this->avistamientoModel->commit();

            return [
                'id' => $avistamientoId,
                'mascota_id' => $mascotaId,
                'ubicacion_id' => $ubicacionId
            ];
        } catch (Throwable $e) {
            $this->avistamientoModel->rollBack();
            throw $e;
        }
    }
}