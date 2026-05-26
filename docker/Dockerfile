FROM php:8.2-apache

# Instala herramientas necesarias para Composer y extensiones PHP
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

# Instala composer para gestionar librerías de php
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Activa mod_rewrite y usa mpm_prefork para evitar conflictos de MPM en Railway
RUN a2dismod mpm_event mpm_worker || true \
    && a2enmod mpm_prefork rewrite

# Directorio de trabajo dentro del contenedor
WORKDIR /var/www/project/backend

# Copia primero los manifests de composer para aprovechar la cache de Docker
COPY src/backend/composer.json src/backend/composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-autoloader

# Copia el backend y despues el frontend dentro del public de Apache.
# Asi Railway puede servir frontend y API desde un unico servicio.
COPY src/backend/ ./
COPY src/frontend/ ./public/
RUN composer dump-autoload --optimize

# Configuracion de Apache para el front controller PHP.
COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY docker/start-apache.sh /usr/local/bin/start-apache

RUN sed -i 's/\r$//' /usr/local/bin/start-apache \
    && chmod +x /usr/local/bin/start-apache \
    && chown -R www-data:www-data /var/www/project/backend

EXPOSE 80

# Railway puede inyectar PORT. Si no existe, Apache se queda en el puerto 80.
CMD ["start-apache"]
