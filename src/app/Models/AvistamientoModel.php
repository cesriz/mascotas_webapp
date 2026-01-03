<?php
declare(strict_types=1);

require_once __DIR__ . '/../Core/Database.php';

class Avistamiento
{
    private PDO $db;

    // Campos tabla
    public int $id = 0;
    public int $mascota_id = 0;

    public string $localizacion = '';
    public string $fecha_avistamiento = '';
    public ?string $descripcion = null;

    public string $telefono_contacto = '';
    public string $email_contacto = '';

    public ?string $foto_path = null;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Listar avistamientos de una mascota
     */
    public function obtenerPorMascota(int $mascotaId): array
    {
        $sql = "SELECT * FROM avistamientos WHERE mascota_id = :mid ORDER BY id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['mid' => $mascotaId]);

        return $stmt->fetchAll();
    }

    /**
     * Cargar avistamiento por ID
     */
    public function cargarPorId(int $id): bool
    {
        $sql = "SELECT * FROM avistamientos WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch();
        if (!$row) return false;

        foreach ($row as $campo => $valor) {
            if (property_exists($this, $campo)) {
                $this->$campo = $valor;
            }
        }

        return true;
    }

    /**
     * Insertar avistamiento
     */
    public function insertar(): int
    {
        $sql = "INSERT INTO avistamientos
            (mascota_id, localizacion, fecha_avistamiento, descripcion,
             telefono_contacto, email_contacto, foto_path)
            VALUES
            (:mascota_id, :localizacion, :fecha, :descripcion,
             :telefono, :email, :foto)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'mascota_id'  => $this->mascota_id,
            'localizacion'=> $this->localizacion,
            'fecha'       => $this->fecha_avistamiento,
            'descripcion' => $this->descripcion,
            'telefono'    => $this->telefono_contacto,
            'email'       => $this->email_contacto,
            'foto'        => $this->foto_path,
        ]);

        $this->id = (int)$this->db->lastInsertId();
        return $this->id;
    }

    /**
     * Borrar avistamiento 
     */
    public function borrar(int $id): void
    {
        $sql = "DELETE FROM avistamientos WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['id' => $id]);
    }
}
