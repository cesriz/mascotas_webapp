<?php
return [
    ['GET',  '/',              'HomeController@index'],

    ['GET',  '/cases',         'CaseController@index'],
    ['GET',  '/cases/create',  'CaseController@create'],
    ['POST', '/cases',         'CaseController@store'],

    // Ruta con parámetro (id)
    ['GET',  '/cases/{id}',    'CaseController@show'],
];