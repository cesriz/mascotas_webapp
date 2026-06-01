# Guia de despliegue en Railway

Esta guia describe como desplegar Mascotas WebApp en Railway desde el repositorio GitHub del proyecto. El despliegue recomendado usa un unico servicio web PHP/Apache para servir el frontend estatico y la API, mas un servicio MySQL gestionado por Railway.

## Arquitectura

- Railway construye la imagen del servicio web usando `railway.json` y `docker/Dockerfile`.
- Apache sirve el frontend estatico desde el `public` del backend.
- Las rutas `/api/...` entran por el front controller PHP `src/backend/public/index.php`.
- MySQL se crea como servicio gestionado de Railway, no mediante `docker/docker-compose.yml`.
- Las imagenes subidas se almacenan en Cloudinary, por lo que Railway no necesita volumen persistente para uploads.
- `docker/docker-compose.yml` queda para desarrollo local.

## Archivos relevantes

- `railway.json`: indica a Railway que debe construir con Dockerfile y donde encontrarlo.
- `docker/Dockerfile`: crea una imagen autosuficiente con PHP/Apache, Composer, backend, frontend y configuracion de Apache.
- `docker/start-apache.sh`: adapta Apache al puerto que Railway inyecta en `PORT`.
- `docker/000-default.conf`: configura Apache para servir frontend estatico y enrutar `/api/...` al backend PHP.
- `.dockerignore`: excluye archivos innecesarios o sensibles del contexto de build.
- `railway.env.example`: plantilla de variables para Railway y para crear un `.env` local.
- `docker/docker-compose.yml`: entorno local con MySQL, phpMyAdmin, backend y frontend.

Railway no lee `railway.env.example` automaticamente. Ese archivo solo sirve como referencia: las variables reales deben configurarse en el panel de Railway.

## Variables de entorno

La plantilla de variables esta en `railway.env.example`.

Para Railway, usa ese archivo como referencia y configura las variables reales desde el panel de Railway.

Para desarrollo local, puedes crear un `.env` en la raiz del proyecto a partir de esa plantilla:

```powershell
Copy-Item railway.env.example .env
```

El archivo `.env` contiene secretos reales y no debe subirse a Git.

Variables principales del servicio web:

```text
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.up.railway.app
FRONTEND_URL=https://tu-dominio.up.railway.app
CORS_ALLOWED_ORIGIN=https://tu-dominio.up.railway.app
JWT_SECRET=una_clave_larga_aleatoria_y_privada
```

Variables de Cloudinary:

```text
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=mascotas_webapp
```

Variables de MySQL en Railway:

```text
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQL_URL=mysql://root:tu_password_mysql@mysql.railway.internal:3306/railway
```

El nombre `MySQL` puede variar si el servicio de base de datos tiene otro nombre en Railway. Usa el nombre real del servicio al referenciar sus variables.

Si Railway proporciona `DATABASE_URL`, la aplicacion tambien puede leerla. Si no existe, usa las variables `MYSQL...` o, en local, las variables `DB_...` y los valores por defecto del `docker-compose.yml`.

Para recuperacion de contrasena y envio de correo, configura tambien las variables SMTP incluidas en `railway.env.example`.

## Despliegue paso a paso

1. Sube la rama que quieras desplegar al remoto `origin`.
2. En Railway, crea un proyecto nuevo.
3. Anade un servicio MySQL al proyecto.
4. Anade un servicio web desde el repositorio GitHub.
5. Selecciona la rama que contiene la configuracion de Railway.
6. En el servicio web, entra en `Settings/Build/Builder`, selecciona la opcion `Dockerfile` y la ruta `/docker/Dockerfile`.
7. En `Settings/Config-as-code/Railway Config File`, selecciona `/railway.json`.
8. Configura las variables de entorno del servicio web usando `railway.env.example` como referencia. En este primer paso, puedes dejar `APP_URL`, `FRONTEND_URL` y `CORS_ALLOWED_ORIGIN` con valores temporales o vacíos, ya que el dominio público aún no se ha generado. Asegúrate de configurar `JWT_SECRET`, las variables de Cloudinary y SMTP.
9. Lanza el primer deploy del servicio web. Este despliegue inicial es necesario para que Railway provisione el servicio y permita la generación del dominio.
10. Una vez que el servicio web haya completado su primer despliegue, entra en `Settings/Networking` y pulsa `Generate Domain` para crear el dominio público.
11. Copia el dominio público generado.
12. Vuelve a las variables de entorno del servicio web y actualiza `APP_URL`, `FRONTEND_URL` y `CORS_ALLOWED_ORIGIN` con la URL pública real que acabas de generar.
13. Lanza un segundo deploy del servicio web para que tome las URLs actualizadas.
14. Importa la base de datos en el servicio MySQL.
15. Si importas datos o realizas cambios en variables o SQL que afecten la aplicación, lanza otro redeploy si es necesario.

## Importacion de base de datos

Los scripts SQL estan en `db/`:

- `01_estructura.sql`: estructura de tablas.
- `02_catalogo_base.sql`: catalogos base de especies, razas y colores.
- `03_catalogo_ubicacion.sql`: catalogos de provincias y municipios.
- `04_datos_demo.sql`: datos demo.

Orden recomendado:

1. `01_estructura.sql`
2. `02_catalogo_base.sql`
3. `03_catalogo_ubicacion.sql`
4. `04_datos_demo.sql`

Puedes importarlos desde un cliente MySQL conectado a Railway o desde las herramientas de datos disponibles en Railway.

Railway suele crear la base de datos con el nombre `railway`. Al ejecutar los scripts SQL en Railway, evita instrucciones como `CREATE DATABASE ...` o `USE ...`; ejecuta las tablas y datos directamente sobre la base seleccionada/conectada.

## Comprobaciones despues del deploy

Prueba estas rutas en el dominio publico:

- `/`
- `/tablon.html`
- `/detalles.html`
- `/api/especies`
- `/api/colores`
- `/api/provincias`
- `/api/mascotas/recientes?limit=4`

Despues prueba los flujos principales:

- registro;
- login;
- publicar mascota;
- subir foto;
- crear avistamiento;
- ver mapa;
- recuperar contrasena.

## Problemas frecuentes

- Si el frontend carga pero la API falla por CORS, revisa que `APP_URL`, `FRONTEND_URL` y `CORS_ALLOWED_ORIGIN` coincidan con el dominio publico actual.
- Si el login o las rutas privadas fallan en produccion, comprueba que `JWT_SECRET` existe y tiene un valor largo y privado.
- Si la app no conecta con MySQL, revisa las referencias `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD` `MYSQLDATABASE` y `MYSQL_URL` en el panel de Railway.
- Si las imagenes no se suben o no se muestran, comprueba las variables de Cloudinary.
- Si una ruta funciona en Windows pero falla en Railway, revisa mayusculas y minusculas en nombres de archivos PHP. Railway corre sobre Linux y distingue `cors.php` de `Cors.php`.
- Si cambias el dominio publico de Railway, actualiza tambien las variables de URL y lanza un redeploy.
- No subas valores reales en `railway.env.example` ni en `.env`.
