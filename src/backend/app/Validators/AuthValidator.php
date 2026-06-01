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

    public static function validateForgotPassword(array $data): array
    {
        $errors = [];

        // Recogemos el correo enviado por JSON
        $correo = isset($data['correo']) ? trim((string) $data['correo']) : '';

        if ($correo === '') {
            $errors[] = 'correo es obligatorio';
        } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'correo no válido';
        }

        return [
            'errors' => $errors,
            'data' => [
                'correo' => $correo
            ]
        ];
    }

    public static function validateResetPassword(array $data): array
    {
        $errors = [];

        $token = isset($data['token']) ? trim((string) $data['token']) : '';
        $password = isset($data['password']) ? (string) $data['password'] : '';
        $passwordConfirm = isset($data['password_confirm']) ? (string) $data['password_confirm'] : '';

        if ($token === '') {
            $errors[] = 'token es obligatorio';
        }

        if ($password === '') {
            $errors[] = 'password es obligatoria';
        } elseif (strlen($password) < 6) {
            $errors[] = 'password debe tener al menos 6 caracteres';
        }

        if ($passwordConfirm === '') {
            $errors[] = 'password_confirm es obligatoria';
        } elseif ($password !== $passwordConfirm) {
            $errors[] = 'password y password_confirm no coinciden';
        }

        return [
            'errors' => $errors,
            'data' => [
                'token' => $token,
                'password' => $password
            ]
        ];
    }
}
