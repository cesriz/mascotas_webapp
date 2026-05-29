<?php

declare(strict_types=1);

require_once __DIR__ . '/../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService
{
    public function sendPasswordResetEmail(string $to, string $nombre, string $resetUrl): bool
    {
        $subject = 'Recuperación de contraseña - Mascotas WebApp';

        $htmlBody = $this->buildPasswordResetHtml($nombre, $resetUrl);
        $plainBody = $this->buildPasswordResetText($nombre, $resetUrl);

        return $this->send($to, $subject, $htmlBody, $plainBody);
    }

    private function send(string $to, string $subject, string $htmlBody, string $plainBody): bool
    {
        try {
            $apiKey = getenv('BREVO_API_KEY') ?: '';
            $fromAddress = getenv('MAIL_FROM_ADDRESS') ?: '';
            $fromName = getenv('MAIL_FROM_NAME') ?: 'Mascotas WebApp';

            error_log('[EMAIL API] Preparando envío por Brevo API');
            error_log('[EMAIL API] Destinatario: ' . $to);
            error_log('[EMAIL API] BREVO_API_KEY configurada: ' . ($apiKey !== '' ? 'SI' : 'NO'));
            error_log('[EMAIL API] MAIL_FROM_ADDRESS configurado: ' . ($fromAddress !== '' ? 'SI' : 'NO'));

            if ($apiKey === '' || $fromAddress === '') {
                error_log('[EMAIL API ERROR] Falta BREVO_API_KEY o MAIL_FROM_ADDRESS.');
                return false;
            }

            $payload = [
                'sender' => [
                    'name' => $fromName,
                    'email' => $fromAddress
                ],
                'to' => [
                    [
                        'email' => $to
                    ]
                ],
                'subject' => $subject,
                'htmlContent' => $htmlBody,
                'textContent' => $plainBody
            ];

            $jsonPayload = json_encode($payload, JSON_UNESCAPED_UNICODE);

            if ($jsonPayload === false) {
                error_log('[EMAIL API ERROR] No se pudo convertir el payload a JSON.');
                return false;
            }

            $context = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' =>
                    "accept: application/json\r\n" .
                        "api-key: {$apiKey}\r\n" .
                        "content-type: application/json\r\n",
                    'content' => $jsonPayload,
                    'timeout' => 15,
                    'ignore_errors' => true
                ]
            ]);

            error_log('[EMAIL API] Enviando petición HTTPS a Brevo...');

            $response = @file_get_contents(
                'https://api.brevo.com/v3/smtp/email',
                false,
                $context
            );

            $statusLine = $http_response_header[0] ?? '';
            error_log('[EMAIL API] Status Brevo: ' . $statusLine);
            error_log('[EMAIL API] Respuesta Brevo: ' . ($response ?: 'sin respuesta'));

            if ($response === false) {
                error_log('[EMAIL API ERROR] No se pudo conectar con Brevo API.');
                return false;
            }

            if (!preg_match('/HTTP\/\S+\s+(\d+)/', $statusLine, $matches)) {
                error_log('[EMAIL API ERROR] No se pudo leer el código HTTP de Brevo.');
                return false;
            }

            $statusCode = (int) $matches[1];

            if ($statusCode < 200 || $statusCode >= 300) {
                error_log('[EMAIL API ERROR] Brevo devolvió código HTTP: ' . $statusCode);
                return false;
            }

            error_log('[EMAIL API] Correo enviado correctamente por Brevo API.');

            return true;
        } catch (\Throwable $e) {
            error_log('[EMAIL API ERROR] Excepción general: ' . $e->getMessage());
            return false;
        }
    }

    private function buildPasswordResetHtml(string $nombre, string $resetUrl): string
    {
        $safeName = htmlspecialchars($nombre !== '' ? $nombre : 'usuario', ENT_QUOTES, 'UTF-8');
        $safeUrl = htmlspecialchars($resetUrl, ENT_QUOTES, 'UTF-8');

        return "
            <h2>Recuperación de contraseña</h2>
            <p>Hola {$safeName},</p>
            <p>Has solicitado restablecer tu contraseña en Mascotas WebApp.</p>
            <p>
                <a href=\"{$safeUrl}\"
                   style=\"display:inline-block;padding:10px 16px;background:#2f855a;color:#ffffff;text-decoration:none;border-radius:6px;\">
                   Restablecer contraseña
                </a>
            </p>
            <p>Este enlace caduca en 1 hora.</p>
            <p>Si no has solicitado este cambio, puedes ignorar este correo.</p>
        ";
    }

    private function buildPasswordResetText(string $nombre, string $resetUrl): string
    {
        $nombre = $nombre !== '' ? $nombre : 'usuario';

        return "Hola {$nombre},\n\n"
            . "Has solicitado restablecer tu contraseña en Mascotas WebApp.\n\n"
            . "Pulsa este enlace para crear una nueva contraseña:\n"
            . $resetUrl . "\n\n"
            . "Este enlace caduca en 1 hora.\n\n"
            . "Si no has solicitado este cambio, puedes ignorar este correo.\n";
    }
}
