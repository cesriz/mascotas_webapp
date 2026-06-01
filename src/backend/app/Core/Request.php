<?php

declare(strict_types=1);

class Request
{
    // Aquí se guarda el usuario autenticado de la petición actual.
    private static ?array $user = null;

    // Devuelve el body JSON como array.
    public static function json(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }

    // Devuelve un valor de POST o GET.
    public static function input(string $key, mixed $default = null): mixed
    {
        return $_POST[$key] ?? $_GET[$key] ?? $default;
    }

    // Devuelve un fichero subido.
    public static function file(string $key): ?array
    {
        if (isset($_FILES[$key])) return $_FILES[$key];
        if (isset($_FILES[$key . '[]'])) return $_FILES[$key . '[]'];
        return null;
    }

    // Comprueba si hay al menos un fichero válido.
    public static function hasFile(string $key): bool
    {
        $file = self::file($key);

            if (!$file || !isset($file['error'])) {
                return false;
            }

        if (is_array($file['error'])) {
            foreach ($file['error'] as $error) {
                if ($error === UPLOAD_ERR_OK) {
                    return true;
                }
            }

            return false;
        }

        return $file['error'] === UPLOAD_ERR_OK;
    }

    // Comprueba si la petición parece multipart/form-data.
    public static function isFormData(): bool
    {
        return !empty($_POST) || !empty($_FILES);
    }

    // Guarda el usuario autenticado actual.
    public static function setUser(array $user): void
    {
        self::$user = $user;
    }

    // Devuelve el usuario autenticado actual.
    public static function user(): ?array
    {
        return self::$user;
    }
}