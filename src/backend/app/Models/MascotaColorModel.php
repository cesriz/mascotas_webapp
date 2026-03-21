<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class MascotaColorModel extends BaseModel
{
    // Inserta la relación entre una mascota y un color
    public function create(int $mascotaId, int $colorId): bool
    {
        // SQL del insert en la tabla intermedia
        $sql = "
            INSERT INTO mascota_colores (
                anuncio_mascotas_id,
                colores_id
            ) VALUES (
                :mascota_id,
                :color_id
            )
        ";

        // Ejecuta la inserción
        return $this->executeQuery($sql, [
            'mascota_id' => $mascotaId,
            'color_id' => $colorId,
        ]);
    }

    // Elimina todos los colores asociados a una mascota
    public function deleteByMascotaId(int $mascotaId): bool
    {
        // SQL del delete por mascota
        $sql = "
            DELETE FROM mascota_colores
            WHERE anuncio_mascotas_id = :mascota_id
        ";

        // Ejecuta el borrado
        return $this->executeQuery($sql, [
            'mascota_id' => $mascotaId,
        ]);
    }

    // Sincroniza los colores de una mascota
    // Primero borra los existentes y luego inserta los nuevos
    public function syncColors(int $mascotaId, array $colores): void
    {
        // Borrar relaciones anteriores
        $this->deleteByMascotaId($mascotaId);

        // Insertar relaciones nuevas
        foreach ($colores as $colorId) {
            $this->create($mascotaId, (int) $colorId);
        }
    }

    // Devuelve los colores asociados a una mascota
    public function getByMascotaId(int $mascotaId): array
    {
        // SQL para sacar colores de una mascota
        $sql = "
            SELECT
                c.id,
                c.nombre
            FROM mascota_colores mc
            INNER JOIN colores c ON mc.colores_id = c.id
            WHERE mc.anuncio_mascotas_id = :mascota_id
            ORDER BY c.nombre ASC
        ";

        // Ejecuta y devuelve todas las filas
        return $this->fetchAll($sql, [
            'mascota_id' => $mascotaId,
        ]);
    }
}