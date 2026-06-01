<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class ColorModel extends BaseModel
{
    // Devuelve todos los colores del catálogo
    public function getAll(): array
    {
        // SQL del listado
        $sql = "
            SELECT
                id,
                nombre
            FROM colores
            ORDER BY nombre ASC
        ";

        // Ejecuta y devuelve todas las filas
        return $this->fetchAll($sql);
    }

    // Devuelve un color concreto por id
    public function getById(int $id): ?array
    {
        // Aprovechamos el método genérico del BaseModel
        return $this->findById('colores', $id);
    }
}