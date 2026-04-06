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
}