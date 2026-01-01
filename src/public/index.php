<?php

// Toda URL entra aquí y se decide qué controlador ejecutar. Es como el FrontController.

declare(strict_types=1);

// 1) Cargar configuración base (cosas globales)
$appConfig = require __DIR__ . '/../config/app.php';

// 2) Cargar clases núcleo
require_once __DIR__ . '/../app/Core/Router.php';

// 3) Lanzar el router
$router = new Router();
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);