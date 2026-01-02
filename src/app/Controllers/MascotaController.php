<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/MascotaRepository.php';

class MascotaController
{
    private MascotaFiltro $mascotaFiltro;

    public function __construct()
    {
        // Creamos el filtro (el que sabe conseguir mascotas)
        $this->mascotaFiltro = new MascotaFiltro();
    }

    /**
     * GET /mascotas
     * Esto muestra la LISTA de mascotas.
     */
    public function index(): void
    {
        // 1) Leemos el filtro que puede venir por la URL:
        //    /mascotas?estado=perdida  o  /mascotas?estado=encontrada
        $estado = $_GET['estado'] ?? 'perdida'; // si no viene, perdidas por defecto

        // 2) Pedimos al repositorio la lista de mascotas de ese estado
        //    Esto te devuelve un array de objetos Mascota
        $mascotas = $this->mascotaFiltro->obtenerTodas($estado);

        // 3) Cargamos la vista que pinta el listado
        //    La vista usará la variable $mascotas
        require __DIR__ . '/../Views/mascotas/index.php';
    }

    /**
     * GET /mascotas/{id}
     * Esto muestra el DETALLE de una mascota.
     */
    public function show(int $id): void
    {
        // 1) Pedimos la mascota concreta
        $mascota = $this->repo->obtenerPorId($id);

        // 2) Si no existe -> mensaje simple
        if ($mascota === null) {
            http_response_code(404);
            echo 'Mascota no encontrada';
            return;
        }

        // 3) Cargamos la vista del detalle
        require __DIR__ . '/../Views/mascotas/show.php';
    }

    /**
     * GET /mascotas/crear
     * Mostrar el formulario de publicar mascota
     */
    public function create(): void
    {
        require __DIR__ . '/../Views/mascotas/create.php';
    }

    /**
     * POST /mascotas
     * Guardar la nueva mascota que viene del formulario
     */
    public function store(): void
    {
        // 1) Recogemos datos del formulario
        $nombre = trim($_POST['nombre'] ?? '');
        $tipo = trim($_POST['tipo'] ?? '');
        $ciudad = trim($_POST['ciudad'] ?? '');
        $descripcion = trim($_POST['descripcion'] ?? '');

        // 2) Creamos un objeto Mascota (id provisional 0 porque la BD luego dará el real)
        $mascota = new Mascota(
            id: 0,
            nombre: $nombre,
            tipo: $tipo,
            estado: 'perdida',
            ciudad: $ciudad,
            descripcion: $descripcion
        );

        // 3) Mandamos al repositorio guardarla
        $this->repo->crear($mascota);

        // 4) Redirigimos al listado
        header('Location: /mascotas');
        exit;
    }

    /**
     * POST /mascotas/{id}/estado
     * Cambiar estado (perdida/encontrada/cerrada)
     */
    public function actualizarEstado(int $id): void
    {
        $estado = $_POST['estado'] ?? 'perdida';
        $this->repo->actualizarEstado($id, $estado);

        header('Location: /mascotas/' . $id);
        exit;
    }
}

