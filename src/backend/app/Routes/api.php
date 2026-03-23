<?php

return [
    ['GET', '/api/mascotas', 'MascotaController@index'],
    ['GET', '/api/mascotas/{id}', 'MascotaController@show'],
    ['POST', '/api/mascotas', 'MascotaController@store'],

    ['GET', '/api/mascotas/{id}/avistamientos', 'AvistamientoController@index'],
    ['POST', '/api/mascotas/{id}/avistamientos', 'AvistamientoController@store'],

    ['GET', '/api/especies', 'EspecieController@index'],
    ['GET', '/api/razas', 'RazaController@index'],

     // Catálogo de colores
    ['GET', '/api/colores', 'ColorController@index'],
    ['GET', '/api/colores/{id}', 'ColorController@show'],
];

// Aquí se define qué URL llama a qué controlador y qué método.

// Por ejemplo: si entra GET /api/mascotas → llama a MascotaController@index

// Estas rutas son leidas por el Router (src/backend/app/Core/Router.php)

// El Router carga las rutas y decide qué ejecutar.