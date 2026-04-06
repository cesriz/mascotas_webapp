<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

class UsuarioModel extends BaseModel
{
    // Lista todos los usuarios.
    public function getAll(): array
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
                email_verificado,
                activo
            FROM usuarios
            ORDER BY id DESC
        ";

        return $this->fetchAll($sql);
    }

    // Devuelve un usuario por id.
    public function getById(int $id): ?array
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

    // Igual que getById, pensado para usarlo en /me/perfil.
    public function getPrivateById(int $id): ?array
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

    // Devuelve datos públicos del usuario.
    public function getPublicById(int $id): ?array
    {
        $sql = "
            SELECT
                id,
                nombre,
                apellidos,
                correo,
                telefono
            FROM usuarios
            WHERE id = :id
            LIMIT 1
        ";

        return $this->fetchOne($sql, [
            'id' => $id
        ]);
    }

    // Comprueba si un correo ya existe en otro usuario.
    public function existsEmailForOtherUser(string $correo, int $usuarioId): bool
    {
        $sql = "
            SELECT id
            FROM usuarios
            WHERE correo = :correo
              AND id <> :id
            LIMIT 1
        ";

        $result = $this->fetchOne($sql, [
            'correo' => $correo,
            'id' => $usuarioId
        ]);

        return $result !== null;
    }

    // Crea un usuario nuevo con contraseña hasheada.
    public function create(array $data): int
    {
        $password = isset($data['password']) ? (string) $data['password'] : '';
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $sql = "
            INSERT INTO usuarios (
                nombre,
                apellidos,
                correo,
                telefono,
                direccion,
                rol,
                password_hash,
                token,
                email_verificado,
                activo
            ) VALUES (
                :nombre,
                :apellidos,
                :correo,
                :telefono,
                :direccion,
                :rol,
                :password_hash,
                :token,
                :email_verificado,
                :activo
            )
        ";

        return $this->insertAndGetId($sql, [
            'nombre' => $data['nombre'],
            'apellidos' => $data['apellidos'] ?? null,
            'correo' => $data['correo'],
            'telefono' => $data['telefono'] ?? null,
            'direccion' => $data['direccion'] ?? null,
            'rol' => $data['rol'] ?? 'USUARIO',
            'password_hash' => $passwordHash,
            'token' => null,
            'email_verificado' => 0,
            'activo' => 1
        ]);
    }

    // Actualiza los datos editables del perfil.
    public function updateProfileById(int $id, array $data): bool
    {
        $sql = "
            UPDATE usuarios
            SET
                nombre = :nombre,
                apellidos = :apellidos,
                correo = :correo,
                telefono = :telefono,
                direccion = :direccion
            WHERE id = :id
        ";

        return $this->executeQuery($sql, [
            'id' => $id,
            'nombre' => $data['nombre'],
            'apellidos' => $data['apellidos'],
            'correo' => $data['correo'],
            'telefono' => $data['telefono'],
            'direccion' => $data['direccion']
        ]);
    }

    // Actualiza la contraseña guardando el hash nuevo.
    public function updatePasswordById(int $id, string $newPassword): bool
    {
        $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);

        $sql = "
            UPDATE usuarios
            SET password_hash = :password_hash
            WHERE id = :id
        ";

        return $this->executeQuery($sql, [
            'id' => $id,
            'password_hash' => $passwordHash
        ]);
    }

    // "Eliminar cuenta" de forma segura para este proyecto:
    // desactiva al usuario y limpia el token.
    public function deactivateAccountById(int $id): bool
    {
        $sql = "
            UPDATE usuarios
            SET
                activo = 0,
                token = NULL
            WHERE id = :id
        ";

        return $this->executeQuery($sql, [
            'id' => $id
        ]);
    }
}