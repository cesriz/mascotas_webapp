<?php

declare(strict_types=1);

/**
 * Validador de autenticación.
 *
 * Se encarga de validar y limpiar los datos de entrada del login
 * antes de que el controlador llame al servicio.
 */
class AuthValidator
{
    /**
     * Valida los datos del login.
     *
     * Reglas:
     * - correo obligatorio y con formato válido
     * - password obligatoria
     *
     * Devuelve:
     * - errors: array de errores
     * - data: datos ya limpios para usar en el servicio
     */
    public static function validateLogin(array $data): array
    {
        $errors = [];

        $correo = isset($data['correo']) ? trim((string) $data['correo']) : '';
        $password = isset($data['password']) ? (string) $data['password'] : '';

        if ($correo === '') {
            $errors[] = 'correo es obligatorio';
        } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'correo no válido';
        }

        if ($password === '') {
            $errors[] = 'password es obligatoria';
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
                'correo' => $correo,
                'password' => $password
            ]
        ];
    }
}