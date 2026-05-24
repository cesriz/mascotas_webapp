FROM php:8.2-apache

# Instala herramientas necesarias para Composer y extensiones PHP
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

# Instala composer para gestionar librerías de php
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Activa mod_rewrite de Apache
# Esto suele hacer falta para front controller y rutas amigables
RUN a2enmod rewrite

# Directorio de trabajo dentro del contenedor
WORKDIR /var/www/project/backend