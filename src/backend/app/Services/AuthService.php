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

    public function forgotPassword(string $correo): array
    {
        // Buscamos usuario
        $usuario = $this->authModel->findByEmail($correo);

        // Si no existe o está inactivo
        if ($usuario === null || (int) $usuario['activo'] !== 1) {
            return [
                'reset_url' => null,
                'token' => null
            ];
        }

        // Crear token real
        $plainToken = bin2hex(random_bytes(32));

        // Hash para guardar en BD
        $tokenHash = hash('sha256', $plainToken);

        // Caduca en 1 hora
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

        // Guardar token en tabla
        $this->authModel->createPasswordReset(
            (int) $usuario['id'],
            $tokenHash,
            $expiresAt
        );

        // Crear URL
        $resetUrl = $this->buildResetUrl($plainToken);

        // TEMPORAL para pruebas:
        // devolvemos URL y token por JSON, no por correo
        return [
            'reset_url' => $resetUrl,
            'token' => $plainToken
        ];
    }

    public function resetPassword(string $plainToken, string $newPassword): bool
    {
        // Convertimos el token recibido al mismo hash que guardamos en BD
        $tokenHash = hash('sha256', $plainToken);

        // Buscamos si existe, no está usado y no ha caducado
        $reset = $this->authModel->findValidPasswordReset($tokenHash);

        if ($reset === null) {
            return false;
        }

        // Cambiamos contraseña
        $this->authModel->updatePasswordAndClearSessionToken(
            (int) $reset['usuario_id'],
            $newPassword
        );

        // Marcamos token como usado
        $this->authModel->markPasswordResetAsUsed((int) $reset['id']);

        return true;
    }

    private function buildResetUrl(string $plainToken): string
    {
        $config = require __DIR__ . '/../Config/app.php';

        $baseUrl = rtrim($config['frontend_url'] ?? 'http://localhost:4200', '/');

        return $baseUrl . '/reset-password?token=' . urlencode($plainToken);
    }

    private function sendPasswordResetEmail(string $correo, string $resetUrl): void
    {
        $config = require __DIR__ . '/../Config/app.php';

        $subject = 'Recuperar contraseña';

        $message = "Hola,\n\n"
            . "Has solicitado recuperar tu contraseña.\n"
            . "Pulsa este enlace para crear una nueva contraseña:\n"
            . $resetUrl . "\n\n"
            . "El enlace caduca en 1 hora.\n";

        $from = $config['mail_from'] ?? 'no-reply@localhost';

        // El @ evita que el proyecto reviente si mail() no está configurado en local
        @mail($correo, $subject, $message, 'From: ' . $from);
    }
}
