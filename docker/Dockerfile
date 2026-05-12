FROM php:8.2-apache

# Instala composer para gestionar librerías de php
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Instala las extensiones necesarias para trabajar con PDO y MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Activa mod_rewrite de Apache
# Esto suele hacer falta para front controller y rutas amigables
RUN a2enmod rewrite

# Directorio de trabajo dentro del contenedor
# No es obligatorio para que Apache funcione, pero ayuda a tener un contexto claro
WORKDIR /var/www/project/backend