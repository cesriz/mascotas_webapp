<?php
declare(strict_types=1);

require_once __DIR__ . '/../Core/Database.php';

abstract class BaseModel
{
    protected PDO $db;

    public function __construct()
    {
        // Conexión compartida
        $this->db = Database::getConnection();
    }

    // Devuelve una sola fila o null
    protected function fetchOne(string $sql, array $params = []): ?array
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        $result = $stmt->fetch();

        return $result !== false ? $result : null;
    }

    // Devuelve varias filas
    protected function fetchAll(string $sql, array $params = []): array
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    // Ejecuta una query sin devolver filas
    protected function executeQuery(string $sql, array $params = []): bool
    {
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    // Inserta y devuelve el id generado
    protected function insertAndGetId(string $sql, array $params = []): int
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return (int) $this->db->lastInsertId();
    }

    // Busca por id en una tabla simple
    protected function findById(string $table, int $id, string $primaryKey = 'id'): ?array
    {
        $sql = "SELECT * FROM {$table} WHERE {$primaryKey} = :id LIMIT 1";
        return $this->fetchOne($sql, ['id' => $id]);
    }

    // Borra por id en una tabla simple
    protected function deleteById(string $table, int $id, string $primaryKey = 'id'): bool
    {
        $sql = "DELETE FROM {$table} WHERE {$primaryKey} = :id";
        return $this->executeQuery($sql, ['id' => $id]);
    }

    // Inicia transacción
    public function beginTransaction(): void
    {
        $this->db->beginTransaction();
    }

    // Confirma transacción
    public function commit(): void
    {
        $this->db->commit();
    }

    // Revierte transacción
    public function rollBack(): void
    {
        if ($this->db->inTransaction()) {
            $this->db->rollBack();
        }
    }
}