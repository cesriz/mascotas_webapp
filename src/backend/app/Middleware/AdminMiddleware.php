<?php

declare(strict_types=1);

require_once __DIR__ . '/../Core/Request.php';
require_once __DIR__ . '/../Core/Response.php';

/**
 * Middleware de administración.
 *
 * Permite continuar solo si:
 * - hay usuario autenticado
 * - el usuario tiene rol ADMIN
 */
class AdminMiddleware
{
    /**
     * Comprueba acceso administrativo.
     */
    public function handle(): void
    {
        $usuario = Request::user();

        if ($usuario === null) {
            Response::json([
                'success' => false,
                'message' => 'No autorizado'
            ], 401);
            exit;
        }

        if (($usuario['rol'] ?? null) !== 'ADMIN') {
            Response::json([
                'success' => false,
                'message' => 'Acceso denegado. Se requiere rol ADMIN'
            ], 403);
            exit;
        }
    }
}