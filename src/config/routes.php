<?php
/**
 * Rutas WEB de la aplicación
 * Formato:
 * [ METODO_HTTP, RUTA, Controlador@accion ]
 */

return [

    // =========================
    // HOME
    // =========================
    ['GET',  '/', 'HomeController@index'],

    // =========================
    // MASCOTAS (ANUNCIOS)
    // =========================

    // Listado (por defecto: perdidas)
    ['GET',  '/mascotas', 'MascotaController@index'],

    // Formulario publicar
    ['GET',  '/mascotas/crear', 'MascotaController@create'],

    // Guardar nueva mascota
    ['POST', '/mascotas', 'MascotaController@store'],

    // Ver detalle de una mascota
    ['GET',  '/mascotas/{id}', 'MascotaController@show'],

    // Editar mascota
    ['GET',  '/mascotas/{id}/editar', 'MascotaController@edit'],

    // Actualizar mascota
    ['POST', '/mascotas/{id}/actualizar', 'MascotaController@update'],

    // Cambiar estado (perdida / encontrada / cerrada)
    ['POST', '/mascotas/{id}/estado', 'MascotaController@actualizarEstado'],

    // Borrar anuncio (opcional)
    ['POST', '/mascotas/{id}/borrar', 'MascotaController@destroy'],


    // =========================
    // AVISTAMIENTOS
    // =========================

    // Listar avistamientos de una mascota (opcional)
    ['GET',  '/mascotas/{id}/avistamientos', 'AvistamientoController@index'],

    // Registrar un avistamiento
    ['POST', '/mascotas/{id}/avistamientos', 'AvistamientoController@store'],


    // =========================
    // AUTENTICACIÓN
    // =========================

    // Login
    ['GET',  '/login', 'AuthController@loginForm'],
    ['POST', '/login', 'AuthController@login'],

    // Logout
    ['POST', '/logout', 'AuthController@logout'],


    // =========================
    // PÁGINAS ESTÁTICAS
    // =========================

    ['GET', '/about',     'PagesController@about'],
    ['GET', '/contacto',  'PagesController@contacto'],
    ['POST','/contacto',  'PagesController@enviarContacto'],

];
