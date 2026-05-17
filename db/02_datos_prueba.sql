-- =====================================
-- 02_datos_prueba.sql
-- Proyecto mascotas_webapp
-- =====================================

USE mascotas_webapp;

-- =========================================
-- ESPECIES
-- =========================================
INSERT INTO especies (nombre) VALUES
('Perro'),
('Gato');


-- =========================================
-- RAZAS
-- =========================================
-- Perros
INSERT INTO razas (especies_id, nombre) VALUES
(1, 'Desconocido Perro'),
(1, 'Mestizo'),
(1, 'Labrador'),
(1, 'Pastor Aleman'),
(1, 'Caniche'),
(1, 'Bulldog Frances');

-- Gatos
INSERT INTO razas (especies_id, nombre) VALUES
(2, 'Desconocido Gato'),
(2, 'Comun'),
(2, 'Siames'),
(2, 'Sphynx'),
(2, 'Persa'),
(2, 'Maine Coon');


-- =========================================
-- COLORES
-- =========================================
INSERT INTO colores (nombre) VALUES
('Negro'),
('Blanco'),
('Marron'),
('Gris'),
('Naranja'),
('Beige'),
('Tricolor'),
('Atigrado'),
('Canela');


-- =========================================
-- USUARIOS
-- =========================================
INSERT INTO usuarios (
    nombre,
    apellidos,
    correo,
    telefono,
    direccion,
    rol,
    password_hash,
    email_verificado,
    activo
) VALUES
(
    'Admin',
    'Sistema',
    'admin@proyectoanimales.com',
    '111222333',
    'Murcia',
    'ADMIN',
    '$2y$10$Q4dk6tGqsDTnZ619LREUweC6nMzO0SFfeMTCrHnx0pjUIZn7YCGK6', -- "123456"
    TRUE,
    TRUE
),
(
    'Laura',
    'Martinez Lopez',
    'laura@example.com',
    '600222333',
    'Murcia',
    'USUARIO',
    '$2y$12$PNsXbjGCi2mID1at7EbedO0hAXaAjBL59na.ili33u.F1nNkyCQKS',
    TRUE,
    TRUE
),
(
    'Carlos',
    'Perez Sanchez',
    'carlos@example.com',
    '600333444',
    'Molina de Segura',
    'USUARIO',
    '$2y$12$.Cy134CMtz/0FAljE47nuOwywC5O27KkC1KNE07yQlLMxVH2VSTo2',
    FALSE,
    TRUE
);


-- =========================================
-- UBICACIONES
-- =========================================
INSERT INTO ubicaciones (
    direccion_formateada,
    pais,
    municipio,
    provincia,
    descripcion,
    codigo_postal,
    latitud,
    longitud
) VALUES
(
    'Avenida Juan Carlos I, Murcia',
    'España',
    'Murcia',
    'Murcia',
    'Zona cercana a centro comercial',
    '30008',
    37.9925000,
    -1.1300000
),
(
    'Santiago y Zaraiche, Murcia',
    'España',
    'Murcia',
    'Murcia',
    'Barrio residencial',
    '30007',
    38.0001000,
    -1.1185000
),
(
    'Parque de la Seda, Murcia',
    'España',
    'Murcia',
    'Murcia',
    'Avistamiento junto al parque',
    '30009',
    37.9888000,
    -1.1423000
),
(
    'Molina de Segura centro',
    'España',
    'Molina de Segura',
    'Murcia',
    'Zona céntrica',
    '30500',
    38.0549000,
    -1.2106000
);


-- =========================================
-- ANUNCIOS DE MASCOTAS
-- =========================================
INSERT INTO anuncio_mascotas (
    usuario_id,
    nombre,
    raza_id,
    sexo,
    tiene_chip,
    tamano,
    peso,
    descripcion,
    fecha_nacimiento,
    fecha_perdida,
    fecha_encontrada,
    fecha_recuperada,
    estado,
    recompensa,
    ubicaciones_perdida_id
) VALUES
(
    2,
    'Toby',
    3,
    'MACHO',
    TRUE,
    'MEDIANO',
    24.50,
    'Perro muy sociable de color claro. Llevaba collar azul cuando se perdio.',
    '2021-05-10',
    '2026-03-18',
    NULL,
    NULL,
    'PERDIDA',
    100.00,
    2
),
(
    3,
    'Misu',
    8,
    'HEMBRA',
    FALSE,
    'PEQUENO',
    4.20,
    'Gata comun muy asustadiza, suele esconderse debajo de coches.',
    '2023-04-02',
    '2026-03-20',
    NULL,
    NULL,
    'PERDIDA',
    NULL,
    4
),
(
    2,
    'Nala',
    5,
    'HEMBRA',
    TRUE,
    'PEQUENO',
    7.80,
    'Perra caniche recuperada tras varios avisos vecinales.',
    '2022-08-15',
    '2026-03-01',
    '2026-03-02',
    '2026-03-03',
    'RECUPERADA',
    NULL,
    1
);


-- =========================================
-- MASCOTAS_COLORES
-- =========================================
INSERT INTO mascotas_colores (mascota_id, color_id) VALUES
(1, 2),
(1, 6),
(2, 1),
(2, 8),
(3, 2),
(3, 3);


-- =========================================
-- AVISTAMIENTOS
-- =========================================
INSERT INTO avistamientos (
    mascota_id,
    fecha_hora,
    ubicaciones_avistamientos_id,
    descripcion,
    telefono,
    correo,
    usuario_id
) VALUES
(
    1,
    '2026-03-19 19:30:00',
    3,
    'Vi un perro parecido corriendo cerca del parque. Parecia desorientado.',
    '600444555',
    'testigo1@example.com',
    NULL
),
(
    1,
    '2026-03-20 09:15:00',
    1,
    'Creo que era Toby, estaba cerca de una cafeteria.',
    '600333444',
    'carlos@example.com',
    3
),
(
    2,
    '2026-03-21 22:10:00',
    4,
    'Gata negra atigrada vista junto a unos contenedores.',
    '600555666',
    'testigo2@example.com',
    NULL
);


-- =========================================
-- FOTOS DE ANUNCIOS
-- =========================================
INSERT INTO fotos_anuncios (
    mascota_id,
    url,
    es_principal,
    orden
) VALUES
(
    1,
    'https://example.com/uploads/anuncios/toby_1.jpg',
    TRUE,
    1
),
(
    1,
    'https://example.com/uploads/anuncios/toby_2.jpg',
    FALSE,
    2
),
(
    2,
    'https://example.com/uploads/anuncios/misu_1.jpg',
    TRUE,
    1
),
(
    3,
    'https://example.com/uploads/anuncios/nala_1.jpg',
    TRUE,
    1
);


-- =========================================
-- FOTOS DE AVISTAMIENTOS
-- =========================================
INSERT INTO fotos_avistamientos (
    avistamiento_id,
    url,
    es_principal,
    orden
) VALUES
(
    1,
    'https://example.com/uploads/avistamientos/av_1_1.jpg',
    TRUE,
    1
),
(
    2,
    'https://example.com/uploads/avistamientos/av_2_1.jpg',
    TRUE,
    1
),
(
    3,
    'https://example.com/uploads/avistamientos/av_3_1.jpg',
    TRUE,
    1
);


-- =========================================
-- PASSWORD RESETS
-- =========================================
INSERT INTO password_resets (
    usuario_id,
    token,
    expires_at,
    usado
) VALUES
(
    2,
    'token_prueba_usuario_2_20260324',
    '2026-03-25 23:59:59',
    FALSE
);
