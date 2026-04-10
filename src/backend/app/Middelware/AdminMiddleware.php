<?php

declare(strict_types=1);

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

class AdminMiddleware
{
    public function handle(): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
        }

        if (($usuario['rol'] ?? null) !== 'ADMIN') {
            Response::json([
                'success' => false,
                'message' => 'Acceso denegado. Se requiere rol ADMIN'
            ], 403);
        }
    }
}