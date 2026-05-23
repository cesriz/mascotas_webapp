-- =====================================
-- 02_datos_prueba.sql
-- Proyecto mascotas_webapp
-- Datos de prueba unificados
-- =====================================

USE mascotas_webapp;

-- =========================================
-- ESPECIES
-- =========================================
INSERT INTO especies (nombre) VALUES
('Perro'),
('Gato');

SET @especie_perro = (SELECT id FROM especies WHERE nombre = 'Perro' LIMIT 1);
SET @especie_gato = (SELECT id FROM especies WHERE nombre = 'Gato' LIMIT 1);

-- =========================================
-- RAZAS
-- =========================================
INSERT INTO razas (especies_id, nombre) VALUES
(@especie_perro, 'Desconocido Perro'),
(@especie_perro, 'Mestizo'),
(@especie_perro, 'Labrador'),
(@especie_perro, 'Pastor Aleman'),
(@especie_perro, 'Caniche'),
(@especie_perro, 'Bulldog Frances'),
(@especie_gato, 'Desconocido Gato'),
(@especie_gato, 'Comun'),
(@especie_gato, 'Siames'),
(@especie_gato, 'Sphynx'),
(@especie_gato, 'Persa'),
(@especie_gato, 'Maine Coon');

SET @raza_mestizo_perro = (SELECT id FROM razas WHERE nombre = 'Mestizo' LIMIT 1);
SET @raza_labrador = (SELECT id FROM razas WHERE nombre = 'Labrador' LIMIT 1);
SET @raza_caniche = (SELECT id FROM razas WHERE nombre = 'Caniche' LIMIT 1);
SET @raza_bulldog = (SELECT id FROM razas WHERE nombre = 'Bulldog Frances' LIMIT 1);
SET @raza_gato_comun = (SELECT id FROM razas WHERE nombre = 'Comun' LIMIT 1);
SET @raza_siames = (SELECT id FROM razas WHERE nombre = 'Siames' LIMIT 1);
SET @raza_persa = (SELECT id FROM razas WHERE nombre = 'Persa' LIMIT 1);

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

SET @color_negro = (SELECT id FROM colores WHERE nombre = 'Negro' LIMIT 1);
SET @color_blanco = (SELECT id FROM colores WHERE nombre = 'Blanco' LIMIT 1);
SET @color_marron = (SELECT id FROM colores WHERE nombre = 'Marron' LIMIT 1);
SET @color_gris = (SELECT id FROM colores WHERE nombre = 'Gris' LIMIT 1);
SET @color_naranja = (SELECT id FROM colores WHERE nombre = 'Naranja' LIMIT 1);
SET @color_beige = (SELECT id FROM colores WHERE nombre = 'Beige' LIMIT 1);
SET @color_atigrado = (SELECT id FROM colores WHERE nombre = 'Atigrado' LIMIT 1);
SET @color_canela = (SELECT id FROM colores WHERE nombre = 'Canela' LIMIT 1);

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
('Admin', 'Sistema', 'admin@proyectoanimales.com', '111222333', 'Murcia', 'ADMIN', '$2y$10$Q4dk6tGqsDTnZ619LREUweC6nMzO0SFfeMTCrHnx0pjUIZn7YCGK6', TRUE, TRUE), -- Contraseña: "123456"
('Laura', 'Martinez Lopez', 'laura@example.com', '600222333', 'Murcia', 'USUARIO', '$2y$12$PNsXbjGCi2mID1at7EbedO0hAXaAjBL59na.ili33u.F1nNkyCQKS', TRUE, TRUE),
('Carlos', 'Perez Sanchez', 'carlos@example.com', '600333444', 'Molina de Segura', 'USUARIO', '$2y$12$.Cy134CMtz/0FAljE47nuOwywC5O27KkC1KNE07yQlLMxVH2VSTo2', FALSE, TRUE);

SET @usuario_admin = (SELECT id FROM usuarios WHERE correo = 'admin@proyectoanimales.com' LIMIT 1);
SET @usuario_laura = (SELECT id FROM usuarios WHERE correo = 'laura@example.com' LIMIT 1);
SET @usuario_carlos = (SELECT id FROM usuarios WHERE correo = 'carlos@example.com' LIMIT 1);

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
('Avenida Juan Carlos I, Murcia', 'Espana', 'Murcia', 'Murcia', 'Zona cercana a centro comercial', '30008', 37.9925000, -1.1300000),
('Santiago y Zaraiche, Murcia', 'Espana', 'Murcia', 'Murcia', 'Barrio residencial', '30007', 38.0001000, -1.1185000),
('Parque de la Seda, Murcia', 'Espana', 'Murcia', 'Murcia', 'Avistamiento junto al parque', '30009', 37.9888000, -1.1423000),
('Molina de Segura centro', 'Espana', 'Molina de Segura', 'Murcia', 'Zona centrica', '30500', 38.0549000, -1.2106000),
('Jardin de Floridablanca, Murcia', 'Espana', 'Murcia', 'Murcia', 'Zona donde se encontro una mascota sin identificacion visible', '30002', 37.9819000, -1.1309000),
('Plaza Circular, Murcia', 'Espana', 'Murcia', 'Murcia', 'Zona con mucho transito peatonal', '30008', 37.9921000, -1.1307000),
('Parque Regional El Valle, Murcia', 'Espana', 'Murcia', 'Murcia', 'Sendero cercano al area recreativa', '30150', 37.9343000, -1.1182000),
('Avenida de la Constitucion, Alcantarilla', 'Espana', 'Alcantarilla', 'Murcia', 'Cerca de comercios y parada de autobus', '30820', 37.9705000, -1.2188000),
('Puerto de Cartagena', 'Espana', 'Cartagena', 'Murcia', 'Zona portuaria cercana al paseo', '30201', 37.5992000, -0.9848000),
('Alameda de Cervantes, Lorca', 'Espana', 'Lorca', 'Murcia', 'Zona ajardinada junto al centro', '30800', 37.6712000, -1.6999000),
('Gran Via, Molina de Segura', 'Espana', 'Molina de Segura', 'Murcia', 'Avenida principal con trafico', '30500', 38.0541000, -1.2113000),
('Paseo Alfonso X, Murcia', 'Espana', 'Murcia', 'Murcia', 'Zona centrica con terrazas', '30008', 37.9908000, -1.1301000),
('Calle Mayor, San Javier', 'Espana', 'San Javier', 'Murcia', 'Zona residencial cercana al centro', '30730', 37.8063000, -0.8376000);

SET @ubic_juan_carlos = LAST_INSERT_ID();
SET @ubic_santiago_zaraiche = @ubic_juan_carlos + 1;
SET @ubic_parque_seda = @ubic_juan_carlos + 2;
SET @ubic_molina_centro = @ubic_juan_carlos + 3;
SET @ubic_floridablanca = @ubic_juan_carlos + 4;
SET @ubic_plaza_circular = @ubic_juan_carlos + 5;
SET @ubic_el_valle = @ubic_juan_carlos + 6;
SET @ubic_alcantarilla = @ubic_juan_carlos + 7;
SET @ubic_cartagena = @ubic_juan_carlos + 8;
SET @ubic_lorca = @ubic_juan_carlos + 9;
SET @ubic_molina = @ubic_juan_carlos + 10;
SET @ubic_alfonso_x = @ubic_juan_carlos + 11;
SET @ubic_san_javier = @ubic_juan_carlos + 12;

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
(@usuario_laura, 'Toby', @raza_labrador, 'MACHO', TRUE, 'MEDIANO', 24.50, 'Perro muy sociable de color claro. Llevaba collar azul cuando se perdio.', '2021-05-10', '2026-03-18', NULL, NULL, 'PERDIDA', 100.00, @ubic_santiago_zaraiche),
(@usuario_carlos, 'Misu', @raza_gato_comun, 'HEMBRA', FALSE, 'PEQUENO', 4.20, 'Gata comun muy asustadiza, suele esconderse debajo de coches.', '2023-04-02', '2026-03-20', NULL, NULL, 'PERDIDA', NULL, @ubic_molina_centro),
(@usuario_laura, 'Nala', @raza_caniche, 'HEMBRA', TRUE, 'PEQUENO', 7.80, 'Perra caniche recuperada tras varios avisos vecinales.', '2022-08-15', '2026-03-01', '2026-03-02', '2026-03-03', 'RECUPERADA', NULL, @ubic_juan_carlos),
(@usuario_carlos, 'Sin nombre', @raza_mestizo_perro, 'DESCONOCIDO', FALSE, 'MEDIANO', NULL, 'Perro mestizo encontrado cerca del Jardin de Floridablanca. No llevaba collar.', NULL, NULL, '2026-04-10', NULL, 'ENCONTRADA', NULL, @ubic_floridablanca),
(@usuario_laura, 'Luna', @raza_gato_comun, 'HEMBRA', FALSE, 'PEQUENO', 3.80, 'Gata gris y blanca, tranquila pero asustadiza. Se perdio por la zona de Plaza Circular.', '2022-11-03', '2026-04-02', NULL, NULL, 'PERDIDA', 50.00, @ubic_plaza_circular),
(@usuario_carlos, 'Rocky', @raza_mestizo_perro, 'MACHO', FALSE, 'MEDIANO', 18.40, 'Perro encontrado en Alcantarilla. Tiene collar rojo sin placa.', NULL, NULL, '2026-04-05', NULL, 'ENCONTRADA', NULL, @ubic_alcantarilla),
(@usuario_laura, 'Kira', @raza_labrador, 'HEMBRA', TRUE, 'GRANDE', 28.20, 'Labradora color canela, muy sociable. Se perdio durante un paseo.', '2020-06-18', '2026-04-08', NULL, NULL, 'PERDIDA', 150.00, @ubic_el_valle),
(@usuario_carlos, 'Simba', @raza_persa, 'MACHO', FALSE, 'PEQUENO', 5.10, 'Gato persa recuperado tras varios avisos de vecinos.', '2021-01-20', '2026-03-29', '2026-03-30', '2026-04-01', 'RECUPERADA', NULL, @ubic_alfonso_x),
(@usuario_laura, 'Bruno', @raza_mestizo_perro, 'MACHO', TRUE, 'GRANDE', 32.00, 'Perro grande negro con pecho blanco. Puede estar desorientado.', '2019-09-12', '2026-04-12', NULL, NULL, 'PERDIDA', 200.00, @ubic_cartagena),
(@usuario_carlos, 'Coco', @raza_caniche, 'MACHO', FALSE, 'PEQUENO', 6.30, 'Perro pequeno encontrado en Molina de Segura. Muy docil.', NULL, NULL, '2026-04-14', NULL, 'ENCONTRADA', NULL, @ubic_molina),
(@usuario_laura, 'Maya', @raza_siames, 'HEMBRA', FALSE, 'PEQUENO', 4.00, 'Gata siamesa con ojos azules. Se escapo por la tarde.', '2023-02-14', '2026-04-16', NULL, NULL, 'PERDIDA', 80.00, @ubic_lorca),
(@usuario_carlos, 'Max', @raza_labrador, 'MACHO', TRUE, 'GRANDE', 30.50, 'Labrador negro con chip. Llevaba arnes azul.', '2020-12-01', '2026-04-18', NULL, NULL, 'PERDIDA', 120.00, @ubic_alfonso_x),
(@usuario_laura, 'Nube', @raza_bulldog, 'HEMBRA', TRUE, 'PEQUENO', 9.40, 'Bulldog francesa blanca con manchas negras. Se perdio cerca de San Javier.', '2021-07-07', '2026-04-20', NULL, NULL, 'PERDIDA', 90.00, @ubic_san_javier),
(@usuario_carlos, 'Chispa', @raza_gato_comun, 'HEMBRA', FALSE, 'PEQUENO', 3.20, 'Gata joven encontrada en una zona residencial. Muy tranquila.', NULL, NULL, '2026-04-22', NULL, 'ENCONTRADA', NULL, @ubic_san_javier);

SET @mascota_toby = LAST_INSERT_ID();
SET @mascota_misu = @mascota_toby + 1;
SET @mascota_nala = @mascota_toby + 2;
SET @mascota_encontrado = @mascota_toby + 3;
SET @mascota_luna = @mascota_toby + 4;
SET @mascota_rocky = @mascota_toby + 5;
SET @mascota_kira = @mascota_toby + 6;
SET @mascota_simba = @mascota_toby + 7;
SET @mascota_bruno = @mascota_toby + 8;
SET @mascota_coco = @mascota_toby + 9;
SET @mascota_maya = @mascota_toby + 10;
SET @mascota_max = @mascota_toby + 11;
SET @mascota_nube = @mascota_toby + 12;
SET @mascota_chispa = @mascota_toby + 13;

-- =========================================
-- MASCOTAS_COLORES
-- =========================================
INSERT INTO mascotas_colores (mascota_id, color_id) VALUES
(@mascota_toby, @color_blanco),
(@mascota_toby, @color_beige),
(@mascota_misu, @color_negro),
(@mascota_misu, @color_atigrado),
(@mascota_nala, @color_blanco),
(@mascota_nala, @color_marron),
(@mascota_encontrado, @color_marron),
(@mascota_encontrado, @color_canela),
(@mascota_luna, @color_gris),
(@mascota_luna, @color_blanco),
(@mascota_rocky, @color_marron),
(@mascota_kira, @color_canela),
(@mascota_simba, @color_blanco),
(@mascota_simba, @color_beige),
(@mascota_bruno, @color_negro),
(@mascota_bruno, @color_blanco),
(@mascota_coco, @color_blanco),
(@mascota_maya, @color_beige),
(@mascota_maya, @color_marron),
(@mascota_max, @color_negro),
(@mascota_nube, @color_blanco),
(@mascota_nube, @color_negro),
(@mascota_chispa, @color_naranja),
(@mascota_chispa, @color_atigrado);

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
    usuario_id,
    leido_propietario
) VALUES
(@mascota_toby, '2026-03-19 19:30:00', @ubic_parque_seda, 'Vi un perro parecido corriendo cerca del parque. Parecia desorientado.', '600444555', 'testigo1@example.com', NULL, FALSE),
(@mascota_toby, '2026-03-20 09:15:00', @ubic_juan_carlos, 'Creo que era Toby, estaba cerca de una cafeteria.', '600333444', 'carlos@example.com', @usuario_carlos, FALSE),
(@mascota_misu, '2026-03-21 22:10:00', @ubic_molina_centro, 'Gata negra atigrada vista junto a unos contenedores.', '600555666', 'testigo2@example.com', NULL, FALSE),
(@mascota_luna, '2026-04-03 21:15:00', @ubic_alfonso_x, 'Vi una gata gris y blanca cerca de las terrazas.', '600888111', 'aviso.luna@example.com', NULL, FALSE),
(@mascota_kira, '2026-04-09 18:30:00', @ubic_el_valle, 'Una perra parecida paso junto al area recreativa.', '600888222', 'senderista@example.com', @usuario_carlos, FALSE),
(@mascota_bruno, '2026-04-13 08:20:00', @ubic_cartagena, 'Perro grande negro visto por la zona del puerto.', '600888333', 'cartagena@example.com', NULL, TRUE),
(@mascota_max, '2026-04-18 20:45:00', @ubic_plaza_circular, 'Labrador negro cruzando hacia Plaza Circular.', '600888444', 'testigo.max@example.com', @usuario_laura, FALSE),
(@mascota_nube, '2026-04-21 11:10:00', @ubic_san_javier, 'Perra pequena vista cerca de Calle Mayor.', '600888555', 'san.javier@example.com', NULL, FALSE);

SET @av_toby_parque = LAST_INSERT_ID();
SET @av_toby_cafeteria = @av_toby_parque + 1;
SET @av_misu = @av_toby_parque + 2;
SET @av_luna = @av_toby_parque + 3;
SET @av_kira = @av_toby_parque + 4;
SET @av_bruno = @av_toby_parque + 5;
SET @av_max = @av_toby_parque + 6;
SET @av_nube = @av_toby_parque + 7;

-- =========================================
-- FOTOS DE ANUNCIOS
-- Cambia estas rutas por las URLs reales de Cloudinary cuando las tengas.
-- =========================================
INSERT INTO fotos_anuncios (
    mascota_id,
    url,
    es_principal,
    orden
) VALUES
(@mascota_toby, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391479/uqhh1em7nhvbsa24xbbr.jpg', TRUE, 1),
(@mascota_toby, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391480/rtz4wwccroe3by6prkjp.jpg', FALSE, 2),
(@mascota_misu, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391481/uqwmqicv5zz0swpkeed6.jpg', TRUE, 1),
(@mascota_nala, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391478/rgtw3stvk4fcapiavjad.jpg', TRUE, 1),
(@mascota_encontrado, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391477/mklsqhid2pnn0wpobuo3.jpg', TRUE, 1),
(@mascota_luna, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391478/u9g5znqgjowpsao9j9bi.jpg', TRUE, 1),
(@mascota_rocky, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391479/njq5baaofrde7hsqgqn3.jpg', TRUE, 1),
(@mascota_kira, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391478/utfh2jytrycnxzyi4frt.jpg', TRUE, 1),
(@mascota_simba, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391479/muwitmj1hdpoplaanqlo.jpg', TRUE, 1),
(@mascota_bruno, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391481/thu1zdnbam1oujx0xfnj.jpg', TRUE, 1),
(@mascota_coco, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391480/dk85zniv89rbvtjwbekn.jpg', TRUE, 1),
(@mascota_maya, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391478/hjfksiyyc0bbwmlqjyxi.jpg', TRUE, 1),
(@mascota_max, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391477/tz8m5zhgz2i8u8oq1jjn.jpg', TRUE, 1),
(@mascota_nube, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391479/bakx4qbovbv9nsz9cixg.jpg', TRUE, 1),
(@mascota_chispa, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391480/qlpun5dox3jfsvujwlxd.jpg', TRUE, 1);

-- =========================================
-- FOTOS DE AVISTAMIENTOS
-- =========================================
INSERT INTO fotos_avistamientos (
    avistamiento_id,
    url,
    es_principal,
    orden
) VALUES
(@av_toby_parque, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391458/jbwml9zi6mzaoehl94ek.jpg', TRUE, 1),
(@av_toby_cafeteria, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391459/wgsy7hdnzbgsanbix8u5.jpg', TRUE, 1),
(@av_misu, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391458/bduq0nfq2hahvs0sbomt.jpg', TRUE, 1),
(@av_luna, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391458/d2vjolgzuyjbxzexidye.jpg', TRUE, 1),
(@av_kira, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391458/h8tdqoy0eeyezzcuqu7a.jpg', TRUE, 1),
(@av_bruno, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391458/kp4qvd6jgx40ux7lpsi9.jpg', TRUE, 1),
(@av_max, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391458/txzw9dnw52hdxccxbuos.jpg', TRUE, 1),
(@av_nube, 'https://res.cloudinary.com/dopb3sist/image/upload/v1779391458/hvywnsszihftol3lvzjw.jpg', TRUE, 1);

-- =========================================
-- PASSWORD RESETS
-- =========================================
INSERT INTO password_resets (
    usuario_id,
    token,
    expires_at,
    usado
) VALUES
(@usuario_laura, 'token_prueba_usuario_2_20260324', '2026-03-25 23:59:59', FALSE);

-- =========================================
-- MENSAJES_CONTACTO
-- =========================================
INSERT INTO mensajes_contacto (
    mascota_id,
    usuario_destinatario_id,
    usuario_remitente_id,
    nombre,
    correo,
    telefono,
    mensaje,
    leido_destinatario,
    fecha_creacion,
    fecha_leido
) VALUES
(@mascota_toby, @usuario_laura, @usuario_carlos, 'Carlos Perez Sanchez', 'carlos@example.com', '600333444', 'Creo haber visto a Toby cerca de una cafeteria. Puedo enviar mas detalles.', FALSE, '2026-03-20 10:05:00', NULL),
(@mascota_misu, @usuario_carlos, NULL, 'Vecina de Molina', 'vecina@example.com', '600777888', 'He visto una gata parecida a Misu por la zona centro.', TRUE, '2026-03-22 18:40:00', '2026-03-22 19:10:00'),
(@mascota_luna, @usuario_laura, NULL, 'Ana Ruiz', 'ana.ruiz@example.com', '600111222', 'He visto una gata muy parecida entrando en un portal cerca de Alfonso X.', FALSE, '2026-04-04 09:25:00', NULL),
(@mascota_coco, @usuario_carlos, @usuario_laura, 'Laura Martinez Lopez', 'laura@example.com', '600222333', 'Creo que Coco podria ser de una familia de mi barrio. Te paso informacion.', FALSE, '2026-04-14 18:05:00', NULL),
(@mascota_nube, @usuario_laura, @usuario_carlos, 'Carlos Perez Sanchez', 'carlos@example.com', '600333444', 'He visto el aviso de Nube y estare atento por la zona.', TRUE, '2026-04-21 12:30:00', '2026-04-21 13:00:00');

-- =========================================
-- REPORTES_ANUNCIOS
-- =========================================
INSERT INTO reportes_anuncios (
    mascota_id,
    usuario_reportante_id,
    usuario_propietario_id,
    asunto,
    mensaje,
    nombre,
    correo,
    telefono,
    estado,
    fecha_creacion,
    fecha_revision,
    revisado_por,
    notas_admin
) VALUES
(@mascota_toby, @usuario_carlos, @usuario_laura, 'Informacion incorrecta en el anuncio', 'La zona indicada podria no coincidir con el ultimo avistamiento.', 'Carlos Perez Sanchez', 'carlos@example.com', '600333444', 'PENDIENTE', '2026-03-21 12:00:00', NULL, NULL, NULL),
(@mascota_misu, NULL, @usuario_carlos, 'Imagen poco clara', 'La foto no permite identificar bien a la mascota.', 'Usuario anonimo', 'anonimo@example.com', NULL, 'REVISADO', '2026-03-23 09:30:00', '2026-03-23 11:00:00', @usuario_admin, 'Revisado por admin. No requiere accion.'),
(@mascota_rocky, @usuario_laura, @usuario_carlos, 'Posible duplicado', 'Este anuncio podria estar duplicado con otro perro encontrado en Alcantarilla.', 'Laura Martinez Lopez', 'laura@example.com', '600222333', 'PENDIENTE', '2026-04-06 14:35:00', NULL, NULL, NULL),
(@mascota_chispa, NULL, @usuario_carlos, 'Datos de contacto incompletos', 'El anuncio podria necesitar una descripcion mas concreta de la zona.', 'Visitante', 'visitante.reporte@example.com', NULL, 'DESCARTADO', '2026-04-23 10:00:00', '2026-04-23 10:45:00', @usuario_admin, 'Descartado tras revisar el contenido del anuncio.');

-- =========================================
-- MENSAJES_SOPORTE
-- =========================================
INSERT INTO mensajes_soporte (
    usuario_id,
    asunto,
    categoria,
    mensaje,
    nombre,
    correo,
    telefono,
    estado,
    fecha_creacion,
    fecha_cierre,
    cerrado_por,
    notas_admin
) VALUES
(@usuario_laura, 'No puedo editar mi anuncio', 'ANUNCIOS', 'Al intentar guardar cambios en mi anuncio aparece un error.', 'Laura Martinez Lopez', 'laura@example.com', '600222333', 'ABIERTO', '2026-03-24 16:20:00', NULL, NULL, NULL),
(NULL, 'Duda sobre registro', 'CUENTA', 'Quiero saber si puedo publicar un avistamiento sin crear cuenta.', 'Visitante', 'visitante@example.com', NULL, 'CERRADO', '2026-03-18 08:45:00', '2026-03-18 10:15:00', @usuario_admin, 'Respondido: los avistamientos publicos estan permitidos.'),
(@usuario_carlos, 'No veo mis notificaciones', 'NOTIFICACIONES', 'Tengo avistamientos enviados pero no encuentro el contador de notificaciones.', 'Carlos Perez Sanchez', 'carlos@example.com', '600333444', 'ABIERTO', '2026-04-15 12:10:00', NULL, NULL, NULL),
(@usuario_laura, 'Consulta sobre fotos', 'ANUNCIOS', 'Quiero saber si puedo subir mas de una foto en el anuncio.', 'Laura Martinez Lopez', 'laura@example.com', '600222333', 'CERRADO', '2026-04-19 17:25:00', '2026-04-19 18:00:00', @usuario_admin, 'Se indica que el formulario permite seleccionar varias imagenes.');
