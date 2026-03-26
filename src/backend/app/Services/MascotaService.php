<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/MascotaModel.php';
require_once __DIR__ . '/../Models/UbicacionModel.php';
require_once __DIR__ . '/../Models/MascotaColorModel.php';

class MascotaService
{
    private MascotaModel $mascotaModel;
    private UbicacionModel $ubicacionModel;
    private MascotaColorModel $mascotaColorModel;

    public function __construct()
    {
        $this->mascotaModel = new MascotaModel();
        $this->ubicacionModel = new UbicacionModel();
        $this->mascotaColorModel = new MascotaColorModel();
    }

    public function create(array $data): array
    {
        try {
            $this->mascotaModel->beginTransaction();

            // 1. Crear ubicación
            $ubicacionId = $this->ubicacionModel->create($data['ubicacion']);

            // 2. Crear mascota
            $mascotaId = $this->mascotaModel->create([
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

            // 3. Guardar colores
            $this->mascotaColorModel->syncColors($mascotaId, $data['colores']);

            $this->mascotaModel->commit();

            return [
                'id' => $mascotaId,
                'ubicacion_id' => $ubicacionId,
                'colores' => $data['colores']
            ];
        } catch (Throwable $e) {
            $this->mascotaModel->rollBack();
            throw $e;
        }
    }


    public function update(int $id, array $data): array
    {
        $mascota = $this->mascotaModel->getById($id);

        if ($mascota === null) {
            throw new RuntimeException('Mascota no encontrada');
        }

        try {
            $this->mascotaModel->beginTransaction();

            $this->ubicacionModel->update((int) $mascota['ubicacion_id'], $data['ubicacion']);

            $this->mascotaModel->update($id, [
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
            ]);

            $this->mascotaColorModel->syncColors($id, $data['colores']);

            $this->mascotaModel->commit();

            return [
                'id' => $id,
                'ubicacion_id' => (int) $mascota['ubicacion_id'],
                'colores' => $data['colores']
            ];
        } catch (Throwable $e) {
            $this->mascotaModel->rollBack();
            throw $e;
        }
    }
}
