<?php

declare(strict_types=1);

class Router
{
    private array $routes;

    // Recibe las rutas desde index.php
    public function __construct(array $routes)
    {
        $this->routes = $routes;
    }

    // Decide qué controlador ejecutar según método + URL
    public function dispatch(string $method, string $uri): void
    {
        // Quita query params
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';

        // Recorre todas las rutas
        foreach ($this->routes as $route) {
            // Permite rutas con 3 elementos o con 4 si llevan opciones.
            $routeMethod = $route[0];
            $routePath = $route[1];
            $handler = $route[2];
            $options = $route[3] ?? [];

            // Comprueba método HTTP
            if (strtoupper($routeMethod) !== strtoupper($method)) {
                continue;
            }

            // Comprueba si la URL encaja con la ruta
            $params = $this->match($routePath, $path);
            if ($params === null) {
                continue;
            }

            // Si la ruta es privada, ejecuta el middleware auth antes del controlador
            if (!empty($options['auth'])) {
                $middlewareFile = __DIR__ . '/../Middelware/AuthMiddleware.php';

                if (!is_file($middlewareFile)) {
                    http_response_code(500);
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode([
                        'success' => false,
                        'message' => 'AuthMiddleware no encontrado'
                    ]);
                    return;
                }

                require_once $middlewareFile;

                if (!class_exists('AuthMiddleware')) {
                    http_response_code(500);
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode([
                        'success' => false,
                        'message' => 'Clase AuthMiddleware no encontrada'
                    ]);
                    return;
                }

                $middleware = new AuthMiddleware();
                $middleware->handle();
            }

            // Si la ruta requiere admin, ejecuta el middleware admin
            if (!empty($options['admin'])) {
                $adminMiddlewareFile = __DIR__ . '/../Middelware/AdminMiddleware.php';

                if (!is_file($adminMiddlewareFile)) {
                    http_response_code(500);
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode([
                        'success' => false,
                        'message' => 'AdminMiddleware no encontrado'
                    ]);
                    return;
                }

                require_once $adminMiddlewareFile;

                if (!class_exists('AdminMiddleware')) {
                    http_response_code(500);
                    header('Content-Type: application/json; charset=utf-8');
                    echo json_encode([
                        'success' => false,
                        'message' => 'Clase AdminMiddleware no encontrada'
                    ]);
                    return;
                }

                $adminMiddleware = new AdminMiddleware();
                $adminMiddleware->handle();
            }

            // Separa "Controlador@accion"
            [$controllerName, $action] = explode('@', $handler);

            // Ruta al archivo del controlador
            $controllerFile = __DIR__ . '/../Controllers/' . $controllerName . '.php';

            // Comprueba que existe el archivo
            if (!is_file($controllerFile)) {
                http_response_code(500);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'success' => false,
                    'message' => "Controlador $controllerName no encontrado"
                ]);
                return;
            }

            // Carga el controlador
            require_once $controllerFile;

            // Comprueba que la clase existe
            if (!class_exists($controllerName)) {
                http_response_code(500);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'success' => false,
                    'message' => "Clase $controllerName no encontrada"
                ]);
                return;
            }

            // Instancia el controlador
            $controller = new $controllerName();

            // Comprueba que existe el método
            if (!method_exists($controller, $action)) {
                http_response_code(404);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode([
                    'success' => false,
                    'message' => "Acción $action no encontrada"
                ]);
                return;
            }

            // Ejecuta el método con parámetros
            $controller->$action(...$params);
            return;
        }

        // Si no hay coincidencia
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'message' => 'Ruta no encontrada'
        ]);
    }

    // Comprueba si una ruta coincide y extrae parámetros
    private function match(string $routePath, string $actualPath): ?array
    {
        // Convierte cualquier placeholder tipo {id}, {contactoId}, {avistamientoId}
        // en un patrón numérico
        $pattern = preg_replace('#\{[a-zA-Z_][a-zA-Z0-9_]*\}#', '(\d+)', $routePath);

        // Ajusta inicio y fin
        $pattern = '#^' . $pattern . '$#';

        // Si no coincide
        if (!preg_match($pattern, $actualPath, $matches)) {
            return null;
        }

        // Quita la coincidencia completa
        array_shift($matches);

        // Devuelve parámetros como enteros
        return array_map('intval', $matches);
    }
}