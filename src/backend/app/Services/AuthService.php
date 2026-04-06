<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/AuthModel.php';
require_once __DIR__ . '/../Helpers/JwtHelper.php';

class AuthService
{
    private AuthModel $authModel;

    public function __construct()
    {
        $this->authModel = new AuthModel();
    }

    // Login. Si la contraseña es correcta, genera y guarda un nuevo token.
    public function login(string $correo, string $password): ?array
    {
        $usuario = $this->authModel->findByEmail($correo);

        if ($usuario === null) {
            return null;
        }

        if ((int) $usuario['activo'] !== 1) {
            return null;
        }

        if (!password_verify($password, $usuario['password_hash'])) {
            return null;
        }

        $token = JwtHelper::generateToken($usuario);

        $this->authModel->updateToken((int) $usuario['id'], $token);

        return [
            'usuario' => [
                'id' => (int) $usuario['id'],
                'nombre' => $usuario['nombre'],
                'apellidos' => $usuario['apellidos'],
                'correo' => $usuario['correo'],
                'telefono' => $usuario['telefono'],
                'direccion' => $usuario['direccion'],
                'rol' => $usuario['rol']
            ],
            'token' => $token
        ];
    }

    // Valida el token actual.
    public function validateCurrentToken(): ?array
    {
        $token = JwtHelper::getBearerToken();

        if ($token === null) {
            return null;
        }

        try {
            $payload = JwtHelper::decodeToken($token);
        } catch (Throwable $e) {
            return null;
        }

        $usuarioId = (int) ($payload->data->id ?? 0);

        if ($usuarioId <= 0) {
            return null;
        }

        $usuario = $this->authModel->findAuthUserById($usuarioId);

        if ($usuario === null) {
            return null;
        }

        if ((int) $usuario['activo'] !== 1) {
            return null;
        }

        if (($usuario['token'] ?? null) !== $token) {
            return null;
        }

        return $usuario;
    }

    // Logout: deja el token del usuario a null.
    public function logout(int $usuarioId): bool
    {
        return $this->authModel->updateToken($usuarioId, null);
    }
}