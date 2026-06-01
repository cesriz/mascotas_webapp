<?php

return [

    // =========================
    // Autenticación
    // =========================
    ['POST', '/api/auth/login', 'AuthController@login'],
    ['GET', '/api/auth/me', 'AuthController@me', ['auth' => true]],
    ['POST', '/api/auth/logout', 'AuthController@logout', ['auth' => true]],

    // Recuperación de contraseña
    ['POST', '/api/auth/forgot-password', 'AuthController@forgotPassword'],
    ['POST', '/api/auth/reset-password', 'AuthController@resetPassword'],

    // =========================
    // Zona privada del usuario autenticado
    // =========================
    ['GET', '/api/me/perfil', 'MeController@perfil', ['auth' => true]],
    ['PUT', '/api/me/perfil', 'MeController@updatePerfil', ['auth' => true]],
    ['PATCH', '/api/me/password', 'MeController@cambiarPassword', ['auth' => true]],
    ['DELETE', '/api/me/cuenta', 'MeController@eliminarCuenta', ['auth' => true]],

    ['GET', '/api/me/mascotas', 'MeController@mascotas', ['auth' => true]],
    ['GET', '/api/me/avistamientos', 'MeController@avistamientos', ['auth' => true]],
    ['GET', '/api/me/notificaciones', 'MeController@notificaciones', ['auth' => true]],

    ['PATCH', '/api/me/notificaciones/contactos/{id}/leer', 'MeController@marcarContactoLeido', ['auth' => true]],
    ['PATCH', '/api/me/notificaciones/avistamientos/{id}/leer', 'MeController@marcarAvistamientoLeido', ['auth' => true]],

    // =========================
    // Mascotas públicas
    // =========================
    ['GET', '/api/mascotas', 'MascotaController@index'],
    ['GET', '/api/mascotas/recientes', 'MascotaController@recientes'],
    ['GET', '/api/mascotas/{id}', 'MascotaController@show'],

    // =========================
    // Mascotas privadas
    // =========================
    ['POST', '/api/mascotas', 'MascotaController@store', ['auth' => true]],
    ['PUT', '/api/mascotas/{id}', 'MascotaController@update', ['auth' => true]],
    ['POST', '/api/mascotas/{id}/fotos', 'MascotaController@uploadFotos', ['auth' => true]],
    ['DELETE', '/api/mascotas/fotos/{id}', 'MascotaController@deleteFoto', ['auth' => true]],
    ['DELETE', '/api/mascotas/{id}', 'MascotaController@destroy', ['auth' => true]],
    ['PATCH', '/api/mascotas/{id}/recuperar', 'MascotaController@marcarRecuperada', ['auth' => true]],

    // =========================
    // Avistamientos
    // =========================
    ['GET', '/api/mascotas/{id}/avistamientos', 'AvistamientoController@index'],
    ['POST', '/api/mascotas/{id}/avistamientos', 'AvistamientoController@store'],
    ['DELETE', '/api/avistamientos/{id}', 'AvistamientoController@destroy', ['auth' => true]],
    ['DELETE', '/api/avistamientos/fotos/{id}', 'AvistamientoController@deleteFoto', ['auth' => true]],

    // =========================
    // Contacto sobre un anuncio
    // =========================
    ['POST', '/api/mascotas/{id}/contactos', 'ContactoController@store'],

    // =========================
    // Reportes de anuncios
    // =========================
    ['POST', '/api/mascotas/{id}/reportes', 'ReporteController@store'],

    // =========================
    // Soporte general
    // =========================
    ['POST', '/api/soporte', 'SoporteController@store'],

    // =========================
    // Catálogos
    // =========================
    ['GET', '/api/colores', 'ColorController@index'],
    ['GET', '/api/colores/{id}', 'ColorController@show'],
    ['GET', '/api/especies', 'EspecieController@index'],
    ['GET', '/api/razas', 'RazaController@index'],
    ['GET', '/api/provincias', 'UbicacionController@provincias'],
    ['GET', '/api/municipios', 'UbicacionController@municipios'],

    // =========================
    // Usuarios
    // Solo registro público
    // =========================
    ['POST', '/api/usuarios', 'UsuarioController@store'],

    // =========================
    // Panel admin
    // =========================
    ['GET', '/api/admin/anuncios', 'AdminController@anuncios', ['auth' => true, 'admin' => true]],
    ['PATCH', '/api/admin/anuncios/{id}/estado', 'AdminController@cambiarEstadoAnuncio', ['auth' => true, 'admin' => true]],
    ['DELETE', '/api/admin/anuncios/{id}', 'AdminController@eliminarAnuncio', ['auth' => true, 'admin' => true]],

    ['GET', '/api/admin/reportes', 'AdminController@reportes', ['auth' => true, 'admin' => true]],
    ['PATCH', '/api/admin/reportes/{id}/estado', 'AdminController@cambiarEstadoReporte', ['auth' => true, 'admin' => true]],

    ['GET', '/api/admin/soporte', 'AdminController@soporte', ['auth' => true, 'admin' => true]],
    ['PATCH', '/api/admin/soporte/{id}/estado', 'AdminController@cambiarEstadoSoporte', ['auth' => true, 'admin' => true]],

    ['GET', '/api/admin/usuarios', 'AdminController@usuarios', ['auth' => true, 'admin' => true]],
    ['PATCH', '/api/admin/usuarios/{id}/estado', 'AdminController@cambiarEstadoUsuario', ['auth' => true, 'admin' => true]],
];
    

// Aquí se define qué URL llama a qué controlador y qué método.

// Por ejemplo: si entra GET /api/mascotas → llama a MascotaController@index

// Estas rutas son leidas por el Router (src/backend/app/Core/Router.php)

// El Router carga las rutas y decide qué ejecutar.