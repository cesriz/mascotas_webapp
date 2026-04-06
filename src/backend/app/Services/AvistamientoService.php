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

            $ubicacionId = $this->ubicacionModel->create($data['ubicacion']);

            $avistamientoId = $this->avistamientoModel->create([
                'mascota_id' => $mascotaId,
                'usuario_id' => $data['usuario_id'],
                'ubicaciones_avistamientos_id' => $ubicacionId,
                'telefono' => $data['telefono'],
                'correo' => $data['correo'],
                'descripcion' => $data['descripcion'],
                'fecha_hora' => $data['fecha_hora'],
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