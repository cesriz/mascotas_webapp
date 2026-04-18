# API rápida para frontend - Mascotas WebApp

---

## Base URL en local

```txt
http://localhost:3000
```

Si una ruta pone por ejemplo:

```txt
GET /api/mascotas
```

la URL completa en local sería:

```txt
http://localhost:3000/api/mascotas
```

---

## Cómo saber si una ruta necesita login

Si una ruta es privada, el frontend tiene que mandar:

```http
Authorization: Bearer TU_TOKEN
```

### Rutas públicas
Las puede usar cualquiera.

### Rutas privadas
Solo funcionan si el usuario ha iniciado sesión.

### Rutas admin
Además de token, el usuario debe tener rol `ADMIN`.

---

## Respuesta típica del backend

### Cuando todo va bien

```json
{
  "success": true,
  "data": {}
}
```

### Cuando hay un error simple

```json
{
  "success": false,
  "message": "Mensaje de error"
}
```

### Cuando fallan validaciones

```json
{
  "success": false,
  "errors": [
    "nombre es obligatorio",
    "correo no válido"
  ]
}
```

---

# 1. Autenticación

## POST /api/auth/login
**Tipo:** pública  
**Sirve para:** iniciar sesión.

### Qué manda el frontend
```json
{
  "correo": "usuario@correo.com",
  "password": "123456"
}
```

### Qué suele devolver
- token
- datos básicos del usuario logueado

### Se usa en
- pantalla de login

---

## GET /api/auth/me
**Tipo:** privada  
**Sirve para:** saber qué usuario está logueado ahora mismo.

### Qué suele devolver
- id
- nombre
- apellidos
- correo
- teléfono
- dirección
- rol

### Se usa en
- cargar la sesión al entrar a la app
- saber si el usuario está autenticado
- panel privado

---

## POST /api/auth/logout
**Tipo:** privada  
**Sirve para:** cerrar sesión.

### Qué suele devolver
- mensaje de logout correcto

### Se usa en
- botón “cerrar sesión”

---

# 2. Zona privada del usuario

## GET /api/me/perfil
**Tipo:** privada  
**Sirve para:** obtener los datos del perfil del usuario autenticado.

### Qué suele devolver
- nombre
- apellidos
- correo
- teléfono
- dirección
- fecha de registro
- rol
- si está activo

### Se usa en
- pantalla “Mi perfil”
- formulario de edición del perfil

---

## PUT /api/me/perfil
**Tipo:** privada  
**Sirve para:** actualizar perfil.

### Qué puede mandar el frontend
```json
{
  "nombre": "Cesar",
  "apellidos": "Ruiz",
  "correo": "cesar@email.com",
  "telefono": "600000000",
  "direccion": "Murcia"
}
```

### Qué suele devolver
- mensaje de perfil actualizado
- perfil actualizado

### Se usa en
- botón “Guardar cambios” de mi perfil

---

## PATCH /api/me/password
**Tipo:** privada  
**Sirve para:** cambiar contraseña.

### Qué manda el frontend
```json
{
  "current_password": "claveActual123",
  "new_password": "claveNueva123",
  "new_password_confirm": "claveNueva123"
}
```

### Qué suele devolver
- mensaje de contraseña actualizada

### Importante
Cambiar la contraseña **no cierra la sesión actual automáticamente**.

### Se usa en
- sección “Seguridad”

---

## DELETE /api/me/cuenta
**Tipo:** privada  
**Sirve para:** desactivar la cuenta del usuario.

### Qué suele devolver
- mensaje de cuenta desactivada

### Importante
Es una baja lógica. No es borrado físico completo.

### Se usa en
- botón “Eliminar cuenta”

---

## GET /api/me/mascotas
**Tipo:** privada  
**Sirve para:** ver las mascotas publicadas por el usuario logueado.

### Qué suele devolver
Una lista de tarjetas con datos de cada mascota, normalmente con cosas como:
- id
- nombre
- estado
- ubicación resumida
- foto principal
- fechas importantes

### Se usa en
- sección “Mis mascotas”

---

## GET /api/me/avistamientos
**Tipo:** privada  
**Sirve para:** ver los avistamientos que ha creado el usuario logueado.

### Qué suele devolver
Una lista de tarjetas con datos como:
- id del avistamiento
- mascota relacionada
- fecha y hora
- ubicación
- foto si tiene

### Se usa en
- sección “Mis avistamientos”

---

## GET /api/me/notificaciones
**Tipo:** privada  
**Sirve para:** ver el centro de notificaciones del usuario.

### Qué suele devolver
Un objeto con:
- resumen de no leídas
- lista de mensajes/contactos recibidos
- lista de avistamientos recibidos

### Se usa en
- sección “Notificaciones”

---

## PATCH /api/me/notificaciones/contactos/{id}/leer
**Tipo:** privada  
**Sirve para:** marcar un mensaje de contacto como leído.

### Qué suele devolver
- mensaje de confirmación

### Se usa en
- botón “marcar como leído” dentro de notificaciones

---

## PATCH /api/me/notificaciones/avistamientos/{id}/leer
**Tipo:** privada  
**Sirve para:** marcar un avistamiento recibido como leído.

### Qué suele devolver
- mensaje de confirmación

### Se usa en
- botón “marcar como leído” dentro de notificaciones

---

# 3. Mascotas públicas

## GET /api/mascotas
**Tipo:** pública  
**Sirve para:** listar mascotas publicadas.

### Admite filtros
- estado
- especie_id
- raza_id
- sexo
- tamano
- municipio
- provincia
- q_ubicacion
- fecha_desde
- fecha_hasta
- color_ids
- tiene_chip
- con_fotos
- orden
- page
- limit

### Qué suele devolver
Una lista de mascotas con datos resumidos, por ejemplo:
- id
- nombre
- estado
- especie/raza
- ubicación resumida
- foto principal
- metadatos de paginación

### Se usa en
- tablón principal
- pantalla de búsqueda
- filtros

---

## GET /api/mascotas/recientes
**Tipo:** pública  
**Sirve para:** obtener las publicaciones más recientes.

### Qué suele devolver
- una lista corta de mascotas recientes

### Se usa en
- home
- bloque de “anuncios recientes”

---

## GET /api/mascotas/{id}
**Tipo:** pública  
**Sirve para:** ver el detalle completo de una mascota.

### Qué suele devolver
Normalmente:
- datos completos de la mascota
- colores
- fotos
- ubicación
- avistamientos relacionados
- datos públicos del usuario que publicó

### Importante
Si un anuncio está oculto, solo lo puede ver su dueño o un admin.

### Se usa en
- pantalla detalle de mascota

---

# 4. Mascotas privadas

## POST /api/mascotas
**Tipo:** privada  
**Sirve para:** crear una nueva publicación de mascota.

### Qué manda el frontend
JSON con datos de la mascota, colores y ubicación.

### Qué suele devolver
- mensaje de creación correcta
- datos de la nueva mascota

### Se usa en
- formulario “Publicar mascota”

---

## PUT /api/mascotas/{id}
**Tipo:** privada  
**Sirve para:** editar una mascota propia.

### Qué suele devolver
- mensaje de actualización correcta
- mascota actualizada

### Se usa en
- editar publicación

---

## POST /api/mascotas/{id}/fotos
**Tipo:** privada  
**Sirve para:** subir fotos de una mascota.

### Qué manda el frontend
- `multipart/form-data`
- campo `fotos`
- uno o varios archivos de imagen

### Qué suele devolver
- mensaje de subida correcta
- lista de fotos guardadas

### Se usa en
- añadir fotos después de crear mascota

---

## DELETE /api/mascotas/{id}
**Tipo:** privada  
**Sirve para:** borrar una mascota propia.

### Qué suele devolver
- mensaje de borrado correcto

### Se usa en
- botón “Eliminar publicación”

---

## PATCH /api/mascotas/{id}/recuperar
**Tipo:** privada  
**Sirve para:** marcar una mascota propia como recuperada.

### Qué suele devolver
- mensaje de estado actualizado
- estado nuevo y fecha_recuperada

### Se usa en
- botón “Marcar como recuperada”

---

# 5. Avistamientos

## GET /api/mascotas/{id}/avistamientos
**Tipo:** pública  
**Sirve para:** ver los avistamientos de una mascota concreta.

### Qué suele devolver
Una lista con datos como:
- id
- fecha y hora
- ubicación
- descripción
- fotos del avistamiento
- teléfono y correo si se guardaron

### Se usa en
- detalle de mascota
- historial de avistamientos

---

## POST /api/mascotas/{id}/avistamientos
**Tipo:** pública  
**Sirve para:** registrar un avistamiento de una mascota.

### Lo puede usar
- un usuario logueado
- una persona sin cuenta

### Qué suele mandar el frontend
Como mínimo:
- teléfono
- fecha_hora
- ubicación

Y además puede mandar:
- correo
- descripción
- fotos

### Formatos admitidos
- `application/json`
- `multipart/form-data`

### Qué suele devolver
- mensaje de creación correcta
- datos del avistamiento creado

### Se usa en
- formulario “He visto esta mascota”

---

# 6. Contacto sobre una mascota

## POST /api/mascotas/{id}/contactos
**Tipo:** pública  
**Sirve para:** enviar un mensaje al usuario que publicó la mascota.

### Lo puede usar
- un usuario logueado
- una persona sin cuenta

### Qué suele mandar el frontend
```json
{
  "nombre": "Juan",
  "correo": "juan@email.com",
  "telefono": "600000000",
  "mensaje": "Creo que la vi por el parque"
}
```

### Qué suele devolver
- mensaje de envío correcto
- id del mensaje creado

### Se usa en
- botón o formulario “Contactar” del detalle de mascota

---

# 7. Reportes de anuncios

## POST /api/mascotas/{id}/reportes
**Tipo:** pública  
**Sirve para:** reportar un anuncio desde frontend.

### Lo puede usar
- un usuario logueado
- una persona sin cuenta

### Qué suele mandar el frontend
```json
{
  "asunto": "Anuncio sospechoso",
  "motivo": "fraude",
  "mensaje": "El contenido no parece real",
  "nombre": "Ana",
  "correo": "ana@email.com",
  "telefono": "600000000"
}
```

### Qué suele devolver
- mensaje de envío correcto
- id del reporte creado

### Se usa en
- acción “Reportar anuncio”

---

# 8. Soporte general

## POST /api/soporte
**Tipo:** pública  
**Sirve para:** enviar un mensaje al soporte general de la aplicación.

### Qué suele mandar el frontend
```json
{
  "asunto": "Problema con mi cuenta",
  "categoria": "GENERAL",
  "mensaje": "No puedo acceder a una sección",
  "nombre": "Cesar",
  "correo": "cesar@email.com",
  "telefono": "600000000"
}
```

### Qué suele devolver
- mensaje de envío correcto
- id del mensaje creado

### Se usa en
- formulario de contacto o soporte general

---

# 9. Catálogos

## GET /api/colores
**Tipo:** pública  
**Sirve para:** listar colores disponibles.

### Se usa en
- formularios de mascota
- filtros

---

## GET /api/colores/{id}
**Tipo:** pública  
**Sirve para:** obtener un color concreto.

---

## GET /api/especies
**Tipo:** pública  
**Sirve para:** listar especies.

### Se usa en
- formularios
- filtros

---

## GET /api/razas
**Tipo:** pública  
**Sirve para:** listar razas.

### Query opcional
- `especie_id`

### Se usa en
- formularios
- filtros dependientes por especie

---

## GET /api/provincias
**Tipo:** pública  
**Sirve para:** listar provincias existentes en `ubicaciones`.

### Qué suele devolver
Un array simple de textos, por ejemplo:
- Murcia
- Alicante
- Valencia

### Se usa en
- select de provincias
- filtros de búsqueda
- formularios con ubicación

---

## GET /api/municipios
**Tipo:** pública  
**Sirve para:** listar municipios existentes en `ubicaciones`.

### Query opcional
- `provincia`

### Ejemplos
GET /api/municipios
GET /api/municipios?provincia=Murcia

# 10. Usuarios públicos

## POST /api/usuarios
**Tipo:** pública  
**Sirve para:** registrar un nuevo usuario.

### Qué manda el frontend
```json
{
  "nombre": "Cesar",
  "apellidos": "Ruiz",
  "correo": "cesar@email.com",
  "telefono": "600000000",
  "direccion": "Murcia",
  "password": "123456"
}
```

### Importante
Aunque el frontend mande un rol, el backend lo ignora y fuerza siempre `USUARIO`.

### Qué suele devolver
- mensaje de creación correcta
- id del usuario creado

### Se usa en
- pantalla de registro

---

# 11. Panel admin

## GET /api/admin/anuncios
**Tipo:** admin  
**Sirve para:** listar anuncios para moderación.

### Qué suele devolver
- lista de anuncios con datos del anuncio, usuario, estado y publicación

### Se usa en
- panel de moderación

---

## PATCH /api/admin/anuncios/{id}/estado
**Tipo:** admin  
**Sirve para:** cambiar el estado de publicación de un anuncio.

### Qué manda el frontend
```json
{
  "estado_publicacion": "OCULTO"
}
```

### Valores válidos
- `PUBLICADO`
- `OCULTO`

### Se usa en
- acciones de moderación del panel admin

---

## DELETE /api/admin/anuncios/{id}
**Tipo:** admin  
**Sirve para:** eliminar un anuncio desde administración.

### Se usa en
- acciones destructivas del panel admin

---

## GET /api/admin/reportes
**Tipo:** admin  
**Sirve para:** listar reportes enviados sobre anuncios.

### Qué suele devolver
- lista de reportes con relaciones y estado

### Se usa en
- panel admin de reportes

---

## PATCH /api/admin/reportes/{id}/estado
**Tipo:** admin  
**Sirve para:** actualizar el estado de un reporte.

### Qué manda el frontend
```json
{
  "estado": "REVISADO",
  "notas_admin": "Revisado por el equipo"
}
```

### Valores válidos
- `PENDIENTE`
- `REVISADO`
- `DESCARTADO`

### Se usa en
- flujo de revisión de reportes

---

## GET /api/admin/soporte
**Tipo:** admin  
**Sirve para:** listar mensajes de soporte.

### Qué suele devolver
- lista de tickets o mensajes con su estado

### Se usa en
- panel admin de soporte

---

## PATCH /api/admin/soporte/{id}/estado
**Tipo:** admin  
**Sirve para:** cambiar el estado de un mensaje de soporte.

### Qué manda el frontend
```json
{
  "estado": "CERRADO",
  "notas_admin": "Incidencia resuelta"
}
```

### Valores válidos
- `ABIERTO`
- `CERRADO`

### Se usa en
- gestión de soporte

---

## GET /api/admin/usuarios
**Tipo:** admin  
**Sirve para:** listar usuarios para gestión administrativa.

### Qué suele devolver
- lista de usuarios con estado y datos básicos

### Se usa en
- panel admin de usuarios

---

## PATCH /api/admin/usuarios/{id}/estado
**Tipo:** admin  
**Sirve para:** activar o desactivar un usuario.

### Qué manda el frontend
```json
{
  "activo": 0
}
```

### Valores válidos
- `1` activo
- `0` inactivo

### Se usa en
- bloquear o reactivar usuarios desde administración