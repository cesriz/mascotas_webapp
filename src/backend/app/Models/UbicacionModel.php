<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class UbicacionModel extends BaseModel
{
    /*
     * Inserta una nueva ubicación y devuelve su id
     */
    public function create(array $data): int
    {
        $sql = "
            INSERT INTO ubicaciones (
                latitud,
                longitud,
                direccion_formateada,
                municipio,
                provincia,
                codigo_postal,
                pais,
                descripcion
            ) VALUES (
                :latitud,
                :longitud,
                :direccion_formateada,
                :municipio,
                :provincia,
                :codigo_postal,
                :pais,
                :descripcion
            )
        ";

        return $this->insertAndGetId($sql, [
            'latitud' => $data['latitud'],
            'longitud' => $data['longitud'],
            'direccion_formateada' => $data['direccion_formateada'],
            'municipio' => $data['municipio'],
            'provincia' => $data['provincia'],
            'codigo_postal' => $data['codigo_postal'],
            'pais' => $data['pais'],
            'descripcion' => $data['descripcion'],
        ]);
    }

    // Devuelve una ubicación concreta por id.
    public function getById(int $id): ?array
    {
        return $this->findById('ubicaciones', $id);
    }

    // Actualiza una ubicación existente.
    public function update(int $id, array $data): bool
    {
        $sql = "
            UPDATE ubicaciones
            SET
                latitud = :latitud,
                longitud = :longitud,
                direccion_formateada = :direccion_formateada,
                municipio = :municipio,
                provincia = :provincia,
                codigo_postal = :codigo_postal,
                pais = :pais,
                descripcion = :descripcion
            WHERE id = :id
        ";

        return $this->executeQuery($sql, [
            'id' => $id,
            'latitud' => $data['latitud'],
            'longitud' => $data['longitud'],
            'direccion_formateada' => $data['direccion_formateada'],
            'municipio' => $data['municipio'],
            'provincia' => $data['provincia'],
            'codigo_postal' => $data['codigo_postal'],
            'pais' => $data['pais'],
            'descripcion' => $data['descripcion'],
        ]);
    }

    // Borra una ubicación por id.
    public function deletePublicById(int $id): bool
    {
        return $this->deleteById('ubicaciones', $id);
    }

    // Devuelve el catálogo de provincias existentes en ubicaciones.
    public function getProvincias(): array
    {
        $sql = "
            SELECT DISTINCT provincia
            FROM ubicaciones
            WHERE provincia IS NOT NULL
              AND TRIM(provincia) <> ''
            ORDER BY provincia ASC
        ";

        $rows = $this->fetchAll($sql);

        return array_map(
            static fn(array $row): string => $row['provincia'],
            $rows
        );
    }

    // Devuelve el catálogo de municipios.
    // Si se indica provincia, filtra por esa provincia.
    public function getMunicipios(?string $provincia = null): array
    {
        $sql = "
            SELECT DISTINCT municipio
            FROM ubicaciones
            WHERE municipio IS NOT NULL
              AND TRIM(municipio) <> ''
        ";

        $params = [];

        if ($provincia !== null) {
            $sql .= " AND provincia = :provincia";
            $params['provincia'] = $provincia;
        }

        $sql .= " ORDER BY municipio ASC";

        $rows = $this->fetchAll($sql, $params);

        return array_map(
            static fn(array $row): string => $row['municipio'],
            $rows
        );
    }
}