<?php
declare(strict_types=1);

class HomeController
{
    /**
     * Ruta GET /
     * Punto de entrada de la aplicación.
     *
     * En el futuro:
     * - Si el usuario está logueado → redirigir a la lista de mascotas perdidas
     * - Si no está logueado → redirigir a login o a una home pública
     */
    public function index(): void
    {
        // TODO: aquí se comprobará la sesión del usuario (login)
        // Ejemplo futuro:
        // if (!empty($_SESSION['user_id'])) {
        //     header('Location: /mascotas?estado=perdida');
        //     exit;
        // }

        // Por ahora, siempre redirigimos a la lista de mascotas perdidas
        header('Location: /mascotas?estado=perdida');
        exit;
    }
}

