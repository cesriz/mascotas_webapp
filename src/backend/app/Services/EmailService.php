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
        $mail = new PHPMailer(true);

        try {
            $host = getenv('MAIL_HOST') ?: 'smtp-relay.brevo.com';
            $port = (int) (getenv('MAIL_PORT') ?: 587);
            $username = getenv('MAIL_USERNAME') ?: '';
            $password = getenv('MAIL_PASSWORD') ?: '';
            $fromAddress = getenv('MAIL_FROM_ADDRESS') ?: '';
            $fromName = getenv('MAIL_FROM_NAME') ?: 'Mascotas WebApp';

            error_log('[EMAIL] Preparando envío de correo de recuperación');
            error_log('[EMAIL] Destinatario: ' . $to);
            error_log('[EMAIL] Host SMTP: ' . $host);
            error_log('[EMAIL] Puerto SMTP: ' . $port);
            error_log('[EMAIL] MAIL_USERNAME configurado: ' . ($username !== '' ? 'SI' : 'NO'));
            error_log('[EMAIL] MAIL_PASSWORD configurado: ' . ($password !== '' ? 'SI' : 'NO'));
            error_log('[EMAIL] MAIL_FROM_ADDRESS configurado: ' . ($fromAddress !== '' ? 'SI' : 'NO'));

            if ($username === '' || $password === '' || $fromAddress === '') {
                error_log('[EMAIL ERROR] Configuración SMTP incompleta.');
                return false;
            }

            $mail->CharSet = 'UTF-8';

            $mail->isSMTP();

            // Para que no se quede 2 minutos esperando si Brevo falla
            $mail->Timeout = 10;
            $mail->SMTPKeepAlive = false;

            // Logs detallados de PHPMailer/Brevo en Railway
            $mail->SMTPDebug = 2;
            $mail->Debugoutput = function ($str, $level) {
                error_log("[SMTP DEBUG nivel {$level}] {$str}");
            };

            $mail->Host = $host;
            $mail->SMTPAuth = true;
            $mail->Username = $username;
            $mail->Password = $password;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = $port;

            $mail->setFrom($fromAddress, $fromName);
            $mail->addAddress($to);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = $plainBody;

            error_log('[EMAIL] Intentando enviar correo...');

            $result = $mail->send();

            error_log('[EMAIL] Resultado envío: ' . ($result ? 'OK' : 'ERROR'));

            return $result;
        } catch (Exception $e) {
            error_log('[EMAIL ERROR] Excepción PHPMailer: ' . $e->getMessage());
            error_log('[EMAIL ERROR] ErrorInfo PHPMailer: ' . $mail->ErrorInfo);
            return false;
        } catch (\Throwable $e) {
            error_log('[EMAIL ERROR] Excepción general: ' . $e->getMessage());
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
