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

            if ($username === '' || $password === '' || $fromAddress === '') {
                error_log('Configuración SMTP incompleta.');
                return false;
            }

            $mail->CharSet = 'UTF-8';

            $mail->isSMTP();
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

            return $mail->send();
        } catch (Exception $e) {
            error_log('Error enviando email: ' . $mail->ErrorInfo);
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