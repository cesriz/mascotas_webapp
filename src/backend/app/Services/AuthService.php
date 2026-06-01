<?php

declare(strict_types=1);

require_once __DIR__ . '/../Models/AuthModel.php';
require_once __DIR__ . '/../Helpers/JwtHelper.php';
require_once __DIR__ . '/EmailService.php';

class AuthService
{
    private AuthModel $authModel;
    private EmailService $emailService;

    public function __construct()
    {
        $this->authModel = new AuthModel();
        $this->emailService = new EmailService();
    }

    // Login. Si la contraseña es correcta, genera y guarda un nuevo token.
    public function login(string $correo, string $password): array
    {
        $usuario = $this->authModel->findByEmail($correo);

        if ($usuario === null) {
            return [
                'success' => false,
                'status' => 401,
                'message' => 'Credenciales no válidas'
            ];
        }

        if (!password_verify($password, $usuario['password_hash'])) {
            return [
                'success' => false,
                'status' => 401,
                'message' => 'Credenciales no válidas'
            ];
        }

        if ((int) $usuario['activo'] !== 1) {
            return [
                'success' => false,
                'status' => 403,
                'message' => 'Tu cuenta ha sido bloqueada. Contacta con un administrador si crees que es un error.'
            ];
        }

        $token = JwtHelper::generateToken($usuario);

        $this->authModel->updateToken((int) $usuario['id'], $token);

        return [
            'success' => true,
            'data' => [
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
            ]
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

    // Genera token de recuperación, lo guarda hasheado y envía email real.
    public function forgotPassword(string $correo): bool
    {
        $usuario = $this->authModel->findByEmail($correo);

        // No revelamos si el correo existe o no.
        if ($usuario === null || (int) $usuario['activo'] !== 1) {
            return true;
        }

        $plainToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $plainToken);
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $this->authModel->createPasswordReset(
            (int) $usuario['id'],
            $tokenHash,
            $expiresAt
        );

        $resetUrl = $this->buildResetUrl($plainToken);

        return $this->emailService->sendPasswordResetEmail(
            $usuario['correo'],
            $usuario['nombre'] ?? '',
            $resetUrl
        );
    }

    // Cambia la contraseña usando el token recibido desde el enlace del email.
    public function resetPassword(string $plainToken, string $newPassword): bool
    {
        $tokenHash = hash('sha256', $plainToken);

        $reset = $this->authModel->findValidPasswordReset($tokenHash);

        if ($reset === null) {
            return false;
        }

        $this->authModel->updatePasswordAndClearSessionToken(
            (int) $reset['usuario_id'],
            $newPassword
        );

        $this->authModel->markPasswordResetAsUsed((int) $reset['id']);

        return true;
    }

    private function buildResetUrl(string $plainToken): string
    {
        $baseUrl = getenv('FRONTEND_BASE_URL')
            ?: getenv('FRONTEND_URL')
            ?: getenv('APP_URL')
            ?: 'http://localhost:4200';

        $baseUrl = rtrim($baseUrl, '/');

        return $baseUrl . '/reset-password?token=' . urlencode($plainToken);
    }
}
