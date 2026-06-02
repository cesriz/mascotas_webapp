<?php

declare(strict_types=1);

// Validador encargado de revisar y limpiar
// los datos enviados en formularios de soporte.
class SoporteValidator
{
    // Valida los campos obligatorios y devuelve
    // los datos normalizados listos para guardar.
    public static function validateStore(array $data): array
    {
        $errors = [];

        // Campos mínimos requeridos para crear el ticket.
        if (empty($data['asunto'])) {
            $errors[] = 'asunto es obligatorio';
        }

        if (empty($data['mensaje'])) {
            $errors[] = 'mensaje es obligatorio';
        }

        if (empty($data['nombre'])) {
            $errors[] = 'nombre es obligatorio';
        }

        if (empty($data['correo'])) {
            $errors[] = 'correo es obligatorio';
        } elseif (!filter_var($data['correo'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'correo no válido';
        }

        if (!empty($errors)) {
            return [
                'errors' => $errors,
                'data' => []
            ];
        }

        $usuarioId = null;
        if (isset($data['usuario_id']) && is_numeric($data['usuario_id']) && (int) $data['usuario_id'] > 0) {
            $usuarioId = (int) $data['usuario_id'];
        }

        // Devuelve datos ya limpios y con valores por defecto.
        return [
            'errors' => [],
            'data' => [
                'usuario_id' => $usuarioId,
                'asunto' => trim((string) $data['asunto']),

                // Si no se indica categoría, se asigna GENERAL.
                'categoria' => !empty($data['categoria'])
                    ? trim((string) $data['categoria'])
                    : 'GENERAL',

                'mensaje' => trim((string) $data['mensaje']),
                'nombre' => trim((string) $data['nombre']),
                'correo' => trim((string) $data['correo']),
                'telefono' => isset($data['telefono'])
                    ? trim((string) $data['telefono'])
                    : null,
            ]
        ];
    }
}
