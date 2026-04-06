<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class ContactoModel extends BaseModel
{
    // Crea un nuevo mensaje de contacto.
    public function create(array $data): int
    {
        $sql = "
            INSERT INTO mensajes_contacto (
                mascota_id,
                usuario_destinatario_id,
                usuario_remitente_id,
                nombre,
                correo,
                telefono,
                mensaje,
                leido_destinatario
            ) VALUES (
                :mascota_id,
                :usuario_destinatario_id,
                :usuario_remitente_id,
                :nombre,
                :correo,
                :telefono,
                :mensaje,
                0
            )
        ";

        return $this->insertAndGetId($sql, [
            'mascota_id' => $data['mascota_id'],
            'usuario_destinatario_id' => $data['usuario_destinatario_id'],
            'usuario_remitente_id' => $data['usuario_remitente_id'], // puede ser null
            'nombre' => $data['nombre'],
            'correo' => $data['correo'],
            'telefono' => $data['telefono'],
            'mensaje' => $data['mensaje'],
        ]);
    }

    // Devuelve un mensaje por id.
    public function getById(int $id): ?array
    {
        $sql = "
            SELECT
                mc.id,
                mc.mascota_id,
                mc.usuario_destinatario_id,
                mc.usuario_remitente_id,
                mc.nombre,
                mc.correo,
                mc.telefono,
                mc.mensaje,
                mc.leido_destinatario,
                mc.fecha_creacion,
                mc.fecha_leido
            FROM mensajes_contacto mc
            WHERE mc.id = :id
            LIMIT 1
        ";

        return $this->fetchOne($sql, [
            'id' => $id
        ]);
    }

    // Devuelve los mensajes recibidos por un usuario.
    public function getReceivedByUsuarioId(int $usuarioId): array
    {
        $sql = "
            SELECT
                mc.id,
                mc.mascota_id,
                mc.usuario_destinatario_id,
                mc.usuario_remitente_id,
                mc.nombre,
                mc.correo,
                mc.telefono,
                mc.mensaje,
                mc.leido_destinatario,
                mc.fecha_creacion,
                mc.fecha_leido,
                am.nombre AS mascota_nombre,
                am.estado AS mascota_estado,
                (
                    SELECT fa.url
                    FROM fotos_anuncios fa
                    WHERE fa.mascota_id = am.id
                    ORDER BY fa.es_principal DESC, fa.orden ASC, fa.id ASC
                    LIMIT 1
                ) AS foto_mascota_url
            FROM mensajes_contacto mc
            INNER JOIN anuncio_mascotas am ON mc.mascota_id = am.id
            WHERE mc.usuario_destinatario_id = :usuario_id
            ORDER BY mc.fecha_creacion DESC, mc.id DESC
        ";

        return $this->fetchAll($sql, [
            'usuario_id' => $usuarioId
        ]);
    }

    // Cuenta cuántos mensajes no leídos tiene el usuario.
    public function countUnreadByUsuarioId(int $usuarioId): int
    {
        $sql = "
            SELECT COUNT(*) AS total
            FROM mensajes_contacto
            WHERE usuario_destinatario_id = :usuario_id
              AND leido_destinatario = 0
        ";

        $result = $this->fetchOne($sql, [
            'usuario_id' => $usuarioId
        ]);

        return (int) ($result['total'] ?? 0);
    }

    // Marca un mensaje como leído.
    public function markAsRead(int $id, int $usuarioId): bool
    {
        $sql = "
            UPDATE mensajes_contacto
            SET
                leido_destinatario = 1,
                fecha_leido = NOW()
            WHERE id = :id
              AND usuario_destinatario_id = :usuario_id
        ";

        return $this->executeQuery($sql, [
            'id' => $id,
            'usuario_id' => $usuarioId
        ]);
    }
}