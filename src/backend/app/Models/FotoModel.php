<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

/**
 * Modelo encargado de gestionar las fotos
 * de anuncios y avistamientos.
 */
class FotoModel extends BaseModel
{
    /**
     * Obtiene las fotos asociadas a una mascota.
     */
    public function getByMascotaId(int $mascotaId): array
    {
        $sql = "
            SELECT
                id,
                mascota_id,
                url,
                public_id,
                fecha_subida,
                es_principal,
                orden
            FROM fotos_anuncios
            WHERE mascota_id = :mascota_id
            ORDER BY es_principal DESC, orden ASC, id ASC
        ";

        return $this->fetchAll($sql, [
            'mascota_id' => $mascotaId
        ]);
    }

    /**
     * Obtiene las fotos asociadas a un avistamiento.
     */
    public function getByAvistamientoId(int $avistamientoId): array
    {
        $sql = "
            SELECT
                id,
                avistamiento_id,
                url,
                public_id,
                fecha_subida,
                es_principal,
                orden
            FROM fotos_avistamientos
            WHERE avistamiento_id = :avistamiento_id
            ORDER BY es_principal DESC, orden ASC, id ASC
        ";

        return $this->fetchAll($sql, [
            'avistamiento_id' => $avistamientoId
        ]);
    }

    /**
     * Guarda una foto asociada a una mascota.
     */
    public function createForMascota(int $mascotaId, array $foto): int
    {
        $sql = "
            INSERT INTO fotos_anuncios (
                mascota_id,
                url,
                public_id,
                es_principal,
                orden
            ) VALUES (
                :mascota_id,
                :url,
                :public_id,
                :es_principal,
                :orden
            )
        ";

        return $this->insertAndGetId($sql, [
            'mascota_id' => $mascotaId,
            'url' => $foto['url'],
            'public_id' => $foto['public_id'],
            'es_principal' => $foto['es_principal'],
            'orden' => $foto['orden'],
        ]);
    }

    /**
     * Guarda una foto asociada a un avistamiento.
     */
    public function createForAvistamiento(int $avistamientoId, array $foto): int
    {
        $sql = "
            INSERT INTO fotos_avistamientos (
                avistamiento_id,
                url,
                public_id,
                es_principal,
                orden
            ) VALUES (
                :avistamiento_id,
                :url,
                :public_id,
                :es_principal,
                :orden
            )
        ";

        return $this->insertAndGetId($sql, [
            'avistamiento_id' => $avistamientoId,
            'url' => $foto['url'],
            'public_id' => $foto['public_id'],
            'es_principal' => $foto['es_principal'],
            'orden' => $foto['orden'],
        ]);
    }

    /**
     * Elimina todas las fotos asociadas a una mascota.
     */
    public function deleteByMascotaId(int $mascotaId): bool
    {
        $sql = "
            DELETE FROM fotos_anuncios
            WHERE mascota_id = :mascota_id
        ";

        return $this->executeQuery($sql, [
            'mascota_id' => $mascotaId
        ]);
    }

    /**
     * Elimina todas las fotos asociadas a un avistamiento.
     */
    public function deleteByAvistamientoId(int $avistamientoId): bool
    {
        $sql = "
            DELETE FROM fotos_avistamientos
            WHERE avistamiento_id = :avistamiento_id
        ";

        return $this->executeQuery($sql, [
            'avistamiento_id' => $avistamientoId
        ]);
    }
}