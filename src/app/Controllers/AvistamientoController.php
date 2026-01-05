<?php
declare(strict_types=1);

require_once __DIR__ . '/../Models/Avistamiento.php';
require_once __DIR__ . '/../Models/Mascota.php';

class AvistamientoController
{
    // GET /mascotas/{id}/avistamientos/crear
    public function create(int $mascotaId): void
    {
        $mascota = new Mascota();
        if (!$mascota->cargarPorId($mascotaId)) {
            http_response_code(404);
            echo 'Mascota no encontrada';
            return;
        }

        $errores = [];
        require __DIR__ . '/../../resources/views/avistamientos/create.php';
    }

    // POST /mascotas/{id}/avistamientos
    public function store(int $mascotaId): void
    {
        $mascota = new Mascota();
        if (!$mascota->cargarPorId($mascotaId)) {
            http_response_code(404);
            echo 'Mascota no encontrada';
            return;
        }

        $avistamiento = new Avistamiento();
        $avistamiento->mascota_id = $mascotaId;

        $avistamiento->localizacion = trim($_POST['localizacion'] ?? '');
        $avistamiento->fecha_avistamiento = trim($_POST['fecha_avistamiento'] ?? '');
        $avistamiento->descripcion = trim($_POST['descripcion'] ?? '');

        $avistamiento->telefono_contacto = trim($_POST['telefono_contacto'] ?? '');
        $avistamiento->email_contacto = trim($_POST['email_contacto'] ?? '');

        $avistamiento->foto_path = $this->guardarFoto($_FILES['foto'] ?? null);

        // Validación básica
        $errores = [];
        if ($avistamiento->localizacion === '') $errores[] = 'Falta la localización';
        if ($avistamiento->fecha_avistamiento === '') $errores[] = 'Falta la fecha del avistamiento';
        if ($avistamiento->telefono_contacto === '') $errores[] = 'Falta el teléfono';
        if ($avistamiento->email_contacto === '') $errores[] = 'Falta el email';

        if (!empty($errores)) {
            // OJO: si hay errores, volvemos a enseñar el formulario
            // y necesitamos $mascotaId para el action del form
            require __DIR__ . '/../../resources/views/avistamientos/create.php';
            return;
        }

        
        $avistamiento->insertar();

        // Volvemos al detalle de la mascota
        header('Location: /mascotas/' . $mascotaId);
        exit;
    }

    private function guardarFoto(?array $file): ?string
    {
        if ($file === null || $file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $ruta = __DIR__ . '/../../../public/uploads/avistamientos';

        if (!is_dir($ruta)) {
            mkdir($ruta, 0775, true);
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $nombre = uniqid('a_', true) . '.' . $extension;

        move_uploaded_file($file['tmp_name'], $ruta . '/' . $nombre);

        return '/uploads/avistamientos/' . $nombre;
    }
}
