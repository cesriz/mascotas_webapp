<?php
declare(strict_types=1);

class FileHelper
{
    private const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    private const ALLOWED_MIME_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    public static function normalizeUploadedFiles(array $files): array
    {
        $normalized = [];

        if (!isset($files['name'])) {
            return $normalized;
        }

        if (!is_array($files['name'])) {
            return [$files];
        }

        $count = count($files['name']);

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

    public static function saveImages(array $files, string $subfolder): array
    {
        $saved = [];
        $normalizedFiles = self::normalizeUploadedFiles($files);

        if (empty($normalizedFiles)) {
            return [];
        }

        $targetDir = __DIR__ . '/../../public/uploads/' . trim($subfolder, '/');

        if (!is_dir($targetDir) && !mkdir($targetDir, 0777, true) && !is_dir($targetDir)) {
            throw new RuntimeException('No se pudo crear la carpeta de subida');
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);

        foreach ($normalizedFiles as $index => $file) {
            if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
                continue;
            }

            if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
                throw new RuntimeException('Error al subir una de las imágenes');
            }

            if (($file['size'] ?? 0) > self::MAX_FILE_SIZE) {
                throw new RuntimeException('Una de las imágenes supera el tamaño máximo de 5 MB');
            }

            $mimeType = finfo_file($finfo, $file['tmp_name']) ?: '';
            if (!array_key_exists($mimeType, self::ALLOWED_MIME_TYPES)) {
                throw new RuntimeException('Formato de imagen no permitido. Usa JPG, PNG o WEBP');
            }

            $extension = self::ALLOWED_MIME_TYPES[$mimeType];
            $fileName = bin2hex(random_bytes(16)) . '.' . $extension;
            $targetPath = $targetDir . '/' . $fileName;

            if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
                throw new RuntimeException('No se pudo mover una de las imágenes');
            }

            $saved[] = [
                'url' => '/uploads/' . trim($subfolder, '/') . '/' . $fileName,
                'public_id' => null,
                'es_principal' => $index === 0 ? 1 : 0,
                'orden' => $index,
            ];
        }

        finfo_close($finfo);

        return $saved;
    }
}