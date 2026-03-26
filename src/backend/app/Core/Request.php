<?php
declare(strict_types=1);

class Request
{
    public static function json(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }

    public static function input(string $key, mixed $default = null): mixed
    {
        return $_POST[$key] ?? $_GET[$key] ?? $default;
    }

    public static function file(string $key): ?array
    {
        return isset($_FILES[$key]) && is_array($_FILES[$key]) ? $_FILES[$key] : null;
    }

    public static function hasFile(string $key): bool
    {
        return isset($_FILES[$key]) && is_array($_FILES[$key]) && ($_FILES[$key]['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
    }
}

//Request sirve para leer lo que le llega al backend desde el frontend o desde Postman.