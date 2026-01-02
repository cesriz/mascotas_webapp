<?php
declare(strict_types=1);

class Router
{
    private array $routes;

    public function __construct()
    {
        // Cargamos TODAS las rutas desde config/routes.php
        $this->routes = require __DIR__ . '/../../config/routes.php';
    }

    /**
     * Decide qué controlador y acción ejecutar
     */
    public function dispatch(string $method, string $uri): void
    {
        // Quitamos parámetros tipo ?q=algo
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';

        // Recorremos todas las rutas declaradas
        foreach ($this->routes as [$routeMethod, $routePath, $handler]) {

            // Comprobamos método HTTP
            if ($routeMethod !== $method) {
                continue;
            }

            // Comprobamos si la URL encaja con la ruta
            $params = $this->match($routePath, $path);
            if ($params === null) {
                continue;
            }

            // Separar Controlador@accion
            [$controllerName, $action] = explode('@', $handler);

            // Cargar el archivo del controlador
            $controllerFile = __DIR__ . '/../Controllers/' . $controllerName . '.php';

            if (!is_file($controllerFile)) {
                http_response_code(500);
                echo "Error: no existe el controlador $controllerName";
                return;
            }

            require_once $controllerFile;

            //Comprobar que existe la clase
            if (!class_exists($controllerName)) {
                http_response_code(500);
                echo "Error: clase $controllerName no encontrada";
                return;
            }

            $controller = new $controllerName();

            // Comprobar que existe la acción
            if (!method_exists($controller, $action)) {
                http_response_code(404);
                echo "Acción $action no encontrada en $controllerName";
                return;
            }

            // Ejecutar acción con parámetros (ej: id)
            $controller->$action(...$params);
            return;
        }

        // Si ninguna ruta coincide
        http_response_code(404);
        echo '404 - Página no encontrada';
    }

    /**
     * Comprueba si una ruta tipo /mascotas/{id}
     * encaja con una URL real tipo /mascotas/12
     */
    private function match(string $routePath, string $actualPath): ?array
    {
        // Convertimos {id} en expresión regular numérica
        $pattern = preg_replace('#\{id\}#', '(\d+)', $routePath);

        // Forzamos inicio y fin de la URL
        $pattern = '#^' . $pattern . '$#';

        // Si no encaja, devolvemos null
        if (!preg_match($pattern, $actualPath, $matches)) {
            return null;
        }

        // Quitamos la coincidencia completa
        array_shift($matches);

        // Convertimos parámetros a int
        return array_map('intval', $matches);
    }
}


