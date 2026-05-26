<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/AvistamientoModel.php';
require_once __DIR__ . '/../Models/UbicacionModel.php';
require_once __DIR__ . '/../Models/FotoModel.php';
require_once __DIR__ . '/../Helpers/FileHelper.php';

/**
 * Servicio de avistamientos.
 *
 * Aquí vive la lógica compleja de creación de avistamientos,
 * especialmente cuando hay que guardar ubicación y fotos.
 */
class AvistamientoService
{
    private AvistamientoModel $avistamientoModel;
    private UbicacionModel $ubicacionModel;
    private FotoModel $fotoModel;

    /**
     * Inicializa los modelos necesarios para la operación.
     */
    public function __construct()
    {
        $this->avistamientoModel = new AvistamientoModel();
        $this->ubicacionModel = new UbicacionModel();
        $this->fotoModel = new FotoModel();
    }

    /**
     * Crea un avistamiento completo.
     *
     * Guarda:
     * - la ubicación del avistamiento
     * - el avistamiento
     * - las fotos, si existen
     *
     * Todo queda dentro de una transacción.
     */
    public function create(int $mascotaId, array $data, ?array $uploadedFiles = null): array
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

            if ($uploadedFiles !== null) {
                $savedFiles = FileHelper::saveImages($uploadedFiles, 'avistamientos');

                foreach ($savedFiles as $file) {
                    $this->fotoModel->createForAvistamiento($avistamientoId, $file);
                }
            }

            $this->avistamientoModel->commit();

            return [
                'id' => $avistamientoId,
                'mascota_id' => $mascotaId,
                'usuario_id' => $data['usuario_id'],
                'ubicacion_id' => $ubicacionId,
                'fotos' => $this->fotoModel->getByAvistamientoId($avistamientoId)
            ];
        } catch (Throwable $e) {
            $this->avistamientoModel->rollBack();
            throw $e;
        }
    }

    public function delete(int $avistamientoId): bool
    {
        $avistamiento = $this->avistamientoModel->getById($avistamientoId);

        if ($avistamiento === null) {
            return false;
        }

        $fotos = $this->fotoModel->getByAvistamientoId($avistamientoId);

        foreach ($fotos as $foto) {
            FileHelper::destroyImage($foto['public_id'] ?? null);
        }

        try {
            $this->avistamientoModel->beginTransaction();

            $this->fotoModel->deleteByAvistamientoId($avistamientoId);
            $this->avistamientoModel->deleteAvistamientoById($avistamientoId);

            // La ubicación del avistamiento normalmente queda huérfana.
            // La borramos después de eliminar el avistamiento.
            if (!empty($avistamiento['ubicaciones_avistamientos_id'])) {
                $this->ubicacionModel->deletePublicById((int) $avistamiento['ubicaciones_avistamientos_id']);
            }

            $this->avistamientoModel->commit();

            return true;
        } catch (Throwable $e) {
            $this->avistamientoModel->rollBack();
            throw $e;
        }
    }
}
