<?php

declare(strict_types=1);

class ContactoValidator
{
    // Valida el formulario de contacto.
    public static function validateStore(array $data): array
    {
        $errors = [];

        if (empty($data['nombre'])) {
            $errors[] = 'nombre es obligatorio';
        }

        if (empty($data['correo'])) {
            $errors[] = 'correo es obligatorio';
        } elseif (!filter_var($data['correo'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'correo no válido';
        }

        if (empty($data['telefono'])) {
            $errors[] = 'telefono es obligatorio';
        }

        if (empty($data['mensaje'])) {
            $errors[] = 'mensaje es obligatorio';
        }

        if (!empty($errors)) {
            return [
                'errors' => $errors,
                'data' => []
            ];
        }

        return [
            'errors' => [],
            'data' => [
                /*
                 * usuario_remitente_id puede venir del usuario autenticado
                 * o ser null si el mensaje es público.
                 */
                'usuario_remitente_id' => $data['usuario_remitente_id'] ?? null,

                'nombre' => trim((string) $data['nombre']),
                'correo' => trim((string) $data['correo']),
                'telefono' => trim((string) $data['telefono']),
                'mensaje' => trim((string) $data['mensaje']),
            ]
        ];
    }
}