<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseModel.php';

/**
 * Modelo encargado de la gestión administrativa:
 * moderación de anuncios y gestión de usuarios.
 */
class AdminModel extends BaseModel
{
    /**
     * Obtiene el listado de anuncios para moderación.
     */
    public function getAnunciosModeracion(): array
    {
        $sql = "
            SELECT
                am.id,
                am.nombre AS mascota,
                CONCAT(u.nombre, ' ', COALESCE(u.apellidos, '')) AS usuario,
                am.fecha_registro AS fecha,
                am.estado_publicacion AS estado
            FROM anuncio_mascotas am
            INNER JOIN usuarios u ON u.id = am.usuario_id
            ORDER BY am.fecha_registro DESC, am.id DESC
        ";

        return $this->fetchAll($sql);
    }

    /**
     * Cambia el estado de publicación de un anuncio.
     */
    public function changeEstadoPublicacionAnuncio(int $id, string $estado): bool
    {
        $sql = "
            UPDATE anuncio_mascotas
            SET estado_publicacion = :estado
            WHERE id = :id
        ";

        return $this->executeQuery($sql, [
            'id' => $id,
            'estado' => $estado
        ]);
    }

    /**
     * Elimina un anuncio por su ID.
     */
    public function deleteAnuncio(int $id): bool
    {
        $sql = "DELETE FROM anuncio_mascotas WHERE id = :id";

        return $this->executeQuery($sql, ['id' => $id]);
    }

    /**
     * Obtiene el listado de usuarios para administración.
     */
    public function getUsuariosGestion(): array
    {
        $sql = "
            SELECT
                u.id,
                CONCAT(u.nombre, ' ', COALESCE(u.apellidos, '')) AS usuario,
                u.correo,
                u.rol,
                u.activo,
                COUNT(am.id) AS anuncios
            FROM usuarios u
            LEFT JOIN anuncio_mascotas am ON am.usuario_id = u.id
            GROUP BY
                u.id, u.nombre, u.apellidos, u.correo, u.rol, u.activo
            ORDER BY u.id DESC
        ";

        return $this->fetchAll($sql);
    }

    /**
     * Activa o desactiva un usuario.
     */
    public function changeEstadoUsuario(int $id, int $activo): bool
    {
        $sql = "
            UPDATE usuarios
            SET activo = :activo
            WHERE id = :id
        ";

        return $this->executeQuery($sql, [
            'id' => $id,
            'activo' => $activo
        ]);
    }
}