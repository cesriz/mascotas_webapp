<?php

$databaseUrl = getenv('DATABASE_URL');

if ($databaseUrl) {
    $parts = parse_url($databaseUrl);

    if ($parts !== false) {
        return [
            'host' => $parts['host'] ?? 'db',
            'port' => isset($parts['port']) ? (int) $parts['port'] : 3306,
            'dbname' => isset($parts['path']) ? ltrim($parts['path'], '/') : 'mascotas_webapp',
            'user' => isset($parts['user']) ? urldecode($parts['user']) : 'root',
            'password' => isset($parts['pass']) ? urldecode($parts['pass']) : 'root',
            'charset' => getenv('DB_CHARSET') ?: 'utf8mb4',
            'collation' => getenv('DB_COLLATION') ?: 'utf8mb4_general_ci',
        ];
    }
}

return [
    'host' => getenv('MYSQLHOST') ?: getenv('DB_HOST') ?: 'db',
    'port' => (int) (getenv('MYSQLPORT') ?: getenv('DB_PORT') ?: 3306),
    'dbname' => getenv('MYSQLDATABASE') ?: getenv('DB_DATABASE') ?: 'mascotas_webapp',
    'user' => getenv('MYSQLUSER') ?: getenv('DB_USERNAME') ?: 'root',
    'password' => getenv('MYSQLPASSWORD') ?: getenv('DB_PASSWORD') ?: 'root',
    'charset' => getenv('DB_CHARSET') ?: 'utf8mb4',
    'collation' => getenv('DB_COLLATION') ?: 'utf8mb4_general_ci',
];
