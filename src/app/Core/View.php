<?php
/*
ALTERNATIVA CON LAYOUTS, CUANDO AVANCEMOS EN EL PROYECTO LO INCORPORAMOS PARA HACERLO MÁS MODULAR
declare(strict_types=1);

class View
{
    public static function render(string $view, array $data = [], string $layout = 'layouts/main'): void
    {
        $viewPath = __DIR__ . "/../../resources/views/{$view}.php";
        $layoutPath = __DIR__ . "/../../resources/views/{$layout}.php";

        if (!is_file($viewPath)) { // “¿Existe el archivo de la vista?”
            http_response_code(500);
            echo "View not found: {$view}";
            return;
        }
        if (!is_file($layoutPath)) {
            http_response_code(500);
            echo "Layout not found: {$layout}";
            return;
        }

        // Variables disponibles en la vista
        extract($data, EXTR_SKIP); // Convierte el array $data en variables normales.

        // Capturamos la vista en $content
        ob_start();
        require $viewPath;
        $content = ob_get_clean();

        // Pintamos el layout que usa $content
        require $layoutPath;
    }
}
*/

declare(strict_types=1);

class View
{
    public static function render(string $view, array $data = []): void
    {
        // Ruta física a la vista
        $viewPath = __DIR__ . "/../../resources/views/{$view}.php";

        // Comprobamos que la vista existe
        if (!is_file($viewPath)) {
            http_response_code(500);
            echo "View not found: {$view}";
            return;
        }

        // Convertimos el array $data en variables normales
        extract($data, EXTR_SKIP);

        // Cargamos la vista directamente (sin layout)
        require $viewPath;
    }
}

