<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class ReporteModel extends BaseModel
{
    public function create(array $data): int
    {
        $sql = "
            INSERT INTO reportes_anuncios (
                mascota_id,
                usuario_reportante_id,
                usuario_propietario_id,
                asunto,
                mensaje,
                nombre,
                correo,
                telefono,
                estado
            ) VALUES (
                :mascota_id,
                :usuario_reportante_id,
                :usuario_propietario_id,
                :asunto,
                :mensaje,
                :nombre,
                :correo,
                :telefono,
                'PENDIENTE'
            )
        ";

        return $this->insertAndGetId($sql, [
            'mascota_id' => $data['mascota_id'],
            'usuario_reportante_id' => $data['usuario_reportante_id'],
            'usuario_propietario_id' => $data['usuario_propietario_id'],
            'asunto' => $data['asunto'],
            'mensaje' => $data['mensaje'],
            'nombre' => $data['nombre'],
            'correo' => $data['correo'],
            'telefono' => $data['telefono'],
        ]);
    }

    public function getAllWithRelations(): array
    {
        $sql = "
            SELECT
                ra.id,
                ra.mascota_id,
                ra.usuario_reportante_id,
                ra.usuario_propietario_id,
                ra.asunto,
                ra.mensaje,
                ra.nombre,
                ra.correo,
                ra.telefono,
                ra.estado,
                ra.fecha_creacion,
                ra.fecha_revision,
                ra.notas_admin,
                am.nombre AS mascota_nombre,
                am.estado_publicacion,
                up.nombre AS propietario_nombre,
                up.apellidos AS propietario_apellidos,
                ur.nombre AS reportante_nombre,
                ur.apellidos AS reportante_apellidos
            FROM reportes_anuncios ra
            INNER JOIN anuncio_mascotas am ON am.id = ra.mascota_id
            INNER JOIN usuarios up ON up.id = ra.usuario_propietario_id
            LEFT JOIN usuarios ur ON ur.id = ra.usuario_reportante_id
            ORDER BY ra.fecha_creacion DESC, ra.id DESC
        ";

        return $this->fetchAll($sql);
    }

    public function getById(int $id): ?array
    {
        $sql = "
            SELECT *
            FROM reportes_anuncios
            WHERE id = :id
            LIMIT 1
        ";

        return $this->fetchOne($sql, ['id' => $id]);
    }

    public function updateEstado(int $id, string $estado, ?int $revisadoPor, ?string $notasAdmin = null): bool
    {
        $sql = "
            UPDATE reportes_anuncios
            SET
                estado = :estado,
                fecha_revision = NOW(),
                revisado_por = :revisado_por,
                notas_admin = :notas_admin
            WHERE id = :id
        ";

        return $this->executeQuery($sql, [
            'id' => $id,
            'estado' => $estado,
            'revisado_por' => $revisadoPor,
            'notas_admin' => $notasAdmin
        ]);
    }
}
