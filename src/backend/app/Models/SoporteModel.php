<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class SoporteModel extends BaseModel
{
    public function create(array $data): int
    {
        $sql = "
            INSERT INTO mensajes_soporte (
                usuario_id,
                asunto,
                categoria,
                mensaje,
                nombre,
                correo,
                telefono,
                estado
            ) VALUES (
                :usuario_id,
                :asunto,
                :categoria,
                :mensaje,
                :nombre,
                :correo,
                :telefono,
                'ABIERTO'
            )
        ";

        return $this->insertAndGetId($sql, [
            'usuario_id' => $data['usuario_id'],
            'asunto' => $data['asunto'],
            'categoria' => $data['categoria'],
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
                ms.id,
                ms.usuario_id,
                ms.asunto,
                ms.categoria,
                ms.mensaje,
                ms.nombre,
                ms.correo,
                ms.telefono,
                ms.estado,
                ms.fecha_creacion,
                ms.fecha_cierre,
                ms.notas_admin,
                u.nombre AS usuario_nombre,
                u.apellidos AS usuario_apellidos,
                u.correo AS usuario_correo
            FROM mensajes_soporte ms
            LEFT JOIN usuarios u ON u.id = ms.usuario_id
            ORDER BY ms.fecha_creacion DESC, ms.id DESC
        ";

        return $this->fetchAll($sql);
    }

    public function updateEstado(int $id, string $estado, ?int $cerradoPor, ?string $notasAdmin = null): bool
    {
        $sql = "
            UPDATE mensajes_soporte
            SET
                estado = :estado,
                fecha_cierre = CASE WHEN :estado = 'CERRADO' THEN NOW() ELSE NULL END,
                cerrado_por = :cerrado_por,
                notas_admin = :notas_admin
            WHERE id = :id
        ";

        return $this->executeQuery($sql, [
            'id' => $id,
            'estado' => $estado,
            'cerrado_por' => $cerradoPor,
            'notas_admin' => $notasAdmin
        ]);
    }
}