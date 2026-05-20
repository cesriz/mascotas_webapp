<?php
declare(strict_types=1);

use Cloudinary\Cloudinary;

// Helper encargado de validar, subir y eliminar imágenes en Cloudinary.
class FileHelper
{
    // Tamaño máximo permitido por imagen (5 MB).
    private const MAX_FILE_SIZE = 5 * 1024 * 1024;

    // Tipos MIME permitidos para evitar subir archivos no válidos.
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    // Normaliza $_FILES para trabajar igual con una o varias imágenes.
    public static function normalizeUploadedFiles(array $files): array
    {
        $normalized = [];

        if (!isset($files['name'])) {
            return $normalized;
        }

        // Caso de una sola imagen.
        if (!is_array($files['name'])) {
            return [$files];
        }

        $count = count($files['name']);

        // Convierte el formato raro de $_FILES en un array más cómodo.
        for ($i = 0; $i < $count; $i++) {
            $normalized[] = [
                'name' => $files['name'][$i],
                'type' => $files['type'][$i],
                'tmp_name' => $files['tmp_name'][$i],
                'error' => $files['error'][$i],
                'size' => $files['size'][$i],
            ];
        }

        return $normalized;
    }

    // Crea y devuelve una instancia configurada de Cloudinary.
    private static function getCloudinary(): Cloudinary
    {
        $config = require __DIR__ . '/../Config/cloudinary.php';

        return new Cloudinary([
            'cloud' => [
                'cloud_name' => $config['cloud_name'],
                'api_key' => $config['api_key'],
                'api_secret' => $config['api_secret'],
            ],
            'url' => [
                'secure' => true,
            ],
        ]);
    }

    // Valida las imágenes recibidas, las sube a Cloudinary
    // y devuelve los datos necesarios para guardar en BD.
    public static function saveImages(array $files, string $subfolder): array
    {
        $saved = [];
        $normalizedFiles = self::normalizeUploadedFiles($files);

        if (empty($normalizedFiles)) {
            return [];
        }

        $config = require __DIR__ . '/../Config/cloudinary.php';
        $cloudinary = self::getCloudinary();

        // Carpeta final dentro de Cloudinary.
        $folder = trim($config['folder'], '/') . '/' . trim($subfolder, '/');

        // Detecta el MIME real del archivo, no solo la extensión.
        $finfo = finfo_open(FILEINFO_MIME_TYPE);

        foreach ($normalizedFiles as $index => $file) {

            // Ignora posiciones vacías.
            if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
                continue;
            }

            // Comprueba errores generales de subida.
            if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
                throw new RuntimeException('Error al subir una de las imágenes');
            }

            // Valida tamaño máximo.
            if (($file['size'] ?? 0) > self::MAX_FILE_SIZE) {
                throw new RuntimeException('Una de las imágenes supera el tamaño máximo de 5 MB');
            }

            // Valida formato real de imagen.
            $mimeType = finfo_file($finfo, $file['tmp_name']) ?: '';

            if (!array_key_exists($mimeType, self::ALLOWED_MIME_TYPES)) {
                throw new RuntimeException('Formato de imagen no permitido. Usa JPG, PNG o WEBP');
            }

            // Sube la imagen validada a Cloudinary.
            $result = $cloudinary->uploadApi()->upload($file['tmp_name'], [
                'folder' => $folder,
                'resource_type' => 'image',
            ]);

            // Datos que luego se guardan en la tabla de fotos.
            $saved[] = [
                'url' => $result['secure_url'],
                'public_id' => $result['public_id'],
                'es_principal' => $index === 0 ? 1 : 0,
                'orden' => $index,
            ];
        }

        finfo_close($finfo);

        return $saved;
    }

    // Elimina una imagen de Cloudinary a partir de su public_id.
    public static function destroyImage(?string $publicId): void
    {
        if (empty($publicId)) {
            return;
        }

        $cloudinary = self::getCloudinary();

        $cloudinary->uploadApi()->destroy($publicId, [
            'resource_type' => 'image',
        ]);
    }

    // Elimina varias imágenes de Cloudinary.
    // Espera arrays con una clave public_id.
    public static function destroyImages(array $photos): void
    {
        foreach ($photos as $photo) {
            self::destroyImage($photo['public_id'] ?? null);
        }
    }
}