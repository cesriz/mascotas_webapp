<?php

class Router // Redirreciona para llamar al controlador concreto qeu solicitó la URL
{
    public function dispatch($method, $uri)
    {
        // 1. Limpiar la URL
        $path = parse_url($uri, PHP_URL_PATH);

        // 2. Ruta /
        if ($path === '/') { // Si la URL es exactamente / (la home)
            require __DIR__ . '/../Controllers/HomeController.php';
            $controller = new HomeController();
            $controller->index(); // Llamamos a la acción index
            return;
        }

        // 3. Ruta /cases
        if ($path === '/cases') {
            require __DIR__ . '/../Controllers/CaseController.php';
            $controller = new CaseController();
            $controller->index();
            return;
        }

        // 4. Si no coincide nada
        echo '404 - Página no encontrada';
    }
}

