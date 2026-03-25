-- =====================================
-- 01_estructura.sql
-- Proyecto mascotas_webapp
-- =====================================

CREATE DATABASE IF NOT EXISTS mascotas_webapp
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE mascotas_webapp;

-- =========================================
-- TABLA: USUARIOS
-- =========================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20) NULL,
    direccion VARCHAR(255) NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rol ENUM('USUARIO', 'ADMIN') NOT NULL DEFAULT 'USUARIO',
    password_hash VARCHAR(255) NOT NULL,
    email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;


-- =========================================
-- TABLA: PASSWORD_RESETS
-- =========================================
CREATE TABLE IF NOT EXISTS password_resets (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    usado BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_password_resets_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================
-- TABLA: ESPECIES
-- =========================================
CREATE TABLE IF NOT EXISTS especies (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;


-- =========================================
-- TABLA: RAZAS
-- =========================================
CREATE TABLE IF NOT EXISTS razas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    especies_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(100) NOT NULL,

    CONSTRAINT fk_razas_especie
        FOREIGN KEY (especies_id)
        REFERENCES especies(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT uq_raza_nombre UNIQUE (nombre)
) ENGINE=InnoDB;


-- =========================================
-- TABLA: COLORES
-- =========================================
CREATE TABLE IF NOT EXISTS colores (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;


-- =========================================
-- TABLA: UBICACIONES
-- =========================================
CREATE TABLE IF NOT EXISTS ubicaciones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    direccion_formateada VARCHAR(255) NULL,
    pais VARCHAR(100) NULL,
    municipio VARCHAR(100) NULL,
    provincia VARCHAR(100) NULL,
    descripcion TEXT NULL,
    codigo_postal VARCHAR(10) NULL,
    latitud DECIMAL(10,7) NULL,
    longitud DECIMAL(10,7) NULL
) ENGINE=InnoDB;


-- =========================================
-- TABLA: ANUNCIO_MASCOTAS
-- =========================================
CREATE TABLE IF NOT EXISTS anuncio_mascotas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(100) NULL,
    raza_id INT UNSIGNED NOT NULL,
    sexo ENUM('MACHO', 'HEMBRA', 'DESCONOCIDO') NOT NULL DEFAULT 'DESCONOCIDO',
    tiene_chip BOOLEAN NOT NULL DEFAULT FALSE,
    tamano ENUM('PEQUENO', 'MEDIANO', 'GRANDE', 'DESCONOCIDO') NOT NULL DEFAULT 'DESCONOCIDO',
    peso DECIMAL(5,2) NULL,
    descripcion TEXT NOT NULL,
    fecha_nacimiento DATE NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_perdida DATE NOT NULL,
    fecha_encontrada DATE NULL,
    fecha_recuperada DATE NULL,
    estado ENUM('PERDIDA', 'ENCONTRADA', 'RECUPERADA') NOT NULL DEFAULT 'PERDIDA',
    recompensa DECIMAL(10,2) NULL,
    ubicaciones_perdida_id INT UNSIGNED NOT NULL,

    CONSTRAINT fk_anuncio_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_anuncio_raza
        FOREIGN KEY (raza_id)
        REFERENCES razas(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_anuncio_ubicacion
        FOREIGN KEY (ubicaciones_perdida_id)
        REFERENCES ubicaciones(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================
-- TABLA: MASCOTAS_COLORES
-- =========================================
CREATE TABLE IF NOT EXISTS mascotas_colores (
    mascota_id INT UNSIGNED NOT NULL,
    color_id INT UNSIGNED NOT NULL,

    PRIMARY KEY (mascota_id, color_id),

    CONSTRAINT fk_mascotas_colores_mascota
        FOREIGN KEY (mascota_id)
        REFERENCES anuncio_mascotas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_mascotas_colores_color
        FOREIGN KEY (color_id)
        REFERENCES colores(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================
-- TABLA: AVISTAMIENTOS
-- =========================================
CREATE TABLE IF NOT EXISTS avistamientos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT UNSIGNED NULL,
    fecha_hora DATETIME NOT NULL,
    ubicaciones_avistamientos_id INT UNSIGNED NOT NULL,
    descripcion TEXT NULL,
    telefono VARCHAR(20) NULL,
    correo VARCHAR(150) NULL,
    usuario_id INT UNSIGNED NULL,

    CONSTRAINT fk_avistamiento_mascota
        FOREIGN KEY (mascota_id)
        REFERENCES anuncio_mascotas(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_avistamiento_ubicacion
        FOREIGN KEY (ubicaciones_avistamientos_id)
        REFERENCES ubicaciones(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_avistamiento_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================
-- TABLA: FOTOS_ANUNCIOS
-- =========================================
CREATE TABLE IF NOT EXISTS fotos_anuncios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT UNSIGNED NOT NULL,
    url VARCHAR(500) NOT NULL,
    fecha_subida DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    orden INT UNSIGNED NOT NULL DEFAULT 0,

    CONSTRAINT fk_fotos_anuncios_mascota
        FOREIGN KEY (mascota_id)
        REFERENCES anuncio_mascotas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================
-- TABLA: FOTOS_AVISTAMIENTOS
-- =========================================
CREATE TABLE IF NOT EXISTS fotos_avistamientos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    avistamiento_id INT UNSIGNED NOT NULL,
    url VARCHAR(500) NOT NULL,
    fecha_subida DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    orden INT UNSIGNED NOT NULL DEFAULT 0,

    CONSTRAINT fk_fotos_avistamientos_avistamiento
        FOREIGN KEY (avistamiento_id)
        REFERENCES avistamientos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- INDICES
-- =========================================
CREATE INDEX idx_password_resets_usuario_id 
ON password_resets(usuario_id);

CREATE INDEX idx_anuncio_usuario_id 
ON anuncio_mascotas(usuario_id);

CREATE INDEX idx_anuncio_raza_id 
ON anuncio_mascotas(raza_id);

CREATE INDEX idx_anuncio_ubicacion_perdida_id 
ON anuncio_mascotas(ubicaciones_perdida_id);

CREATE INDEX idx_anuncio_estado 
ON anuncio_mascotas(estado);

CREATE INDEX idx_avistamientos_mascota_id 
ON avistamientos(mascota_id);

CREATE INDEX idx_avistamientos_ubicacion_id 
ON avistamientos(ubicaciones_avistamientos_id);

CREATE INDEX idx_avistamientos_usuario_id 
ON avistamientos(usuario_id);

CREATE INDEX idx_avistamientos_fecha_hora 
ON avistamientos(fecha_hora);

CREATE INDEX idx_fotos_anuncios_mascota_orden 
ON fotos_anuncios(mascota_id, orden);

CREATE INDEX idx_fotos_avistamientos_avistamiento_orden
ON fotos_avistamientos(avistamiento_id, orden);

CREATE INDEX idx_mascotas_colores_color_id 
ON mascotas_colores(color_id);

CREATE INDEX idx_ubicaciones_codigo_postal 
ON ubicaciones(codigo_postal);

CREATE INDEX idx_ubicaciones_municipio
ON ubicaciones(municipio);

CREATE INDEX idx_ubicaciones_provincia
ON ubicaciones(provincia);