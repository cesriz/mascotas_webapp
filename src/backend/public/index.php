<?php
declare(strict_types=1);

require_once __DIR__ . '/../app/Core/Router.php';

$routes = require __DIR__ . '/../app/Routes/api.php';

$router = new Router($routes);
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

/**
 * 
 * Este es el punto de entrada del backend
 * coge el método: GET, POST, etc.y coge la URL, se la pasa al router y este decide qué controlador ejecutar
 */