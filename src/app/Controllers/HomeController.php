<?php
declare(strict_types=1);

class HomeController
{
    // GET /
    public function index(): void
    {
        // Lo típico: o enseñas landing o rediriges a /mascotas
        header('Location: /mascotas');
        exit;
    }
}
