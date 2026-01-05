<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Mascota.php';
require_once __DIR__ . '/../Models/Avistamiento.php';

class MascotaController
{
    // GET /mascotas?estado=perdida
    public function index(): void
    {
        $estado = $_GET['estado'] ?? 'perdida';

        if ($estado !== 'perdida' && $estado !== 'encontrada') {
            $estado = 'perdida';
        }

        $mascota = new Mascota();
        $mascotas = $mascota->obtenerTodas($estado);

        require __DIR__ . '/../../resources/views/mascotas/index.php';
    }

    // GET /mascotas/{id}
    public function show(int $id): void
    {
        // 1) Cargar la mascota
        $mascota = new Mascota();
        if (!$mascota->cargarPorId($id)) {
            http_response_code(404);
            echo 'Mascota no encontrada';
            return;
        }

        // 2) Cargar sus avistamientos (para mostrarlos debajo en el detalle)
        $av = new Avistamiento();
        $avistamientos = $av->obtenerPorMascota($id);

        // 3) Vista del detalle (usa $mascota y $avistamientos)
        require __DIR__ . '/../../resources/views/mascotas/show.php';
    }

    // GET /mascotas/crear
    public function create(): void
    {
        $errores = [];
        require __DIR__ . '/../../resources/views/mascotas/create.php';
    }

    // POST /mascotas
    public function store(): void
    {
        $m = new Mascota();

        $m->nombre = trim($_POST['nombre'] ?? '');
        $m->localizacion_perdida = trim($_POST['localizacion_perdida'] ?? '');
        $m->telefono_contacto = trim($_POST['telefono_contacto'] ?? '');
        $m->email_contacto = trim($_POST['email_contacto'] ?? '');
        $m->fecha_desaparicion = trim($_POST['fecha_desaparicion'] ?? '');
        $m->estado = 'perdida';

        $peso = trim($_POST['peso_kg'] ?? '');
        $m->peso_kg = ($peso !== '' && is_numeric($peso)) ? (float)$peso : null;

        $m->foto_path = $this->guardarFoto($_FILES['foto'] ?? null);

        // Validación
        $errores = [];
        if ($m->nombre === '') $errores[] = 'Falta el nombre';
        if ($m->localizacion_perdida === '') $errores[] = 'Falta la localización';
        if ($m->telefono_contacto === '') $errores[] = 'Falta el teléfono';
        if ($m->email_contacto === '') $errores[] = 'Falta el email';
        if ($m->fecha_desaparicion === '') $errores[] = 'Falta la fecha';

        if (!empty($errores)) {
            require __DIR__ . '/../../resources/views/mascotas/create.php';
            return;
        }

        $id = $m->insertar();

        header('Location: /mascotas/' . $id);
        exit;
    }

    // POST /mascotas/{id}/estado
    public function actualizarEstado(int $id): void
    {
        $estado = $_POST['estado'] ?? 'perdida';

        if ($estado !== 'perdida' && $estado !== 'encontrada') {
            $estado = 'perdida';
        }

        $m = new Mascota();
        $m->cambiarEstado($id, $estado);

        header('Location: /mascotas/' . $id);
        exit;
    }

    private function guardarFoto(?array $file): ?string
    {
        if ($file === null || $file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $ruta = __DIR__ . '/../../../public/uploads/mascotas';

        if (!is_dir($ruta)) {
            mkdir($ruta, 0775, true);
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $nombre = uniqid('m_', true) . '.' . $extension;

        move_uploaded_file($file['tmp_name'], $ruta . '/' . $nombre);

        return '/uploads/mascotas/' . $nombre;
    }
}
