<?php

declare(strict_types=1);

// Validador encargado de revisar y normalizar datos de mascotas
// antes de que lleguen al modelo o a la base de datos.
class MascotaValidator
{
    // Valida los filtros recibidos en el listado público de mascotas.
    // También aplica valores por defecto para paginación y ordenación.
    public static function validateIndexFilters(array $data): array
    {
        $errors = [];

        // Valores permitidos para evitar filtros inválidos.
        $estadosValidos = ['PERDIDA', 'ENCONTRADA', 'RECUPERADA'];
        $sexosValidos = ['MACHO', 'HEMBRA', 'DESCONOCIDO'];
        $tamanosValidos = ['PEQUENO', 'MEDIANO', 'GRANDE', 'DESCONOCIDO'];
        $ordenesValidos = ['recientes', 'antiguos', 'nombre_asc', 'nombre_desc'];

        $estado = isset($data['estado']) && $data['estado'] !== ''
            ? trim((string) $data['estado'])
            : null;

        $especieId = isset($data['especie_id']) && $data['especie_id'] !== ''
            ? (int) $data['especie_id']
            : null;

        $razaId = isset($data['raza_id']) && $data['raza_id'] !== ''
            ? (int) $data['raza_id']
            : null;

        $sexo = isset($data['sexo']) && $data['sexo'] !== ''
            ? trim((string) $data['sexo'])
            : null;

        $tamano = isset($data['tamano']) && $data['tamano'] !== ''
            ? trim((string) $data['tamano'])
            : null;

        $municipio = isset($data['municipio']) && $data['municipio'] !== ''
            ? trim((string) $data['municipio'])
            : null;

        $provincia = isset($data['provincia']) && $data['provincia'] !== ''
            ? trim((string) $data['provincia'])
            : null;

        $qUbicacion = isset($data['q_ubicacion']) && $data['q_ubicacion'] !== ''
            ? trim((string) $data['q_ubicacion'])
            : null;

        $fechaDesde = isset($data['fecha_desde']) && $data['fecha_desde'] !== ''
            ? trim((string) $data['fecha_desde'])
            : null;

        $fechaHasta = isset($data['fecha_hasta']) && $data['fecha_hasta'] !== ''
            ? trim((string) $data['fecha_hasta'])
            : null;

        // Normaliza booleanos opcionales de filtros.
        $tieneChip = self::normalizeNullableBool($data['tiene_chip'] ?? null);
        $conFotos = self::normalizeNullableBool($data['con_fotos'] ?? null);

        $orden = isset($data['orden']) && $data['orden'] !== ''
            ? trim((string) $data['orden'])
            : 'recientes';

        $page = isset($data['page']) && $data['page'] !== ''
            ? (int) $data['page']
            : 1;

        $limit = isset($data['limit']) && $data['limit'] !== ''
            ? (int) $data['limit']
            : 12;

        // Permite filtrar por uno o varios colores.
        $colorIds = self::normalizeColorIds($data['color_ids'] ?? null);

        // Validaciones de filtros.
        if ($estado !== null && !in_array($estado, $estadosValidos, true)) {
            $errors[] = 'estado no válido';
        }

        if ($sexo !== null && !in_array($sexo, $sexosValidos, true)) {
            $errors[] = 'sexo no válido';
        }

        if ($tamano !== null && !in_array($tamano, $tamanosValidos, true)) {
            $errors[] = 'tamano no válido';
        }

        if ($especieId !== null && $especieId <= 0) {
            $errors[] = 'especie_id no válido';
        }

        if ($razaId !== null && $razaId <= 0) {
            $errors[] = 'raza_id no válido';
        }

        if ($fechaDesde !== null && !self::isValidDate($fechaDesde)) {
            $errors[] = 'fecha_desde no tiene un formato válido';
        }

        if ($fechaHasta !== null && !self::isValidDate($fechaHasta)) {
            $errors[] = 'fecha_hasta no tiene un formato válido';
        }

        if ($fechaDesde !== null && $fechaHasta !== null && $fechaDesde > $fechaHasta) {
            $errors[] = 'fecha_desde no puede ser mayor que fecha_hasta';
        }

        if (!in_array($orden, $ordenesValidos, true)) {
            $errors[] = 'orden no válido';
        }

        if ($page <= 0) {
            $errors[] = 'page debe ser mayor que 0';
        }

        if ($limit <= 0) {
            $errors[] = 'limit debe ser mayor que 0';
        }

        // Límite máximo para evitar consultas demasiado grandes.
        if ($limit > 50) {
            $limit = 50;
        }

        if (!empty($errors)) {
            return [
                'errors' => $errors,
                'data' => []
            ];
        }

        // Devuelve filtros ya limpios y normalizados.
        return [
            'errors' => [],
            'data' => [
                'estado' => $estado,
                'especie_id' => $especieId,
                'raza_id' => $razaId,
                'sexo' => $sexo,
                'tamano' => $tamano,
                'municipio' => $municipio,
                'provincia' => $provincia,
                'q_ubicacion' => $qUbicacion,
                'fecha_desde' => $fechaDesde,
                'fecha_hasta' => $fechaHasta,
                'color_ids' => $colorIds,
                'tiene_chip' => $tieneChip,
                'con_fotos' => $conFotos,
                'orden' => $orden,
                'page' => $page,
                'limit' => $limit
            ]
        ];
    }

    // Valida los datos necesarios para crear una mascota/anuncio.
    // También normaliza campos como colores, booleanos, fechas y ubicación.
    public static function validateStore(array $data): array
    {
        $errors = [];

        // Si solo llega un color, lo convierte en array para tratarlo igual.
        if (isset($data['colores']) && !is_array($data['colores'])) {
            $data['colores'] = [$data['colores']];
        }

        // Campos obligatorios principales.
        if (empty($data['nombre'])) {
            $errors[] = 'nombre es obligatorio';
        }

        if (empty($data['raza_id'])) {
            $errors[] = 'raza_id es obligatorio';
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

        // Normaliza y valida los colores asociados a la mascota.
        if (empty($data['colores']) || !is_array($data['colores'])) {
            $errors[] = 'colores es obligatorio y debe ser un array';
        } else {
            $colores = array_filter(
                $data['colores'],
                fn($color) => $color !== null && $color !== ''
            );

            $colores = array_map('intval', $colores);
            $colores = array_filter($colores, fn($color) => $color > 0);
            $colores = array_values(array_unique($colores));

            if (count($colores) < 1) {
                $errors[] = 'debe seleccionarse al menos un color válido';
            }

            if (count($colores) > 5) {
                $errors[] = 'no se pueden seleccionar más de 5 colores';
            }
        }

        $estadosValidos = ['PERDIDA', 'ENCONTRADA', 'RECUPERADA'];
        $sexosValidos = ['MACHO', 'HEMBRA', 'DESCONOCIDO'];
        $tamanosValidos = ['PEQUENO', 'MEDIANO', 'GRANDE', 'DESCONOCIDO'];

        // Valida que los campos tipo catálogo usen valores permitidos.
        if (!empty($data['estado']) && !in_array($data['estado'], $estadosValidos, true)) {
            $errors[] = 'estado no válido';
        }

        if (!empty($data['sexo']) && !in_array($data['sexo'], $sexosValidos, true)) {
            $errors[] = 'sexo no válido';
        }

        if (!empty($data['tamano']) && !in_array($data['tamano'], $tamanosValidos, true)) {
            $errors[] = 'tamano no válido';
        }

        $fechaPerdida = null;
        $fechaEncontrada = null;
        $fechaRecuperada = null;

        // Cada estado requiere su fecha correspondiente.
        if (($data['estado'] ?? null) === 'PERDIDA') {
            if (empty($data['fecha_perdida'])) {
                $errors[] = 'fecha_perdida es obligatoria si el estado es PERDIDA';
            } else {
                $fechaPerdida = $data['fecha_perdida'];
            }
        }

        if (($data['estado'] ?? null) === 'ENCONTRADA') {
            if (empty($data['fecha_encontrada'])) {
                $errors[] = 'fecha_encontrada es obligatoria si el estado es ENCONTRADA';
            } else {
                $fechaEncontrada = $data['fecha_encontrada'];
            }
        }

        if (($data['estado'] ?? null) === 'RECUPERADA') {
            if (empty($data['fecha_recuperada'])) {
                $errors[] = 'fecha_recuperada es obligatoria si el estado es RECUPERADA';
            } else {
                $fechaRecuperada = $data['fecha_recuperada'];
            }
        }

        // La ubicación es obligatoria para situar el anuncio en el mapa/listado.
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

        // Normaliza colores una vez validado todo.
        $colores = array_filter(
            $data['colores'],
            fn($color) => $color !== null && $color !== ''
        );

        $colores = array_map('intval', $colores);
        $colores = array_filter($colores, fn($color) => $color > 0);
        $colores = array_values(array_unique($colores));

        // Devuelve los datos finales listos para service/model.
        return [
            'errors' => [],
            'data' => [
                'usuario_id' => isset($data['usuario_id']) && (int) $data['usuario_id'] > 0
                    ? (int) $data['usuario_id']
                    : null,
                'nombre' => trim((string) $data['nombre']),
                'raza_id' => (int) $data['raza_id'],
                'sexo' => trim((string) $data['sexo']),
                'tiene_chip' => in_array(
                    (string) ($data['tiene_chip'] ?? ''),
                    ['1', 'true', 'on', 'si', 'SI'],
                    true
                ) ? 1 : 0,
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

    // Reutiliza la validación de creación para actualizar mascotas.
    public static function validateUpdate(array $data): array
    {
        return self::validateStore($data);
    }

    // Convierte color_ids en un array limpio de IDs enteros únicos.
    private static function normalizeColorIds(mixed $value): array
    {
        if ($value === null || $value === '') {
            return [];
        }

        if (!is_array($value)) {
            $value = explode(',', (string) $value);
        }

        $value = array_map('trim', $value);
        $value = array_filter($value, fn($item) => $item !== '');
        $value = array_map('intval', $value);
        $value = array_filter($value, fn($item) => $item > 0);

        return array_values(array_unique($value));
    }

    // Convierte distintos formatos de booleano a 1, 0 o null.
    private static function normalizeNullableBool(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        $value = mb_strtolower(trim((string) $value));

        if (in_array($value, ['1', 'true', 'si', 'sí', 'on'], true)) {
            return 1;
        }

        if (in_array($value, ['0', 'false', 'no', 'off'], true)) {
            return 0;
        }

        return null;
    }

    // Comprueba si una fecha tiene formato válido YYYY-MM-DD.
    private static function isValidDate(string $date): bool
    {
        $parsed = DateTime::createFromFormat('Y-m-d', $date);

        return $parsed !== false && $parsed->format('Y-m-d') === $date;
    }
}