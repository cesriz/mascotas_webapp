<?php
declare(strict_types=1);

class AvistamientoValidator
{
    public static function validateStore(array $data): array
    {
        $errors = [];

        // Si quieres, teléfono puede seguir siendo obligatorio siempre.
        if (empty($data['telefono'])) {
            $errors[] = 'telefono es obligatorio';
        }

        // Correo opcional, pero si viene tiene que ser válido.
        if (!empty($data['correo']) && !filter_var($data['correo'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'correo no válido';
        }

        if (empty($data['fecha_hora'])) {
            $errors[] = 'fecha_hora es obligatoria';
        }

        if (empty($data['ubicacion']) || !is_array($data['ubicacion'])) {
            $errors[] = 'ubicacion es obligatoria';
        } else {
            $ubicacion = $data['ubicacion'];

            if (!isset($ubicacion['latitud']) || $ubicacion['latitud'] === '') {
                $errors[] = 'ubicacion.latitud es obligatoria';
            } elseif (!is_numeric($ubicacion['latitud'])) {
                $errors[] = 'ubicacion.latitud debe ser numérica';
            }

            if (!isset($ubicacion['longitud']) || $ubicacion['longitud'] === '') {
                $errors[] = 'ubicacion.longitud es obligatoria';
            } elseif (!is_numeric($ubicacion['longitud'])) {
                $errors[] = 'ubicacion.longitud debe ser numérica';
            }

            if (empty($ubicacion['municipio'])) {
                $errors[] = 'ubicacion.municipio es obligatorio';
            }

            if (empty($ubicacion['provincia'])) {
                $errors[] = 'ubicacion.provincia es obligatoria';
            }
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
                 * usuario_id puede venir del usuario autenticado o ser null
                 * si el avistamiento es público.
                 */
                'usuario_id' => $data['usuario_id'] ?? null,

                'telefono' => trim((string) $data['telefono']),
                'correo' => isset($data['correo']) && $data['correo'] !== ''
                    ? trim((string) $data['correo'])
                    : null,
                'descripcion' => isset($data['descripcion']) && $data['descripcion'] !== ''
                    ? trim((string) $data['descripcion'])
                    : null,
                'fecha_hora' => $data['fecha_hora'],
                'ubicacion' => [
                    'latitud' => (float) $data['ubicacion']['latitud'],
                    'longitud' => (float) $data['ubicacion']['longitud'],
                    'direccion_formateada' => isset($data['ubicacion']['direccion_formateada']) && $data['ubicacion']['direccion_formateada'] !== ''
                        ? trim((string) $data['ubicacion']['direccion_formateada'])
                        : null,
                    'municipio' => trim((string) $data['ubicacion']['municipio']),
                    'provincia' => trim((string) $data['ubicacion']['provincia']),
                    'codigo_postal' => isset($data['ubicacion']['codigo_postal']) && $data['ubicacion']['codigo_postal'] !== ''
                        ? trim((string) $data['ubicacion']['codigo_postal'])
                        : null,
                    'pais' => isset($data['ubicacion']['pais']) && $data['ubicacion']['pais'] !== ''
                        ? trim((string) $data['ubicacion']['pais'])
                        : 'España',
                    'descripcion' => isset($data['ubicacion']['descripcion']) && $data['ubicacion']['descripcion'] !== ''
                        ? trim((string) $data['ubicacion']['descripcion'])
                        : null,
                ]
            ]
        ];
    }
}