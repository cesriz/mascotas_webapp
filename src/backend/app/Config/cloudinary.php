<?php
declare(strict_types=1);

return [
    'cloud_name' => getenv('CLOUDINARY_CLOUD_NAME'),
    'api_key' => getenv('CLOUDINARY_API_KEY'),
    'api_secret' => getenv('CLOUDINARY_API_SECRET'),
    'folder' => getenv('CLOUDINARY_FOLDER') ?: 'mascotas_webapp',
];