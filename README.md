# Mascotas WebApp

Aplicación web colaborativa para la gestión de mascotas perdidas y encontradas.

Permite publicar anuncios de mascotas, registrar avistamientos, visualizar ubicaciones en mapas interactivos y facilitar la comunicación entre propietarios y usuarios que puedan aportar información útil para la recuperación de los animales.

---

## Descripción

Mascotas WebApp nace con el objetivo de centralizar la información relacionada con mascotas perdidas y encontradas.

Actualmente, muchos casos se difunden mediante redes sociales, grupos de mensajería o carteles físicos, provocando que la información quede dispersa y sea difícil de mantener actualizada. Esta aplicación busca ofrecer una plataforma única donde los usuarios puedan colaborar en la localización de animales desaparecidos.

---

## Funcionalidades principales

* Registro e inicio de sesión de usuarios.
* Gestión de mascotas perdidas, encontradas y recuperadas.
* Subida de fotografías.
* Registro de avistamientos.
* Visualización de ubicaciones mediante mapas interactivos.
* Sistema de contacto entre usuarios.
* Reporte de anuncios.
* Centro de notificaciones.
* Panel de administración.
* Recuperación de contraseña mediante correo electrónico.
* Generación de códigos QR para compartir anuncios.
* Filtros avanzados de búsqueda.

---

## Arquitectura

La aplicación sigue una arquitectura cliente-servidor dividida en tres capas principales:

Frontend
↓
API REST
↓
Base de datos MySQL

### Backend

Desarrollado en PHP sin framework siguiendo una estructura inspirada en MVC.

```text
backend/
│
├── Config/
├── Controllers/
├── Models/
├── Services/
├── Validators/
├── Middleware/
├── Helpers/
├── Routes/
└── public/
```

### Frontend

Desarrollado utilizando:

* HTML5
* CSS3
* JavaScript Vanilla
* Web Components (Custom Elements)

---

## Tecnologías utilizadas

### Backend

* PHP
* MySQL
* Composer
* JWT
* Cloudinary
* Brevo

### Frontend

* HTML5
* CSS3
* JavaScript
* Leaflet
* OpenStreetMap
* Nominatim
* QRCode.js

### Infraestructura

* Docker
* Docker Compose
* Git
* GitHub
* Railway

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd mascotas_webapp
```

### 2. Crear archivo .env

Crear un archivo `.env` a partir de `.env.example`.

Ejemplo:

```env
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=

FRONTEND_BASE_URL=
```

### 3. Levantar el entorno Docker

```bash
docker-compose up -d
```

### 4. Importar la base de datos

Ejecutar los scripts SQL en el siguiente orden:

```text
01_estructura.sql
02_catalogo_base.sql
03_catalogo_ubicacion.sql
04_datos_demo.sql
```

---

## Servicios disponibles en local

| Servicio    | URL                   |
| ----------- | --------------------- |
| Backend API | http://localhost:3000 |
| phpMyAdmin  | http://localhost:8081 |
| MySQL       | localhost:3306        |

---

## Autenticación

Las rutas privadas utilizan autenticación mediante token.

Ejemplo:

```http
Authorization: Bearer TU_TOKEN
```

El token se obtiene al iniciar sesión y debe enviarse en las peticiones protegidas.

---

## Gestión de imágenes

Las fotografías de mascotas y avistamientos se almacenan mediante Cloudinary.

El backend guarda:

* URL pública de la imagen.
* Identificador (`public_id`) de Cloudinary.

Esto permite gestionar posteriormente la eliminación de imágenes sin depender del almacenamiento local del servidor.

---

## Geolocalización

La aplicación utiliza:

* Leaflet
* OpenStreetMap
* Nominatim

para representar:

* Ubicaciones de pérdida.
* Ubicaciones de encuentro.
* Avistamientos registrados.

---

## Documentación de la API

La documentación completa de la API se encuentra en:

```text
documentacion/API.md
```

Incluye:

* Endpoints disponibles.
* Métodos HTTP.
* Ejemplos de peticiones.
* Ejemplos de respuestas.
* Reglas de validación.
* Requisitos de autenticación.

---

## Despliegue

La aplicación está preparada para desplegarse en Railway utilizando Docker.

La configuración sensible se gestiona mediante variables de entorno y no debe almacenarse directamente en el repositorio.


---

## Equipo

Proyecto desarrollado como Trabajo Fin de Grado de Desarrollo de Aplicaciones Web.

Autores:

* César Ruiz
* Vanesa Sánchez
* Steeven Ordoñez

---

## Licencia

Proyecto desarrollado con fines académicos y educativos.

