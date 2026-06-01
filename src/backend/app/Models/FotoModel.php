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

    public function getMascotaFotoById(int $fotoId): ?array
    {
        $sql = "
        SELECT
            fa.id,
            fa.mascota_id,
            fa.url,
            fa.public_id,
            fa.fecha_subida,
            fa.es_principal,
            fa.orden,
            am.usuario_id
        FROM fotos_anuncios fa
        INNER JOIN anuncio_mascotas am ON am.id = fa.mascota_id
        WHERE fa.id = :id
        LIMIT 1
    ";

        return $this->fetchOne($sql, [
            'id' => $fotoId
        ]);
    }

    public function getAvistamientoFotoById(int $fotoId): ?array
    {
        $sql = "
        SELECT
            fav.id,
            fav.avistamiento_id,
            fav.url,
            fav.public_id,
            fav.fecha_subida,
            fav.es_principal,
            fav.orden,
            a.mascota_id,
            a.usuario_id AS autor_avistamiento_id,
            am.usuario_id AS propietario_mascota_id
        FROM fotos_avistamientos fav
        INNER JOIN avistamientos a ON a.id = fav.avistamiento_id
        INNER JOIN anuncio_mascotas am ON am.id = a.mascota_id
        WHERE fav.id = :id
        LIMIT 1
    ";

        return $this->fetchOne($sql, [
            'id' => $fotoId
        ]);
    }

    public function deleteMascotaFotoById(int $fotoId): bool
    {
        $sql = "
        DELETE FROM fotos_anuncios
        WHERE id = :id
    ";

        return $this->executeQuery($sql, [
            'id' => $fotoId
        ]);
    }

    public function deleteAvistamientoFotoById(int $fotoId): bool
    {
        $sql = "
        DELETE FROM fotos_avistamientos
        WHERE id = :id
    ";

        return $this->executeQuery($sql, [
            'id' => $fotoId
        ]);
    }

    public function ensureMascotaHasPrincipal(int $mascotaId): void
    {
        $sql = "
        SELECT COUNT(*) AS total
        FROM fotos_anuncios
        WHERE mascota_id = :mascota_id
          AND es_principal = 1
    ";

        $result = $this->fetchOne($sql, [
            'mascota_id' => $mascotaId
        ]);

        if ((int) ($result['total'] ?? 0) > 0) {
            return;
        }

        $sql = "
        UPDATE fotos_anuncios
        SET es_principal = 1
        WHERE mascota_id = :mascota_id
        ORDER BY orden ASC, id ASC
        LIMIT 1
    ";

        $this->executeQuery($sql, [
            'mascota_id' => $mascotaId
        ]);
    }

    public function ensureAvistamientoHasPrincipal(int $avistamientoId): void
    {
        $sql = "
        SELECT COUNT(*) AS total
        FROM fotos_avistamientos
        WHERE avistamiento_id = :avistamiento_id
          AND es_principal = 1
    ";

        $result = $this->fetchOne($sql, [
            'avistamiento_id' => $avistamientoId
        ]);

        if ((int) ($result['total'] ?? 0) > 0) {
            return;
        }

        $sql = "
        UPDATE fotos_avistamientos
        SET es_principal = 1
        WHERE avistamiento_id = :avistamiento_id
        ORDER BY orden ASC, id ASC
        LIMIT 1
    ";

        $this->executeQuery($sql, [
            'avistamiento_id' => $avistamientoId
        ]);
    }
}
