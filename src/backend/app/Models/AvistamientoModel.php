<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class AvistamientoModel extends BaseModel
{
    // Devuelve todos los avistamientos de una mascota
    public function getByMascotaId(int $mascotaId): array
    {
        // SQL del listado de avistamientos
        // Se ordena del más reciente al más antiguo
        $sql = "
            SELECT
                a.id,
                a.anuncio_mascotas_id,
                a.usuarios_id,
                a.telefono,
                a.email,
                a.descripcion,
                a.fecha_avistamiento,
                a.hora_avistamiento,
                a.created_at,
                a.updated_at,
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
            WHERE a.anuncio_mascotas_id = :mascota_id
            ORDER BY a.fecha_avistamiento DESC, a.hora_avistamiento DESC
        ";

        // Ejecuta y devuelve todas las filas
        return $this->fetchAll($sql, [
            'mascota_id' => $mascotaId
        ]);
    }

    // Inserta un nuevo avistamiento y devuelve su id
    public function create(array $data): int
    {
        // SQL del insert
        $sql = "
            INSERT INTO avistamientos (
                anuncio_mascotas_id,
                usuarios_id,
                ubicaciones_avistamientos_id,
                telefono,
                email,
                descripcion,
                fecha_avistamiento,
                hora_avistamiento
            ) VALUES (
                :anuncio_mascotas_id,
                :usuarios_id,
                :ubicaciones_avistamientos_id,
                :telefono,
                :email,
                :descripcion,
                :fecha_avistamiento,
                :hora_avistamiento
            )
        ";

        // Ejecuta y devuelve el id generado
        return $this->insertAndGetId($sql, [
            'anuncio_mascotas_id' => $data['anuncio_mascotas_id'],
            'usuarios_id' => $data['usuarios_id'],
            'ubicaciones_avistamientos_id' => $data['ubicaciones_avistamientos_id'],
            'telefono' => $data['telefono'],
            'email' => $data['email'],
            'descripcion' => $data['descripcion'],
            'fecha_avistamiento' => $data['fecha_avistamiento'],
            'hora_avistamiento' => $data['hora_avistamiento'],
        ]);
    }
}