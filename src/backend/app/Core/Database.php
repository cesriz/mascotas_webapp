<?php

class Database
{
    // Aquí se guardará la conexión PDO (una sola para toda la app)
    private static $pdo = null;

    // Este método devuelve la conexión PDO
    public static function getConnection()
    {
        // Si ya existe una conexión, la devolvemos
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        // Cargamos la configuración de la BD
        $config = require __DIR__ . '/../Config/database.php';

        // Construimos el DSN (cadena de conexión)
        $dsn = 'mysql:host=' . $config['host']
            . ';port=' . ($config['port'] ?? 3306)
            . ';dbname=' . $config['dbname']
            . ';charset=' . $config['charset'];

        // Creamos la conexión PDO
        self::$pdo = new PDO($dsn, $config['user'], $config['password']);

        // Configuramos PDO para trabajar cómodo
        self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $appConfig = require __DIR__ . '/../Config/app.php';
        $timezone = $appConfig['timezone'] ?? 'Europe/Madrid';

        $offset = (new DateTimeImmutable('now', new DateTimeZone($timezone)))->format('P');

        self::$pdo->exec('SET time_zone = ' . self::$pdo->quote($offset));
        // Devolvemos la conexión
        return self::$pdo;
    }
}
