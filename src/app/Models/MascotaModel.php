<?php
declare(strict_types=1);

require_once __DIR__ . '/../Core/Database.php';

class Mascota
{
    private PDO $db;

    // Campos de la tabla
    public int $id = 0;
    public string $estado = 'perdida';

    public string $nombre = '';
    public string $localizacion_perdida = '';
    public string $telefono_contacto = '';
    public string $email_contacto = '';
    public string $fecha_desaparicion = '';

    public ?string $raza = null;
    public ?string $tamano = null;
    public ?float $peso_kg = null;
    public ?string $color_pelaje = null;
    public ?string $color_ojos = null;
    public ?string $actitud = null;
    public ?string $observaciones = null;

    public ?string $foto_path = null;

    public function __construct()
    {
        // Conexión con BD
        $this->db = Database::getConnection();
    }

    /**
     * Listar mascotas por estado
     */
    public function obtenerTodas(string $estado): array
    {
        $sql = "SELECT * FROM mascotas WHERE estado = :estado ORDER BY id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['estado' => $estado]);

        return $stmt->fetchAll();
    }

    /**
     * Cargar mascota por ID 
     */
    public function cargarPorId(int $id): bool
{
    $stmt = $this->db->prepare(
        "SELECT * FROM mascotas WHERE id = :id"
    );
    $stmt->execute(['id' => $id]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return false;

    foreach ($row as $campo => $valor) {
        $this->$campo = $valor;
    }

    return true;
}


    /**
     * Insertar nueva mascota
     */
    public function insertar(): int
    {
        $sql = "INSERT INTO mascotas
            (estado,nombre,localizacion_perdida,telefono_contacto,email_contacto,
             fecha_desaparicion,raza,tamano,peso_kg,color_pelaje,color_ojos,
             actitud,observaciones,foto_path)
            VALUES
            (:estado,:nombre,:localizacion,:telefono,:email,
             :fecha,:raza,:tamano,:peso,:pelaje,:ojos,
             :actitud,:obs,:foto)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'estado'       => $this->estado,
            'nombre'       => $this->nombre,
            'localizacion' => $this->localizacion_perdida,
            'telefono'     => $this->telefono_contacto,
            'email'        => $this->email_contacto,
            'fecha'        => $this->fecha_desaparicion,
            'raza'         => $this->raza,
            'tamano'       => $this->tamano,
            'peso'         => $this->peso_kg,
            'pelaje'       => $this->color_pelaje,
            'ojos'         => $this->color_ojos,
            'actitud'      => $this->actitud,
            'obs'           => $this->observaciones,
            'foto'         => $this->foto_path,
        ]);

        $this->id = (int)$this->db->lastInsertId();
        return $this->id;
    }

    /**
     * Cambiar estado
     */
    public function cambiarEstado(int $id, string $estado): void
    {
        $sql = "UPDATE mascotas SET estado = :estado WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'estado' => $estado,
            'id'     => $id
        ]);
    }
}
