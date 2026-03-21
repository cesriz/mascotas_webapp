<?php

/**
 * Configuración de conexión a base de datos (ejemplo).
 *
 * Este archivo sirve como plantilla para que cada desarrollador
 * configure su propio entorno local sin exponer credenciales en el repositorio.
 *
 * Instrucciones:
 * 1. Copiar este archivo y renombrarlo a "database.php"
 * 2. Ajustar los valores según el entorno (Docker, local, etc.)
 *
 * Nota:
 * El archivo "database.php" está incluido en .gitignore para evitar
 * subir credenciales sensibles al repositorio.
 */

return [
    'host' => 'db',
    'dbname' => 'mascotas_webapp',
    'charset' => 'utf8mb4',
    'user' => 'root',
    'password' => 'root'
];