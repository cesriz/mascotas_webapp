# Despliegue en Railway

Esta rama prepara el proyecto para desplegarse en Railway como un unico servicio web con PHP/Apache, frontend estatico y una base de datos MySQL gestionada por Railway.

## Resumen de la arquitectura

- Railway construye la imagen usando `docker/Dockerfile`.
- Apache sirve el frontend desde `src/frontend`, copiado durante el build dentro de `src/backend/public`.
- Las rutas `/api/...` siguen entrando por el front controller PHP `src/backend/public/index.php`.
- MySQL no se despliega con `docker-compose.yml` en Railway. Se crea como servicio gestionado de Railway y la app lee sus variables.
- Las imagenes subidas siguen usando Cloudinary, asi que no hace falta volumen persistente para uploads.

Referencias oficiales consultadas:

- Docker Compose en Railway: https://docs.railway.com/guides/docker-compose
- MySQL en Railway: https://docs.railway.com/databases/mysql
- Config as Code: https://docs.railway.com/config-as-code/reference
- Public Networking: https://docs.railway.com/deploy/exposing-your-app

## Que se ha cambiado y por que

### Docker y Railway

Se ha actualizado `docker/Dockerfile` para que la imagen sea autosuficiente.

Antes funcionaba en local porque `docker-compose.yml` montaba el codigo con volumenes:

- `../src:/var/www/project`
- `./000-default.conf:/etc/apache2/sites-enabled/000-default.conf`

En Railway esos volumenes no existen. Por eso ahora el Dockerfile:

- instala dependencias PHP con Composer;
- copia el backend dentro de `/var/www/project/backend`;
- copia el frontend dentro de `public`;
- copia la configuracion de Apache;
- expone el puerto 80;
- adapta Apache a la variable `PORT` si Railway la inyecta.

Se ha actualizado `docker/000-default.conf` para que Apache priorice `index.html` en la home y no devuelva el JSON 404 del backend al visitar `/`.

Se ha anadido `docker/start-apache.sh` para arrancar Apache usando `PORT` cuando Railway lo defina.

Se ha anadido `railway.json` para que Railway sepa que debe usar:

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "docker/Dockerfile"
  }
}
```

Se ha anadido `.dockerignore` para que el build no envie al contexto:

- `.git`
- `vendor`
- `node_modules`
- `mysql_data`
- ficheros `.env`
- documentacion y otros archivos que no necesita la imagen

Esto reduce peso y evita subir secretos o datos locales al build.

### Configuracion de base de datos

`src/backend/app/Config/database.php` ahora puede leer:

- `DATABASE_URL`, si existe;
- variables MySQL de Railway: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`;
- variables genericas: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`;
- valores locales por defecto para Docker Compose.

`src/backend/app/Core/Database.php` ahora incluye `port` en el DSN de PDO. Esto es importante porque Railway entrega el puerto de MySQL como variable.

### Configuracion de aplicacion

`src/backend/app/Config/app.php` ahora lee variables:

- `APP_NAME`
- `APP_ENV`
- `APP_DEBUG`
- `APP_TIMEZONE`
- `APP_URL`
- `FRONTEND_URL`
- `MAIL_FROM`

Esto permite que los enlaces de recuperacion de contrasena apunten al dominio real de Railway y no a `localhost`.

### CORS

`src/backend/app/Config/cors.php` ahora lee:

- `CORS_ALLOWED_ORIGIN`
- `FRONTEND_URL`
- `APP_URL`

Como el despliegue recomendado sirve frontend y API desde el mismo dominio, CORS casi no deberia molestar. Aun asi queda preparado para permitir el dominio correcto.

Tambien se corrigio el `require_once` en `src/backend/public/index.php`:

```php
require_once __DIR__ . '/../app/Config/cors.php';
```

Antes buscaba `Cors.php`, pero el archivo real es `cors.php`. En Windows funciona por casualidad; en Railway/Linux puede romper.

### JWT

`src/backend/app/Helpers/JwtHelper.php` ahora lee `JWT_SECRET`.

Antes la clave estaba fija en codigo. Ahora, si `APP_ENV=production` y falta `JWT_SECRET`, la app falla en vez de firmar tokens con una clave de desarrollo.

### Frontend

`src/frontend/js/api.js` ya no esta atado a `http://localhost:3000`.

Comportamiento actual:

- si el frontend corre en `localhost:4200`, usa `http://localhost:3000`;
- si corre desde Railway, usa el mismo dominio y llama a `/api/...`;
- si alguna vez necesitas forzar una URL, puedes definir `window.MASCOTAS_API_BASE_URL` antes de cargar `js/main.js`.

Tambien se centralizo la resolucion de imagenes relativas con `API.resolveMediaUrl()`. Asi las fotos que no vengan de Cloudinary se resuelven contra el backend correcto.

`src/backend/public/.htaccess` ahora sirve vistas estaticas sin extension. Por ejemplo:

- `/detalles?id=1` carga `detalles.html`.
- `/perfil?panel=publicar` carga `perfil.html`.
- `/api/...` no se convierte a HTML y sigue entrando al backend PHP.

### Secretos locales

`docker/docker-compose.yml` ya no contiene credenciales reales de Cloudinary.

Para local, copia `docker/env.example` a `docker/.env` y rellena tus valores reales. Ese `.env` no debe subirse a Git.

## Variables necesarias en Railway

En el servicio web de Railway configura:

```text
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.up.railway.app
FRONTEND_URL=https://tu-dominio.up.railway.app
CORS_ALLOWED_ORIGIN=https://tu-dominio.up.railway.app
JWT_SECRET=una_clave_larga_aleatoria_y_privada
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=mascotas_webapp
```

Para MySQL, crea un servicio MySQL en el mismo proyecto Railway y referencia sus variables desde el servicio web:

```text
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
```

El nombre `MySQL` puede variar si llamas al servicio de otra forma. Usa el nombre real del servicio en Railway.

Tienes una plantilla en `railway.env.example`.

## Pasos para desplegar

1. Sube esta rama a GitHub.
2. En Railway, crea un proyecto nuevo.
3. Anade un servicio MySQL.
4. Anade un servicio web desde el repositorio GitHub.
5. Selecciona esta rama.
6. Railway leera `railway.json` y usara `docker/Dockerfile`.
7. Configura las variables del apartado anterior.
8. Genera un dominio publico para el servicio web.
9. Actualiza `APP_URL`, `FRONTEND_URL` y `CORS_ALLOWED_ORIGIN` con ese dominio.
10. Importa la base de datos.
11. Lanza un redeploy del servicio web.

## Importar la base de datos

Los SQL estan en `db/`:

- `01_estructura.sql`: estructura de tablas.
- `02_datos_prueba.sql`: datos de prueba.
- `03_catalogos_ubicacion.sql`: catalogos de provincias/municipios.

Orden recomendado:

1. `01_estructura.sql`
2. `03_catalogos_ubicacion.sql`
3. `02_datos_prueba.sql`

Puedes importarlos desde un cliente MySQL conectado a Railway o desde las herramientas de datos que tengas disponibles en Railway.

## Comprobaciones despues del deploy

Prueba estas rutas en el dominio publico:

- `/`
- `/tablon.html`
- `/detalles.html`
- `/api/especies`
- `/api/colores`
- `/api/provincias`
- `/api/mascotas/recientes?limit=4`

Luego prueba flujo real:

- registro;
- login;
- publicar mascota;
- subir foto;
- crear avistamiento;
- ver mapa;
- recuperar contrasena.

## Cosas a tener en cuenta

- No subas valores reales en `railway.env.example` ni en `docker/env.example`.
- Si cambias el dominio Railway, cambia tambien `APP_URL`, `FRONTEND_URL` y `CORS_ALLOWED_ORIGIN`.
- Si decides separar frontend y backend en dos servicios distintos, habra que ajustar CORS y `window.MASCOTAS_API_BASE_URL`.
- El envio de correo usa `mail()` en PHP. En Railway puede no ser suficiente para correo real; para produccion seria mejor usar SMTP externo o un proveedor transaccional.
- Railway no usa `docker-compose.yml` como en local. Ese archivo queda para desarrollo local.
