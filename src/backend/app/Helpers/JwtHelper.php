<?php

declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHelper
{
    // Clave secreta para firmar el token.
    private const SECRET_KEY = 'mascotas_webapp_clave_super_secreta_2026_token_jwt_larga_y_segura_123456789';

    // Algoritmo usado para firmar.
    private const ALGORITHM = 'HS256';

    // Tiempo de vida del token en segundos.
    private const EXPIRATION_TIME = 60 * 60 * 24 * 7; // 7 días

    // Genera un JWT para un usuario.
    public static function generateToken(array $usuario): string
    {
        $issuedAt = time();
        $expiresAt = $issuedAt + self::EXPIRATION_TIME;

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expiresAt,
            'data' => [
                'id' => (int) $usuario['id'],
                'nombre' => $usuario['nombre'],
                'correo' => $usuario['correo'],
                'rol' => $usuario['rol']
            ]
        ];

        return JWT::encode($payload, self::SECRET_KEY, self::ALGORITHM);
    }

    // Decodifica un token y devuelve su payload.
    public static function decodeToken(string $token): object
    {
        return JWT::decode($token, new Key(self::SECRET_KEY, self::ALGORITHM));
    }

    // Intenta sacar el token del header Authorization.
    public static function getBearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;

        if ($header === null || trim($header) === '') {
            return null;
        }

        if (!preg_match('/Bearer\s+(.+)/i', $header, $matches)) {
            return null;
        }

        return trim($matches[1]);
    }
}