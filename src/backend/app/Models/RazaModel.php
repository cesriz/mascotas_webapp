<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class RazaModel extends BaseModel
{
    public function getAll(?int $especieId = null): array
    {
        $sql = "
            SELECT
                r.id,
                r.nombre,
                r.especies_id,
                e.nombre AS especie_nombre
            FROM razas r
            INNER JOIN especies e ON r.especies_id = e.id
            WHERE 1 = 1
        ";

        $params = [];

        if ($especieId !== null) {
            $sql .= " AND r.especies_id = :especie_id";
            $params['especie_id'] = $especieId;
        }

        $sql .= " ORDER BY r.nombre ASC";

        return $this->fetchAll($sql, $params);
    }
}