<?php

declare(strict_types=1);

class UsuarioValidator
{
    // Valida el alta de usuario.
    public static function validateStore(array $data): array
    {
        $errors = [];

        $nombre = isset($data['nombre']) ? trim((string) $data['nombre']) : '';
        $apellidos = isset($data['apellidos']) ? trim((string) $data['apellidos']) : '';
        $correo = isset($data['correo']) ? trim((string) $data['correo']) : '';
        $telefono = isset($data['telefono']) ? trim((string) $data['telefono']) : '';
        $direccion = isset($data['direccion']) ? trim((string) $data['direccion']) : '';
        $password = isset($data['password']) ? (string) $data['password'] : '';

        if ($nombre === '') {
            $errors[] = 'nombre es obligatorio';
        }

        if ($correo === '') {
            $errors[] = 'correo es obligatorio';
        } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'correo no válido';
        }

        if ($password === '') {
            $errors[] = 'password es obligatoria';
        } elseif (strlen($password) < 6) {
            $errors[] = 'password debe tener al menos 6 caracteres';
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
                'nombre' => $nombre,
                'apellidos' => $apellidos !== '' ? $apellidos : null,
                'correo' => $correo,
                'telefono' => $telefono !== '' ? $telefono : null,
                'direccion' => $direccion !== '' ? $direccion : null,
                'password' => $password,
                'rol' => 'USUARIO'
            ]
        ];
    }

    // Valida la edición del perfil.
    public static function validateProfileUpdate(array $data): array
    {
        $errors = [];

        $nombre = isset($data['nombre']) ? trim((string) $data['nombre']) : '';
        $apellidos = isset($data['apellidos']) ? trim((string) $data['apellidos']) : '';
        $correo = isset($data['correo']) ? trim((string) $data['correo']) : '';
        $telefono = isset($data['telefono']) ? trim((string) $data['telefono']) : '';
        $direccion = isset($data['direccion']) ? trim((string) $data['direccion']) : '';

        if ($nombre === '') {
            $errors[] = 'nombre es obligatorio';
        }

        if ($correo === '') {
            $errors[] = 'correo es obligatorio';
        } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
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
                'nombre' => $nombre,
                'apellidos' => $apellidos !== '' ? $apellidos : null,
                'correo' => $correo,
                'telefono' => $telefono !== '' ? $telefono : null,
                'direccion' => $direccion !== '' ? $direccion : null,
            ]
        ];
    }

    // Valida el cambio de contraseña.
    public static function validatePasswordChange(array $data): array
    {
        $errors = [];

        $currentPassword = isset($data['current_password']) ? (string) $data['current_password'] : '';
        $newPassword = isset($data['new_password']) ? (string) $data['new_password'] : '';
        $newPasswordConfirm = isset($data['new_password_confirm']) ? (string) $data['new_password_confirm'] : '';

        if ($currentPassword === '') {
            $errors[] = 'current_password es obligatoria';
        }

        if ($newPassword === '') {
            $errors[] = 'new_password es obligatoria';
        }

        if (strlen($newPassword) > 0 && strlen($newPassword) < 6) {
            $errors[] = 'new_password debe tener al menos 6 caracteres';
        }

        if ($newPasswordConfirm === '') {
            $errors[] = 'new_password_confirm es obligatoria';
        }

        if ($newPassword !== '' && $newPasswordConfirm !== '' && $newPassword !== $newPasswordConfirm) {
            $errors[] = 'new_password y new_password_confirm no coinciden';
        }

        if ($currentPassword !== '' && $newPassword !== '' && $currentPassword === $newPassword) {
            $errors[] = 'la nueva contraseña no puede ser igual a la actual';
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
                'current_password' => $currentPassword,
                'new_password' => $newPassword
            ]
        ];
    }
}
