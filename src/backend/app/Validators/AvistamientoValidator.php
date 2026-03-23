<?php
declare(strict_types=1);

class AvistamientoValidator
{
    // Valida y normaliza los datos del alta de un avistamiento
    public static function validateStore(array $data): array
    {
        $errors = [];

        // Teléfono obligatorio
        if (empty($data['telefono'])) {
            $errors[] = 'telefono es obligatorio';
        }

        // Fecha obligatoria
        if (empty($data['fecha_avistamiento'])) {
            $errors[] = 'fecha_avistamiento es obligatoria';
        }

        // Hora obligatoria
        if (empty($data['hora_avistamiento'])) {
            $errors[] = 'hora_avistamiento es obligatoria';
        }

        // Ubicación obligatoria
        if (empty($data['ubicacion']) || !is_array($data['ubicacion'])) {
            $errors[] = 'ubicacion es obligatoria';
        } else {
            $ubicacion = $data['ubicacion'];

            // Coordenadas obligatorias
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

            // Datos administrativos obligatorios
            if (empty($ubicacion['municipio'])) {
                $errors[] = 'ubicacion.municipio es obligatorio';
            }

            if (empty($ubicacion['provincia'])) {
                $errors[] = 'ubicacion.provincia es obligatoria';
            }
        }

        // Si hay errores, devolverlos
        if (!empty($errors)) {
            return [
                'errors' => $errors,
                'data' => []
            ];
        }

        // Datos limpios
        return [
            'errors' => [],
            'data' => [
                // Más adelante vendrá del usuario autenticado si existe
                'usuarios_id' => $data['usuarios_id'] ?? null,

                'telefono' => trim((string) $data['telefono']),

                'email' => isset($data['email']) && $data['email'] !== ''
                    ? trim((string) $data['email'])
                    : null,

                'descripcion' => isset($data['descripcion']) && $data['descripcion'] !== ''
                    ? trim((string) $data['descripcion'])
                    : null,

                'fecha_avistamiento' => $data['fecha_avistamiento'],
                'hora_avistamiento' => $data['hora_avistamiento'],

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