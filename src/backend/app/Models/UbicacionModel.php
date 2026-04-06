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
}