<?php
declare(strict_types=1);

// Maneja el CORS para que el front se pueda conectar al back
require_once __DIR__ . '/../app/Config/cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Carga librerías instaladas con Composer.
require_once __DIR__ . '/../vendor/autoload.php';

// Carga el router.
require_once __DIR__ . '/../app/Core/Router.php';

// Carga las rutas.
$routes = require_once __DIR__ . '/../app/Routes/api.php';

// Ejecuta el router.
$router = new Router($routes);
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

/**
 * 
 * Este es el punto de entrada del backend
 * coge el método: GET, POST, etc.y coge la URL, se la pasa al router y este decide qué controlador ejecutar
 */
