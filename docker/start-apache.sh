#!/bin/sh
set -eu

a2dismod mpm_event mpm_worker || true
a2enmod mpm_prefork rewrite

APACHE_PORT="${PORT:-80}"

if [ "${APACHE_PORT}" != "80" ]; then
    sed -ri "s/^Listen .*/Listen ${APACHE_PORT}/" /etc/apache2/ports.conf
    sed -ri "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${APACHE_PORT}>/" /etc/apache2/sites-available/000-default.conf
fi

exec apache2-foreground
