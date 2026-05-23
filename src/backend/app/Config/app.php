<?php

return [
    // Nombre de la aplicación
    'name' => getenv('APP_NAME') ?: 'Mascotas Perdidas WebApp',

    // Entorno de ejecución
    // local | production
    'env' => getenv('APP_ENV') ?: 'local',

    // Mostrar errores (true en desarrollo)
    'debug' => filter_var(getenv('APP_DEBUG') ?: true, FILTER_VALIDATE_BOOLEAN),

    // Zona horaria
    'timezone' => getenv('APP_TIMEZONE') ?: 'Europe/Madrid',

    // URL base de la aplicación
    'base_url' => getenv('APP_URL') ?: 'http://localhost:3000',

    // URL base del frontend.
    // Aquí mandaremos al usuario cuando pulse el enlace de recuperar contraseña. REVISAR!!
    'frontend_url' => getenv('FRONTEND_URL') ?: getenv('APP_URL') ?: 'http://localhost:4200',

    // Correo que aparecerá como remitente. REVISAR !!
    'mail_from' => getenv('MAIL_FROM') ?: 'no-reply@mascotas-webapp.local',
];
