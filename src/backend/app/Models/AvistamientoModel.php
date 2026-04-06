<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class AvistamientoModel extends BaseModel
{
    // Devuelve los avistamientos de una mascota.
    public function getByMascotaId(int $mascotaId): array
    {
        $sql = "
            SELECT
                a.id,
                a.mascota_id,
                a.usuario_id,
                a.telefono,
                a.correo,
                a.descripcion,
                a.fecha_hora,
                a.leido_propietario,
                a.fecha_leido_propietario,
                u.id AS ubicacion_id,
                u.direccion_formateada,
                u.municipio,
                u.provincia,
                u.codigo_postal,
                u.pais,
                u.latitud,
                u.longitud,
                u.descripcion AS ubicacion_descripcion
            FROM avistamientos a
            INNER JOIN ubicaciones u ON a.ubicaciones_avistamientos_id = u.id
            WHERE a.mascota_id = :mascota_id
            ORDER BY a.fecha_hora DESC
        ";

        return $this->fetchAll($sql, [
            'mascota_id' => $mascotaId
        ]);
    }

    // Devuelve un avistamiento por id.
    public function getById(int $id): ?array
    {
        $sql = "
            SELECT
                a.id,
                a.mascota_id,
                a.usuario_id,
                a.telefono,
                a.correo,
                a.descripcion,
                a.fecha_hora,
                a.leido_propietario,
                a.fecha_leido_propietario,
                a.ubicaciones_avistamientos_id
            FROM avistamientos a
            WHERE a.id = :id
            LIMIT 1
        ";

        return $this->fetchOne($sql, [
            'id' => $id
        ]);
    }

    // Comprueba si el avistamiento pertenece a una mascota del usuario.
    public function belongsToOwner(int $avistamientoId, int $usuarioId): bool
    {
        $sql = "
            SELECT a.id
            FROM avistamientos a
            INNER JOIN anuncio_mascotas am ON a.mascota_id = am.id
            WHERE a.id = :avistamiento_id
              AND am.usuario_id = :usuario_id
            LIMIT 1
        ";

        $result = $this->fetchOne($sql, [
            'avistamiento_id' => $avistamientoId,
            'usuario_id' => $usuarioId
        ]);

        return $result !== null;
    }

    // Devuelve los avistamientos enviados por un usuario registrado.
    public function getCardsByUsuarioId(int $usuarioId): array
    {
        $sql = "
            SELECT
                a.id,
                a.mascota_id,
                am.nombre AS mascota_nombre,
                am.estado AS estado_mascota,
                a.fecha_hora,
                a.descripcion,
                u.direccion_formateada,
                u.municipio,
                u.provincia,
                u.latitud,
                u.longitud,
                (
                    SELECT fav.url
                    FROM fotos_avistamientos fav
                    WHERE fav.avistamiento_id = a.id
                    ORDER BY fav.es_principal DESC, fav.orden ASC, fav.id ASC
                    LIMIT 1
                ) AS foto_avistamiento_url,
                (
                    SELECT fa.url
                    FROM fotos_anuncios fa
                    WHERE fa.mascota_id = am.id
                    ORDER BY fa.es_principal DESC, fa.orden ASC, fa.id ASC
                    LIMIT 1
                ) AS foto_mascota_url
            FROM avistamientos a
            INNER JOIN anuncio_mascotas am ON a.mascota_id = am.id
            INNER JOIN ubicaciones u ON a.ubicaciones_avistamientos_id = u.id
            WHERE a.usuario_id = :usuario_id
            ORDER BY a.fecha_hora DESC, a.id DESC
        ";

        return $this->fetchAll($sql, [
            'usuario_id' => $usuarioId
        ]);
    }

    // Devuelve los avistamientos recibidos sobre mascotas del usuario.
    public function getReceivedNotificationsByUsuarioId(int $usuarioId): array
    {
        $sql = "
            SELECT
                a.id,
                a.mascota_id,
                a.usuario_id AS usuario_remitente_id,
                a.telefono,
                a.correo,
                a.descripcion,
                a.fecha_hora,
                a.leido_propietario,
                a.fecha_leido_propietario,
                am.nombre AS mascota_nombre,
                am.estado AS mascota_estado,
                u.id AS ubicacion_id,
                u.direccion_formateada,
                u.municipio,
                u.provincia,
                u.codigo_postal,
                u.pais,
                u.latitud,
                u.longitud,
                u.descripcion AS ubicacion_descripcion,
                (
                    SELECT fav.url
                    FROM fotos_avistamientos fav
                    WHERE fav.avistamiento_id = a.id
                    ORDER BY fav.es_principal DESC, fav.orden ASC, fav.id ASC
                    LIMIT 1
                ) AS foto_avistamiento_url,
                (
                    SELECT fa.url
                    FROM fotos_anuncios fa
                    WHERE fa.mascota_id = am.id
                    ORDER BY fa.es_principal DESC, fa.orden ASC, fa.id ASC
                    LIMIT 1
                ) AS foto_mascota_url
            FROM avistamientos a
            INNER JOIN anuncio_mascotas am ON a.mascota_id = am.id
            INNER JOIN ubicaciones u ON a.ubicaciones_avistamientos_id = u.id
            WHERE am.usuario_id = :usuario_id
            ORDER BY a.fecha_hora DESC, a.id DESC
        ";

        return $this->fetchAll($sql, [
            'usuario_id' => $usuarioId
        ]);
    }

    // Cuenta cuántos avistamientos no ha leído el propietario.
    public function countUnreadReceivedByUsuarioId(int $usuarioId): int
    {
        $sql = "
            SELECT COUNT(*) AS total
            FROM avistamientos a
            INNER JOIN anuncio_mascotas am ON a.mascota_id = am.id
            WHERE am.usuario_id = :usuario_id
              AND a.leido_propietario = 0
        ";

        $result = $this->fetchOne($sql, [
            'usuario_id' => $usuarioId
        ]);

        return (int) ($result['total'] ?? 0);
    }

    // Crea un avistamiento nuevo.
    public function create(array $data): int
    {
        $sql = "
            INSERT INTO avistamientos (
                mascota_id,
                fecha_hora,
                ubicaciones_avistamientos_id,
                descripcion,
                telefono,
                correo,
                usuario_id,
                leido_propietario
            ) VALUES (
                :mascota_id,
                :fecha_hora,
                :ubicaciones_avistamientos_id,
                :descripcion,
                :telefono,
                :correo,
                :usuario_id,
                0
            )
        ";

        return $this->insertAndGetId($sql, [
            'mascota_id' => $data['mascota_id'],
            'fecha_hora' => $data['fecha_hora'],
            'ubicaciones_avistamientos_id' => $data['ubicaciones_avistamientos_id'],
            'descripcion' => $data['descripcion'],
            'telefono' => $data['telefono'],
            'correo' => $data['correo'],
            'usuario_id' => $data['usuario_id'], // puede ser null
        ]);
    }

    // Marca un avistamiento como leído por el propietario.
    public function markAsReadForOwner(int $avistamientoId): bool
    {
        $sql = "
            UPDATE avistamientos
            SET
                leido_propietario = 1,
                fecha_leido_propietario = NOW()
            WHERE id = :avistamiento_id
        ";

        return $this->executeQuery($sql, [
            'avistamiento_id' => $avistamientoId
        ]);
    }

    // Borra los avistamientos de una mascota.
    public function deleteByMascotaId(int $mascotaId): bool
    {
        $sql = "
            DELETE FROM avistamientos
            WHERE mascota_id = :mascota_id
        ";

        return $this->executeQuery($sql, [
            'mascota_id' => $mascotaId
        ]);
    }
}