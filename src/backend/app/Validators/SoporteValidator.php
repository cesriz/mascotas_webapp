<?php

declare(strict_types=1);

class SoporteValidator
{
    public static function validateStore(array $data): array
    {
        $errors = [];

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

        return [
            'errors' => [],
            'data' => [
                'usuario_id' => $data['usuario_id'] ?? null,
                'asunto' => trim((string) $data['asunto']),
                'categoria' => !empty($data['categoria']) ? trim((string) $data['categoria']) : 'GENERAL',
                'mensaje' => trim((string) $data['mensaje']),
                'nombre' => trim((string) $data['nombre']),
                'correo' => trim((string) $data['correo']),
                'telefono' => isset($data['telefono']) ? trim((string) $data['telefono']) : null,
            ]
        ];
    }
}