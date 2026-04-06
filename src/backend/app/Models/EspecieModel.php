<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class EspecieModel extends BaseModel
{
    public function getAll(): array
    {
        $sql = "
            SELECT id, nombre
            FROM especies
            ORDER BY nombre ASC
        ";

        return $this->fetchAll($sql);
    }
}