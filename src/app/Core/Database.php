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
        $config = require __DIR__ . '/../../config/database.php';

        // Construimos el DSN (cadena de conexión)
        $dsn = 'mysql:host=' . $config['host'] . ';dbname=' . $config['dbname'] . ';charset=' . $config['charset'];

        // Creamos la conexión PDO
        self::$pdo = new PDO($dsn,$config['user'],$config['password']);

        // Configuramos PDO para trabajar cómodo
        self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        // Devolvemos la conexión
        return self::$pdo;
    }
}

