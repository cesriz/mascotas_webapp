<?php

class Request
{
    public static function json(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }
}

//Request sirve para leer lo que le llega al backend desde el frontend o desde Postman.