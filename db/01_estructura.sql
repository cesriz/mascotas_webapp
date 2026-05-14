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
    token TEXT NULL,
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
    longitud DECIMAL(10,7) NULL,

    CONSTRAINT chk_ubicaciones_latitud
        CHECK (latitud IS NULL OR latitud BETWEEN -90 AND 90),

    CONSTRAINT chk_ubicaciones_longitud
        CHECK (longitud IS NULL OR longitud BETWEEN -180 AND 180)

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
    fecha_perdida DATE NULL,
    fecha_encontrada DATE NULL,
    fecha_recuperada DATE NULL,
    estado ENUM('PERDIDA', 'ENCONTRADA', 'RECUPERADA') NOT NULL DEFAULT 'PERDIDA',
    estado_publicacion ENUM('PUBLICADO','OCULTO') NOT NULL DEFAULT 'PUBLICADO',
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
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_anuncio_peso
        CHECK (peso IS NULL OR peso >= 0),

    CONSTRAINT chk_anuncio_recompensa
        CHECK (recompensa IS NULL OR recompensa >= 0),
    
    CONSTRAINT chk_anuncio_fecha_estado
        CHECK (
            (estado = 'PERDIDA' AND fecha_perdida IS NOT NULL AND fecha_encontrada IS NULL AND fecha_recuperada IS NULL) OR
            (estado = 'ENCONTRADA' AND fecha_perdida IS NULL AND fecha_encontrada IS NOT NULL AND fecha_recuperada IS NULL) OR
            (estado = 'RECUPERADA' AND fecha_perdida IS NULL AND fecha_encontrada IS NULL AND fecha_recuperada IS NOT NULL)
        )
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
-- Incluye control de leído para el propietario
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
    leido_propietario BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_leido_propietario DATETIME NULL,

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
-- TABLA: MENSAJES_CONTACTO
-- Guarda los mensajes enviados desde el botón contactar
-- =========================================
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT UNSIGNED NOT NULL,
    usuario_destinatario_id INT UNSIGNED NOT NULL,
    usuario_remitente_id INT UNSIGNED NULL,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NULL,
    mensaje TEXT NOT NULL,
    leido_destinatario BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_leido DATETIME NULL,

    CONSTRAINT fk_mensajes_contacto_mascota
        FOREIGN KEY (mascota_id)
        REFERENCES anuncio_mascotas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_mensajes_contacto_usuario_destinatario
        FOREIGN KEY (usuario_destinatario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_mensajes_contacto_usuario_remitente
        FOREIGN KEY (usuario_remitente_id)
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
    public_id VARCHAR(255) NULL,
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
    public_id VARCHAR(255) NULL,
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
-- TABLA: REPORTES_ANUNCIOS
-- =========================================


CREATE TABLE IF NOT EXISTS reportes_anuncios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT UNSIGNED NOT NULL,
    usuario_reportante_id INT UNSIGNED NULL,
    usuario_propietario_id INT UNSIGNED NOT NULL,

    asunto VARCHAR(150) NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,

    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NULL,

    estado ENUM('PENDIENTE', 'REVISADO', 'DESCARTADO') NOT NULL DEFAULT 'PENDIENTE',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_revision DATETIME NULL,
    revisado_por INT UNSIGNED NULL,
    notas_admin TEXT NULL,

    CONSTRAINT fk_reportes_anuncios_mascota
        FOREIGN KEY (mascota_id)
        REFERENCES anuncio_mascotas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_reportes_anuncios_usuario_reportante
        FOREIGN KEY (usuario_reportante_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_reportes_anuncios_usuario_propietario
        FOREIGN KEY (usuario_propietario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_reportes_anuncios_revisado_por
        FOREIGN KEY (revisado_por)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- TABLA: MENSAJES SOPORTE
-- =========================================

CREATE TABLE IF NOT EXISTS mensajes_soporte (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NULL,

    asunto VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL DEFAULT 'GENERAL',
    mensaje TEXT NOT NULL,

    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NULL,

    estado ENUM('ABIERTO', 'CERRADO') NOT NULL DEFAULT 'ABIERTO',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre DATETIME NULL,
    cerrado_por INT UNSIGNED NULL,
    notas_admin TEXT NULL,

    CONSTRAINT fk_mensajes_soporte_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_mensajes_soporte_cerrado_por
        FOREIGN KEY (cerrado_por)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;
);

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

CREATE INDEX idx_avistamientos_leido_propietario
ON avistamientos(leido_propietario);

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

CREATE INDEX idx_mensajes_contacto_usuario_destinatario
ON mensajes_contacto(usuario_destinatario_id);

CREATE INDEX idx_mensajes_contacto_mascota
ON mensajes_contacto(mascota_id);

CREATE INDEX idx_mensajes_contacto_leido_destinatario
ON mensajes_contacto(leido_destinatario);

CREATE INDEX idx_mensajes_contacto_fecha_creacion
ON mensajes_contacto(fecha_creacion);