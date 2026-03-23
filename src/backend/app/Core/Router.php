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
        // Quita query params (?estado=...)
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';

        // Recorre todas las rutas
        foreach ($this->routes as [$routeMethod, $routePath, $handler]) {

            // Comprueba método HTTP (GET, POST...)
            if ($routeMethod !== $method) {
                continue;
            }

            // Comprueba si la URL encaja con la ruta
            $params = $this->match($routePath, $path);
            if ($params === null) {
                continue;
            }

            // Separa "Controlador@accion"
            [$controllerName, $action] = explode('@', $handler);

            // Ruta al archivo del controlador
            $controllerFile = __DIR__ . '/../Controllers/' . $controllerName . '.php';

            // Comprueba que existe el archivo
            if (!is_file($controllerFile)) {
                http_response_code(500);
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
                echo json_encode([
                    'success' => false,
                    'message' => "Acción $action no encontrada"
                ]);
                return;
            }

            // Ejecuta el método con parámetros (ej: id)
            $controller->$action(...$params);
            return;
        }

        // Si no hay coincidencia → 404
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Ruta no encontrada'
        ]);
    }

    // Comprueba si una ruta coincide y extrae parámetros
    private function match(string $routePath, string $actualPath): ?array
    {
        // Convierte {id} en número
        $pattern = preg_replace('#\{id\}#', '(\d+)', $routePath);

        // Ajusta inicio y fin
        $pattern = '#^' . $pattern . '$#';

        // Si no coincide → null
        if (!preg_match($pattern, $actualPath, $matches)) {
            return null;
        }

        // Quita la coincidencia completa
        array_shift($matches);

        // Devuelve parámetros como enteros
        return array_map('intval', $matches);
    }
}


