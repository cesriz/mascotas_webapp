<?php

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = getenv('CORS_ALLOWED_ORIGIN')
    ?: getenv('FRONTEND_URL')
    ?: getenv('APP_URL')
    ?: 'http://localhost:4200';

if ($allowedOrigin === '*') {
    header('Access-Control-Allow-Origin: *');
} elseif ($origin !== '' && rtrim($origin, '/') === rtrim($allowedOrigin, '/')) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
} else {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
}

header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Responder a preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
