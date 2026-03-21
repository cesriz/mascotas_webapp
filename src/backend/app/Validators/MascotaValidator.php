<?php
declare(strict_types=1);

class MascotaValidator
{
    // Valida y normaliza los datos del alta
    public static function validateStore(array $data): array
    {
        $errors = [];

        // Campos obligatorios base
        if (empty($data['nombre'])) {
            $errors[] = 'nombre es obligatorio';
        }

        if (empty($data['razas_id'])) {
            $errors[] = 'razas_id es obligatorio';
        }

        if (empty($data['sexo'])) {
            $errors[] = 'sexo es obligatorio';
        }

        if (empty($data['tamano'])) {
            $errors[] = 'tamano es obligatorio';
        }

        if (empty($data['descripcion'])) {
            $errors[] = 'descripcion es obligatoria';
        }

        if (empty($data['estado'])) {
            $errors[] = 'estado es obligatorio';
        }

        // Colores obligatorios como array
        if (empty($data['colores']) || !is_array($data['colores'])) {
            $errors[] = 'colores es obligatorio y debe ser un array';
        } else {
            // Quitar vacíos
            $colores = array_filter(
                $data['colores'],
                fn($color) => $color !== null && $color !== ''
            );

            // Convertir a enteros
            $colores = array_map('intval', $colores);

            // Quitar ids no válidos (0 o negativos)
            $colores = array_filter(
                $colores,
                fn($color) => $color > 0
            );

            // Quitar duplicados y reindexar
            $colores = array_values(array_unique($colores));

            if (count($colores) < 1) {
                $errors[] = 'debe seleccionarse al menos un color válido';
            }

            if (count($colores) > 5) {
                $errors[] = 'no se pueden seleccionar más de 5 colores';
            }
        }

        // Estados permitidos
        $estadosValidos = ['perdido', 'encontrado', 'recuperado'];

        if (!empty($data['estado']) && !in_array($data['estado'], $estadosValidos, true)) {
            $errors[] = 'estado no válido';
        }

        // Fechas según estado
        $fechaPerdida = null;
        $fechaEncontrada = null;
        $fechaRecuperada = null;

        if (($data['estado'] ?? null) === 'perdido') {
            if (empty($data['fecha_perdida'])) {
                $errors[] = 'fecha_perdida es obligatoria si el estado es perdido';
            } else {
                $fechaPerdida = $data['fecha_perdida'];
            }
        }

        if (($data['estado'] ?? null) === 'encontrado') {
            if (empty($data['fecha_encontrada'])) {
                $errors[] = 'fecha_encontrada es obligatoria si el estado es encontrado';
            } else {
                $fechaEncontrada = $data['fecha_encontrada'];
            }
        }

        if (($data['estado'] ?? null) === 'recuperado') {
            if (empty($data['fecha_recuperada'])) {
                $errors[] = 'fecha_recuperada es obligatoria si el estado es recuperado';
            } else {
                $fechaRecuperada = $data['fecha_recuperada'];
            }
        }

        // Validar ubicación
        if (empty($data['ubicacion']) || !is_array($data['ubicacion'])) {
            $errors[] = 'ubicacion es obligatoria';
        } else {
            $ubicacion = $data['ubicacion'];

            // Coordenadas obligatorias (base real del sistema)
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

        // Normalizar colores
        $colores = array_filter(
            $data['colores'],
            fn($color) => $color !== null && $color !== ''
        );

        $colores = array_map('intval', $colores);

        $colores = array_filter(
            $colores,
            fn($color) => $color > 0
        );

        $colores = array_values(array_unique($colores));

        // Datos limpios
        return [
            'errors' => [],
            'data' => [
                'usuario_id' => null,
                'nombre' => trim((string) $data['nombre']),
                'razas_id' => (int) $data['razas_id'],
                'sexo' => trim((string) $data['sexo']),
                'tamano' => trim((string) $data['tamano']),
                'peso' => isset($data['peso']) && $data['peso'] !== ''
                    ? (float) $data['peso']
                    : null,
                'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
                'descripcion' => trim((string) $data['descripcion']),
                'fecha_perdida' => $fechaPerdida,
                'fecha_encontrada' => $fechaEncontrada,
                'fecha_recuperada' => $fechaRecuperada,
                'estado' => trim((string) $data['estado']),
                'recompensa' => isset($data['recompensa']) && $data['recompensa'] !== ''
                    ? (float) $data['recompensa']
                    : null,
                'colores' => $colores,

                // Ubicación adaptada a la nueva estructura
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