<?php

declare(strict_types=1);

// Validador encargado de revisar y limpiar
// los datos recibidos al crear un reporte.
class ReporteValidator
{
    // Valida los campos obligatorios del reporte
    // y devuelve los datos ya normalizados.
    public static function validateStore(array $data): array
    {
        $errors = [];

        // Campos mínimos necesarios para poder crear el reporte.
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

        // Devuelve los datos limpios para que el controlador/modelo los use.
        return [
            'errors' => [],
            'data' => [
                'usuario_reportante_id' => $data['usuario_reportante_id'] ?? null,
                'asunto' => trim((string) $data['asunto']),
                'mensaje' => trim((string) $data['mensaje']),
                'nombre' => trim((string) $data['nombre']),
                'correo' => trim((string) $data['correo']),
                'telefono' => isset($data['telefono']) ? trim((string) $data['telefono']) : null,
            ]
        ];
    }
}