<?php
declare(strict_types=1);

class PagesController
{
    // GET /about
    public function about(): void
    {
        require __DIR__ . '/../Views/pages/about.php';
    }

    // GET /contacto
    public function contacto(): void
    {
        require __DIR__ . '/../Views/pages/contacto.php';
    }

    // POST /contacto (si tienes formulario)
    public function enviarContacto(): void
    {
        // Validar email/mensaje y enviar/guardar

        header('Location: /contacto?enviado=1');
        exit;
    }
}
