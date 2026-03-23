<?php

class Response
{
    public static function json(array $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
}


// Response sirve para devolver la salida al cliente.


/**
En vez de poner en cada controlador:

    header('Content-Type: application/json');
    echo json_encode($resultado);
    exit;

pones:

    Response::json($resultado, 200);

Mucho más limpio.
 */