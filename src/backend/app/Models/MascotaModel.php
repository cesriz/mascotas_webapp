<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class MascotaModel extends BaseModel
{
    // Devuelve tarjetas de mascotas con filtros, orden y paginación.
    public function getCards(array $filters = []): array
    {
        $parts = $this->buildCardsQueryParts($filters);

        $limit = (int) ($filters['limit'] ?? 12);
        $page = (int) ($filters['page'] ?? 1);

        if ($limit <= 0) {
            $limit = 12;
        }

        if ($page <= 0) {
            $page = 1;
        }

        $offset = ($page - 1) * $limit;

        $sql = "
            SELECT
                am.id,
                am.nombre,
                am.estado,
                am.sexo,
                am.tamano,
                am.tiene_chip,
                am.recompensa,
                r.id AS raza_id,
                r.nombre AS raza_nombre,
                e.id AS especie_id,
                e.nombre AS especie_nombre,
                u.municipio,
                u.provincia,
                u.direccion_formateada,
                u.latitud,
                u.longitud,
                CASE
                    WHEN am.estado = 'RECUPERADA' THEN am.fecha_recuperada
                    WHEN am.estado = 'ENCONTRADA' THEN am.fecha_encontrada
                    WHEN am.estado = 'PERDIDA' THEN am.fecha_perdida
                    ELSE NULL
                END AS fecha_evento,
                CASE
                    WHEN am.estado = 'RECUPERADA' THEN 'RECUPERADA'
                    WHEN am.estado = 'ENCONTRADA' THEN 'ENCONTRADA'
                    WHEN am.estado = 'PERDIDA' THEN 'PERDIDA'
                    ELSE NULL
                END AS tipo_fecha_evento,
                (
                    SELECT fa.url
                    FROM fotos_anuncios fa
                    WHERE fa.mascota_id = am.id
                    ORDER BY fa.es_principal DESC, fa.orden ASC, fa.id ASC
                    LIMIT 1
                ) AS foto_principal_url
            {$parts['from']}
            {$parts['where']}
            {$parts['order_by']}
            LIMIT {$limit} OFFSET {$offset}
        ";

        return $this->fetchAll($sql, $parts['params']);
    }

    // Cuenta el total de mascotas para la paginación.
    public function countCards(array $filters = []): int
    {
        $parts = $this->buildCardsQueryParts($filters);

        $sql = "
            SELECT COUNT(*) AS total
            {$parts['from']}
            {$parts['where']}
        ";

        $result = $this->fetchOne($sql, $parts['params']);

        return (int) ($result['total'] ?? 0);
    }

    // Monta el FROM, WHERE y ORDER BY del listado.
    private function buildCardsQueryParts(array $filters): array
    {
        $from = "
            FROM anuncio_mascotas am
            INNER JOIN razas r ON am.raza_id = r.id
            INNER JOIN especies e ON r.especies_id = e.id
            INNER JOIN ubicaciones u ON am.ubicaciones_perdida_id = u.id
        ";

        $where = "WHERE 1 = 1 AND am.estado_publicacion = 'PUBLICADO'";
        $params = [];

        if (!empty($filters['estado'])) {
            $where .= " AND am.estado = :estado";
            $params['estado'] = $filters['estado'];
        }

        if (!empty($filters['especie_id'])) {
            $where .= " AND e.id = :especie_id";
            $params['especie_id'] = (int) $filters['especie_id'];
        }

        if (!empty($filters['raza_id'])) {
            $where .= " AND r.id = :raza_id";
            $params['raza_id'] = (int) $filters['raza_id'];
        }

        if (!empty($filters['sexo'])) {
            $where .= " AND am.sexo = :sexo";
            $params['sexo'] = $filters['sexo'];
        }

        if (!empty($filters['tamano'])) {
            $where .= " AND am.tamano = :tamano";
            $params['tamano'] = $filters['tamano'];
        }

        if (!empty($filters['municipio'])) {
            $where .= " AND u.municipio LIKE :municipio";
            $params['municipio'] = '%' . $filters['municipio'] . '%';
        }

        if (!empty($filters['provincia'])) {
            $where .= " AND u.provincia LIKE :provincia";
            $params['provincia'] = '%' . $filters['provincia'] . '%';
        }

        if (!empty($filters['q_ubicacion'])) {
            $where .= "
                AND (
                    u.direccion_formateada LIKE :q_ubicacion
                    OR u.municipio LIKE :q_ubicacion
                    OR u.provincia LIKE :q_ubicacion
                    OR u.codigo_postal LIKE :q_ubicacion
                    OR u.descripcion LIKE :q_ubicacion
                )
            ";
            $params['q_ubicacion'] = '%' . $filters['q_ubicacion'] . '%';
        }

        if (!empty($filters['fecha_desde'])) {
            $where .= "
                AND (
                    CASE
                        WHEN am.estado = 'RECUPERADA' THEN am.fecha_recuperada
                        WHEN am.estado = 'ENCONTRADA' THEN am.fecha_encontrada
                        WHEN am.estado = 'PERDIDA' THEN am.fecha_perdida
                        ELSE NULL
                    END
                ) >= :fecha_desde
            ";
            $params['fecha_desde'] = $filters['fecha_desde'];
        }

        if (!empty($filters['fecha_hasta'])) {
            $where .= "
                AND (
                    CASE
                        WHEN am.estado = 'RECUPERADA' THEN am.fecha_recuperada
                        WHEN am.estado = 'ENCONTRADA' THEN am.fecha_encontrada
                        WHEN am.estado = 'PERDIDA' THEN am.fecha_perdida
                        ELSE NULL
                    END
                ) <= :fecha_hasta
            ";
            $params['fecha_hasta'] = $filters['fecha_hasta'];
        }

        if (isset($filters['tiene_chip']) && $filters['tiene_chip'] !== null) {
            $where .= " AND am.tiene_chip = :tiene_chip";
            $params['tiene_chip'] = (int) $filters['tiene_chip'];
        }

        if (isset($filters['con_fotos']) && $filters['con_fotos'] !== null) {
            if ((int) $filters['con_fotos'] === 1) {
                $where .= "
                    AND EXISTS (
                        SELECT 1
                        FROM fotos_anuncios fa
                        WHERE fa.mascota_id = am.id
                    )
                ";
            } else {
                $where .= "
                    AND NOT EXISTS (
                        SELECT 1
                        FROM fotos_anuncios fa
                        WHERE fa.mascota_id = am.id
                    )
                ";
            }
        }

        // Filtra por mascotas que tengan al menos uno de los colores indicados.
        if (!empty($filters['color_ids'])) {
            $placeholders = [];

            foreach ($filters['color_ids'] as $index => $colorId) {
                $key = "color_$index";
                $placeholders[] = ':' . $key;
                $params[$key] = (int) $colorId;
            }

            $where .= "
                AND EXISTS (
                    SELECT 1
                    FROM mascotas_colores mc
                    WHERE mc.mascota_id = am.id
                      AND mc.color_id IN (" . implode(', ', $placeholders) . ")
                )
            ";
        }

        $orderBy = $this->buildOrderBy($filters['orden'] ?? 'recientes');

        return [
            'from' => $from,
            'where' => $where,
            'order_by' => $orderBy,
            'params' => $params
        ];
    }

    // Devuelve el ORDER BY según el valor recibido.
    private function buildOrderBy(string $orden): string
    {
        return match ($orden) {
            'antiguos' => "
                ORDER BY
                    fecha_evento ASC,
                    am.id ASC
            ",
            'nombre_asc' => "
                ORDER BY
                    am.nombre ASC,
                    am.id DESC
            ",
            'nombre_desc' => "
                ORDER BY
                    am.nombre DESC,
                    am.id DESC
            ",
            default => "
                ORDER BY
                    fecha_evento DESC,
                    am.id DESC
            "
        };
    }

    // Devuelve las mascotas recientes para la home.
    public function getRecentCards(int $limit = 4): array
    {
        $limit = max(1, (int) $limit);

        $sql = "
            SELECT
                am.id,
                am.nombre,
                am.estado,
                r.nombre AS raza_nombre,
                e.nombre AS especie_nombre,
                u.municipio,
                u.provincia,
                CASE
                    WHEN am.estado = 'RECUPERADA' THEN am.fecha_recuperada
                    WHEN am.estado = 'ENCONTRADA' THEN am.fecha_encontrada
                    WHEN am.estado = 'PERDIDA' THEN am.fecha_perdida
                    ELSE NULL
                END AS fecha_evento,
                CASE
                    WHEN am.estado = 'RECUPERADA' THEN 'RECUPERADA'
                    WHEN am.estado = 'ENCONTRADA' THEN 'ENCONTRADA'
                    WHEN am.estado = 'PERDIDA' THEN 'PERDIDA'
                    ELSE NULL
                END AS tipo_fecha_evento,
                (
                    SELECT fa.url
                    FROM fotos_anuncios fa
                    WHERE fa.mascota_id = am.id
                    ORDER BY fa.es_principal DESC, fa.orden ASC, fa.id ASC
                    LIMIT 1
                ) AS foto_principal_url
            FROM anuncio_mascotas am
            INNER JOIN razas r ON am.raza_id = r.id
            INNER JOIN especies e ON r.especies_id = e.id
            INNER JOIN ubicaciones u ON am.ubicaciones_perdida_id = u.id
            WHERE am.estado IN ('PERDIDA', 'ENCONTRADA') AND am.estado_publicacion = 'PUBLICADO'
            ORDER BY am.fecha_registro DESC, am.id DESC
            LIMIT {$limit}
        ";

        return $this->fetchAll($sql);
    }

    // Devuelve las tarjetas de mascotas de un usuario.
    public function getCardsByUsuarioId(int $usuarioId): array
    {
        $sql = "
            SELECT
                am.id,
                am.nombre,
                am.estado,
                r.nombre AS raza_nombre,
                e.nombre AS especie_nombre,
                u.municipio,
                u.provincia,
                CASE
                    WHEN am.estado = 'RECUPERADA' THEN am.fecha_recuperada
                    WHEN am.estado = 'ENCONTRADA' THEN am.fecha_encontrada
                    WHEN am.estado = 'PERDIDA' THEN am.fecha_perdida
                    ELSE NULL
                END AS fecha_evento,
                CASE
                    WHEN am.estado = 'RECUPERADA' THEN 'RECUPERADA'
                    WHEN am.estado = 'ENCONTRADA' THEN 'ENCONTRADA'
                    WHEN am.estado = 'PERDIDA' THEN 'PERDIDA'
                    ELSE NULL
                END AS tipo_fecha_evento,
                (
                    SELECT fa.url
                    FROM fotos_anuncios fa
                    WHERE fa.mascota_id = am.id
                    ORDER BY fa.es_principal DESC, fa.orden ASC, fa.id ASC
                    LIMIT 1
                ) AS foto_principal_url
            FROM anuncio_mascotas am
            INNER JOIN razas r ON am.raza_id = r.id
            INNER JOIN especies e ON r.especies_id = e.id
            INNER JOIN ubicaciones u ON am.ubicaciones_perdida_id = u.id
            WHERE am.usuario_id = :usuario_id
            ORDER BY am.fecha_registro DESC, am.id DESC
        ";

        return $this->fetchAll($sql, [
            'usuario_id' => $usuarioId
        ]);
    }

    // Devuelve el listado completo de mascotas.
    public function getAll(array $filters = []): array
    {
        $sql = "
            SELECT
                am.id,
                am.usuario_id,
                am.nombre,
                am.raza_id,
                am.sexo,
                am.tiene_chip,
                am.tamano,
                am.peso,
                am.descripcion,
                am.estado,
                am.fecha_registro,
                am.fecha_perdida,
                am.fecha_encontrada,
                am.fecha_recuperada,
                am.fecha_nacimiento,
                am.recompensa,
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
            INNER JOIN razas r ON am.raza_id = r.id
            INNER JOIN especies e ON r.especies_id = e.id
            INNER JOIN ubicaciones u ON am.ubicaciones_perdida_id = u.id
            WHERE 1 = 1
        ";

        $params = [];

        if (!empty($filters['estado'])) {
            $sql .= " AND am.estado = :estado";
            $params['estado'] = $filters['estado'];
        }

        if (!empty($filters['especie_id'])) {
            $sql .= " AND e.id = :especie_id";
            $params['especie_id'] = $filters['especie_id'];
        }

        if (!empty($filters['raza_id'])) {
            $sql .= " AND r.id = :raza_id";
            $params['raza_id'] = $filters['raza_id'];
        }

        if (!empty($filters['sexo'])) {
            $sql .= " AND am.sexo = :sexo";
            $params['sexo'] = $filters['sexo'];
        }

        if (!empty($filters['tamano'])) {
            $sql .= " AND am.tamano = :tamano";
            $params['tamano'] = $filters['tamano'];
        }

        if (!empty($filters['municipio'])) {
            $sql .= " AND u.municipio = :municipio";
            $params['municipio'] = $filters['municipio'];
        }

        if (!empty($filters['provincia'])) {
            $sql .= " AND u.provincia = :provincia";
            $params['provincia'] = $filters['provincia'];
        }

        $sql .= " ORDER BY am.fecha_registro DESC, am.id DESC";

        return $this->fetchAll($sql, $params);
    }

    // Devuelve una mascota por id con su ubicación.
    public function getById(int $id): ?array
    {
        $sql = "
            SELECT
                am.id,
                am.usuario_id,
                am.nombre,
                am.raza_id,
                am.sexo,
                am.tiene_chip,
                am.tamano,
                am.peso,
                am.descripcion,
                am.estado,
                am.estado_publicacion,
                am.fecha_registro,
                am.fecha_perdida,
                am.fecha_encontrada,
                am.fecha_recuperada,
                am.fecha_nacimiento,
                am.recompensa,
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
            INNER JOIN razas r ON am.raza_id = r.id
            INNER JOIN especies e ON r.especies_id = e.id
            INNER JOIN ubicaciones u ON am.ubicaciones_perdida_id = u.id
            WHERE am.id = :id
            LIMIT 1
        ";

        return $this->fetchOne($sql, ['id' => $id]);
    }

    // Inserta una mascota nueva.
    public function create(array $data): int
    {
        $sql = "
            INSERT INTO anuncio_mascotas (
                usuario_id,
                nombre,
                raza_id,
                sexo,
                tiene_chip,
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
                :raza_id,
                :sexo,
                :tiene_chip,
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

        return $this->insertAndGetId($sql, [
            'usuario_id' => $data['usuario_id'],
            'nombre' => $data['nombre'],
            'raza_id' => $data['raza_id'],
            'sexo' => $data['sexo'],
            'tiene_chip' => $data['tiene_chip'],
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

    // Actualiza una mascota existente.
    public function update(int $id, array $data): bool
    {
        $sql = "
            UPDATE anuncio_mascotas
            SET
                usuario_id = :usuario_id,
                nombre = :nombre,
                raza_id = :raza_id,
                sexo = :sexo,
                tiene_chip = :tiene_chip,
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
            'usuario_id' => $data['usuario_id'],
            'nombre' => $data['nombre'],
            'raza_id' => $data['raza_id'],
            'sexo' => $data['sexo'],
            'tiene_chip' => $data['tiene_chip'],
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

    // Borra la mascota principal por id.
    public function deletePublicById(int $id): bool
    {
        return $this->deleteById('anuncio_mascotas', $id);
    }

    // Comprueba si una mascota pertenece a un usuario.
    public function belongsToUsuario(int $mascotaId, int $usuarioId): bool
    {
        $sql = "
            SELECT id
            FROM anuncio_mascotas
            WHERE id = :mascota_id
              AND usuario_id = :usuario_id
            LIMIT 1
        ";

        $result = $this->fetchOne($sql, [
            'mascota_id' => $mascotaId,
            'usuario_id' => $usuarioId
        ]);

        return $result !== null;
    }


    // Cambia el estado de publicación de una mascota.
    public function updateEstadoPublicacion(int $id, string $estadoPublicacion): bool
    {
        $sql = "
        UPDATE anuncio_mascotas
        SET estado_publicacion = :estado_publicacion
        WHERE id = :id
    ";

        return $this->executeQuery($sql, [
            'id' => $id,
            'estado_publicacion' => $estadoPublicacion
        ]);
    }

    // Devuelve el listado de moderación para admin.
    public function getAdminModeracionList(): array
    {
        $sql = "
        SELECT
            am.id,
            am.nombre AS mascota,
            CONCAT(u.nombre, ' ', COALESCE(u.apellidos, '')) AS usuario,
            am.fecha_registro AS fecha,
            am.estado_publicacion AS estado
        FROM anuncio_mascotas am
        INNER JOIN usuarios u ON u.id = am.usuario_id
        ORDER BY am.fecha_registro DESC, am.id DESC
    ";

        return $this->fetchAll($sql);
    }
}
