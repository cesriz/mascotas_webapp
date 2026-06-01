<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class AuthModel extends BaseModel
{
    // Busca un usuario por correo para login.
    public function findByEmail(string $correo): ?array
    {
        $sql = "
            SELECT
                id,
                nombre,
                apellidos,
                correo,
                telefono,
                direccion,
                fecha_registro,
                rol,
                password_hash,
                token,
                email_verificado,
                activo
            FROM usuarios
            WHERE correo = :correo
            LIMIT 1
        ";

        return $this->fetchOne($sql, [
            'correo' => $correo
        ]);
    }

    // Busca un usuario por id con todos los campos necesarios para auth.
    public function findAuthUserById(int $id): ?array
    {
        $sql = "
            SELECT
                id,
                nombre,
                apellidos,
                correo,
                telefono,
                direccion,
                fecha_registro,
                rol,
                password_hash,
                token,
                email_verificado,
                activo
            FROM usuarios
            WHERE id = :id
            LIMIT 1
        ";

        return $this->fetchOne($sql, [
            'id' => $id
        ]);
    }

    // Guarda o limpia el token actual del usuario.
    public function updateToken(int $usuarioId, ?string $token): bool
    {
        $sql = "
            UPDATE usuarios
            SET token = :token
            WHERE id = :id
        ";

        return $this->executeQuery($sql, [
            'id' => $usuarioId,
            'token' => $token
        ]);
    }

    // Guarda un token para recuperar contraseña
    public function createPasswordReset(int $usuarioId, string $tokenHash, string $expiresAt): bool
    {
        $sql = "
        INSERT INTO password_resets (usuario_id, token, expires_at, usado)
        VALUES (:usuario_id, :token, :expires_at, 0)
    ";

        return $this->executeQuery($sql, [
            'usuario_id' => $usuarioId,
            'token' => $tokenHash,
            'expires_at' => $expiresAt
        ]);
    }

    // Busca un token válido
    public function findValidPasswordReset(string $tokenHash): ?array
    {
        $sql = "
        SELECT pr.*
        FROM password_resets pr
        INNER JOIN usuarios u ON u.id = pr.usuario_id
        WHERE pr.token = :token
          AND pr.usado = 0
          AND pr.expires_at >= NOW()
          AND u.activo = 1
        LIMIT 1
    ";

        return $this->fetchOne($sql, [
            'token' => $tokenHash
        ]);
    }

    // Marca el token como usado
    public function markPasswordResetAsUsed(int $passwordResetId): bool
    {
        $sql = "
        UPDATE password_resets
        SET usado = 1
        WHERE id = :id
    ";

        return $this->executeQuery($sql, [
            'id' => $passwordResetId
        ]);
    }

    // Cambia la contraseña del usuario
    public function updatePasswordAndClearSessionToken(int $usuarioId, string $newPassword): bool
    {
        $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);

        $sql = "
        UPDATE usuarios
        SET password_hash = :password_hash,
            token = NULL
        WHERE id = :id
    ";

        return $this->executeQuery($sql, [
            'id' => $usuarioId,
            'password_hash' => $passwordHash
        ]);
    }
}
