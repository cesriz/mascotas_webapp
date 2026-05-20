<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

// Modelo encargado de gestionar la relación entre mascotas y colores.
class MascotaColorModel extends BaseModel
{
    // Asocia un color a una mascota.
    public function create(int $mascotaId, int $colorId): bool
    {
        $sql = "
            INSERT INTO mascotas_colores (
                mascota_id,
                color_id
            ) VALUES (
                :mascota_id,
                :color_id
            )
        ";

        return $this->executeQuery($sql, [
            'mascota_id' => $mascotaId,
            'color_id' => $colorId,
        ]);
    }

    // Elimina todos los colores asociados a una mascota.
    public function deleteByMascotaId(int $mascotaId): bool
    {
        $sql = "
            DELETE FROM mascotas_colores
            WHERE mascota_id = :mascota_id
        ";

        return $this->executeQuery($sql, [
            'mascota_id' => $mascotaId,
        ]);
    }

    // Sincroniza los colores de una mascota: elimina los anteriores y guarda los nuevos.
    public function syncColors(int $mascotaId, array $colores): void
    {
        $this->deleteByMascotaId($mascotaId);

        foreach ($colores as $colorId) {
            $this->create($mascotaId, (int) $colorId);
        }
    }

    // Obtiene todos los colores asociados a una mascota.
    public function getByMascotaId(int $mascotaId): array
    {
        $sql = "
            SELECT
                c.id,
                c.nombre
            FROM mascotas_colores mc
            INNER JOIN colores c ON mc.color_id = c.id
            WHERE mc.mascota_id = :mascota_id
            ORDER BY c.nombre ASC
        ";

        return $this->fetchAll($sql, [
            'mascota_id' => $mascotaId,
        ]);
    }
}