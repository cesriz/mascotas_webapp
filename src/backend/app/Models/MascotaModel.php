<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class MascotaModel extends BaseModel
{
    // Devuelve el listado de mascotas con filtros opcionales
    public function getAll(array $filters = []): array
    {
        // SQL base del listado

        $sql = "
            SELECT
                am.id,
                am.nombre,
                am.sexo,
                am.tamano,
                am.peso,
                am.descripcion,
                am.estado,
                am.fecha_perdida,
                am.fecha_encontrada,
                am.fecha_recuperada,
                am.fecha_nacimiento,
                am.recompensa,
                r.id AS raza_id,
                r.nombre AS raza_nombre,
                e.id AS especie_id,
                e.nombre AS especie_nombre,
                u.id AS ubicacion_id,
                u.direccion_formateada,
                u.municipio,
                u.provincia,
                u.codigo_postal,
                u.pais,
                u.latitud,
                u.longitud,
                u.descripcion AS ubicacion_descripcion
            FROM anuncio_mascotas am
            INNER JOIN razas r ON am.razas_id = r.id
            INNER JOIN especies e ON r.especies_id = e.id
            INNER JOIN ubicaciones u ON am.ubicaciones_perdida_id = u.id
            WHERE 1 = 1
        ";

        // Parámetros de la consulta
        $params = [];

        // Filtro por estado
        if (!empty($filters['estado'])) {
            $sql .= " AND am.estado = :estado";
            $params['estado'] = $filters['estado'];
        }

        // Filtro por especie
        if (!empty($filters['especie_id'])) {
            $sql .= " AND e.id = :especie_id";
            $params['especie_id'] = $filters['especie_id'];
        }

        // Filtro por raza
        if (!empty($filters['raza_id'])) {
            $sql .= " AND r.id = :raza_id";
            $params['raza_id'] = $filters['raza_id'];
        }

        // Filtro por sexo
        if (!empty($filters['sexo'])) {
            $sql .= " AND am.sexo = :sexo";
            $params['sexo'] = $filters['sexo'];
        }

        // Filtro por tamaño
        if (!empty($filters['tamano'])) {
            $sql .= " AND am.tamano = :tamano";
            $params['tamano'] = $filters['tamano'];
        }

        // Filtro por municipio (ubicación)
        if (!empty($filters['municipio'])) {
            $sql .= " AND u.municipio = :municipio";
            $params['municipio'] = $filters['municipio'];
        }

        // Filtro por provincia (ubicación)
        if (!empty($filters['provincia'])) {
            $sql .= " AND u.provincia = :provincia";
            $params['provincia'] = $filters['provincia'];
        }

        // Orden del listado
        $sql .= " ORDER BY am.id DESC";

        // Ejecuta y devuelve todas las filas
        return $this->fetchAll($sql, $params);
    }

    // Devuelve una mascota concreta por id
    public function getById(int $id): ?array
    {
        // SQL del detalle
        $sql = "
            SELECT
                am.id,
                am.nombre,
                am.sexo,
                am.tamano,
                am.peso,
                am.descripcion,
                am.estado,
                am.fecha_perdida,
                am.fecha_encontrada,
                am.fecha_recuperada,
                am.fecha_nacimiento,
                am.recompensa,
                r.id AS raza_id,
                r.nombre AS raza_nombre,
                e.id AS especie_id,
                e.nombre AS especie_nombre,
                u.id AS ubicacion_id,
                u.direccion_formateada,
                u.municipio,
                u.provincia,
                u.codigo_postal,
                u.pais,
                u.latitud,
                u.longitud,
                u.descripcion AS ubicacion_descripcion
            FROM anuncio_mascotas am
            INNER JOIN razas r ON am.razas_id = r.id
            INNER JOIN especies e ON r.especies_id = e.id
            INNER JOIN ubicaciones u ON am.ubicaciones_perdida_id = u.id
            WHERE am.id = :id
            LIMIT 1
        ";

        // Ejecuta y devuelve una fila o null
        return $this->fetchOne($sql, ['id' => $id]);
    }

    // Inserta una nueva mascota y devuelve su id
    public function create(array $data): int
    {
        // SQL del insert (sin cambios estructurales)
        $sql = "
            INSERT INTO anuncio_mascotas (
                usuario_id,
                nombre,
                razas_id,
                sexo,
                tamano,
                peso,
                fecha_nacimiento,
                descripcion,
                fecha_perdida,
                fecha_encontrada,
                fecha_recuperada,
                estado,
                recompensa,
                ubicaciones_perdida_id
            ) VALUES (
                :usuario_id,
                :nombre,
                :razas_id,
                :sexo,
                :tamano,
                :peso,
                :fecha_nacimiento,
                :descripcion,
                :fecha_perdida,
                :fecha_encontrada,
                :fecha_recuperada,
                :estado,
                :recompensa,
                :ubicaciones_perdida_id
            )
        ";

        // Ejecuta y devuelve el id generado
        return $this->insertAndGetId($sql, [
            'usuario_id' => $data['usuario_id'],
            'nombre' => $data['nombre'],
            'razas_id' => $data['razas_id'],
            'sexo' => $data['sexo'],
            'tamano' => $data['tamano'],
            'peso' => $data['peso'],
            'fecha_nacimiento' => $data['fecha_nacimiento'],
            'descripcion' => $data['descripcion'],
            'fecha_perdida' => $data['fecha_perdida'],
            'fecha_encontrada' => $data['fecha_encontrada'],
            'fecha_recuperada' => $data['fecha_recuperada'],
            'estado' => $data['estado'],
            'recompensa' => $data['recompensa'],
            'ubicaciones_perdida_id' => $data['ubicaciones_perdida_id'],
        ]);
    }

    public function update(int $id, array $data): bool
    {
        $sql = "
        UPDATE anuncio_mascotas
        SET
            nombre = :nombre,
            razas_id = :razas_id,
            sexo = :sexo,
            tamano = :tamano,
            peso = :peso,
            fecha_nacimiento = :fecha_nacimiento,
            descripcion = :descripcion,
            fecha_perdida = :fecha_perdida,
            fecha_encontrada = :fecha_encontrada,
            fecha_recuperada = :fecha_recuperada,
            estado = :estado,
            recompensa = :recompensa
        WHERE id = :id
    ";

        return $this->executeQuery($sql, [
            'id' => $id,
            'nombre' => $data['nombre'],
            'razas_id' => $data['razas_id'],
            'sexo' => $data['sexo'],
            'tamano' => $data['tamano'],
            'peso' => $data['peso'],
            'fecha_nacimiento' => $data['fecha_nacimiento'],
            'descripcion' => $data['descripcion'],
            'fecha_perdida' => $data['fecha_perdida'],
            'fecha_encontrada' => $data['fecha_encontrada'],
            'fecha_recuperada' => $data['fecha_recuperada'],
            'estado' => $data['estado'],
            'recompensa' => $data['recompensa'],
        ]);
    }
}
