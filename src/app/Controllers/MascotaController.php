<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Mascota.php';

class MascotaController
{


    // GET /mascotas?estado=perdida
    public function index(): void
    {
        // Para poner por estado por defecto "perdida"
        $estado = $_GET['estado'] ?? 'perdida';

        // Validación de que se ha introducido estado válido, sino se pone por defecto "perdida"
        if (!in_array($estado, ['perdida','encontrada'], true)) {
            $estado = 'perdida';
        }

        $mascota = new Mascota();
        $mascotas = $mascota->obtenerTodas($estado);

        require __DIR__ . '/../Views/mascotas/index.php';

    }




    // GET /mascotas/{id}
    public function show(int $id): void
    {
        $mascota = new Mascota();

        if (!$mascota->cargarPorId($id)) {
            http_response_code(404);
            echo 'Mascota no encontrada';
            return;
        }

        require __DIR__ . '/../Views/mascotas/show.php';
    }




    // GET /mascotas/crear
    public function create(): void
    {
        $errores = [];
        require __DIR__ . '/../Views/mascotas/create.php';
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

        // Foto simple
        $m->foto_path = $this->guardarFoto($_FILES['foto'] ?? null);

        // Validación 
        $errores = [];
        if ($m->nombre === '') $errores[] = 'Falta el nombre';
        if ($m->localizacion_perdida === '') $errores[] = 'Falta la localización';
        if ($m->telefono_contacto === '') $errores[] = 'Falta el teléfono';
        if ($m->email_contacto === '') $errores[] = 'Falta el email';
        if ($m->fecha_desaparicion === '') $errores[] = 'Falta la fecha';

        if (!empty($errores)) {
            require __DIR__ . '/../Views/mascotas/create.php';
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


        // Validación de que se ha introducido estado válido, sino se pone por defecto "perdida"
        if (!in_array($estado, ['perdida','encontrada'], true)) {
            $estado = 'perdida';
        }

        $m = new Mascota();
        $m->cambiarEstado($id, $estado);

        header('Location: /mascotas/' . $id);
        exit;
    }


    

    // Para manejar fotos asociadas a la mascota

    private function guardarFoto(?array $file): ?string // Parámetro de entrada será $_FILES['foto'] y devuelve una ruta donde se guardó la foto en el proyecto
    {
        if ($file === null || $file['error'] !== UPLOAD_ERR_OK) { // Si dió error devuelve null
            return null;
        }

        // Ruta donde se guardarán las fotos
        $ruta = __DIR__ . '/../../public/uploads/mascotas';

        // Si la carpeta no existe creála en esa ubicación
        if (!is_dir($ruta)) {
            mkdir($ruta, 0775, true);
        }


        // Obtenemos la extensión del archivo ("bretón.jpg")
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION); // Obtenemos la extensión del archivo ("bretón.jpg" -> jpg)
        $nombre = uniqid('m_', true) . '.' . $extension; // Crea un nombre único para el archivo para evitar sobreescribir archivos
        move_uploaded_file($file['tmp_name'], $ruta . '/' . $nombre); // Muevela foto u archivo desde carpeta temporal del formulario a carpeta uploads de nuestro proyecto

        return '/uploads/mascotas/' . $nombre;
    }
}
