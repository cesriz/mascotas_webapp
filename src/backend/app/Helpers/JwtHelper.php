<?php

declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHelper
{
    // Solo para desarrollo local. En produccion debe venir de JWT_SECRET.
    private const DEFAULT_SECRET_KEY = 'local-development-jwt-secret-change-me';

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

        return JWT::encode($payload, self::getSecretKey(), self::ALGORITHM);
    }

    // Decodifica un token y devuelve su payload.
    public static function decodeToken(string $token): object
    {
        return JWT::decode($token, new Key(self::getSecretKey(), self::ALGORITHM));
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

    private static function getSecretKey(): string
    {
        $secret = getenv('JWT_SECRET');

        if ($secret !== false && trim($secret) !== '') {
            return $secret;
        }

        if ((getenv('APP_ENV') ?: 'local') === 'production') {
            throw new RuntimeException('JWT_SECRET no esta configurado');
        }

        return self::DEFAULT_SECRET_KEY;
    }
}
