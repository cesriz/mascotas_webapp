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

### Qué suele devolver
Una lista de mascotas con datos resumidos, por ejemplo:
- id
- nombre
- estado
- especie/raza si aplica
- ubicación resumida
- foto principal

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
- datos del usuario que publicó

### Importante
En este proyecto, en el detalle se pueden mostrar también:
- correo del usuario que publicó
- teléfono del usuario que publicó

### Se usa en
- pantalla detalle de mascota

---

# 4. Mascotas privadas

## POST /api/mascotas
**Tipo:** privada  
**Sirve para:** crear una nueva publicación de mascota.

### Qué manda el frontend
Los datos del formulario de alta de mascota.

### Qué suele devolver
- mensaje de creación correcta
- id de la nueva mascota

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
- archivos de imagen

### Qué suele devolver
- mensaje de subida correcta
- lista de fotos guardadas o datos relacionados

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
- fotos del avistamiento si tiene
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
Como mínimo, según tu lógica actual:
- teléfono
- fecha_hora
- ubicación

Y además puede mandar:
- correo
- descripción
- fotos

### Si va con imágenes
Se puede enviar como `multipart/form-data`.

### Qué suele devolver
- mensaje de creación correcta
- id del avistamiento
- id de la mascota

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

# 7. Catálogos

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

### Se usa en
- formularios
- filtros

---

# 8. Usuarios

## GET /api/usuarios
**Tipo:** pública  
**Sirve para:** listar usuarios.

### Importante
De momento este endpoint sigue existiendo porque la parte de administración todavía no está cerrada.

---

## GET /api/usuarios/{id}
**Tipo:** pública  
**Sirve para:** ver un usuario concreto.

### Importante
Igual que el anterior, de momento se deja documentado tal cual existe en backend.

---

## POST /api/usuarios
**Tipo:** pública  
**Sirve para:** registrar un nuevo usuario.

### Qué manda el frontend
Los datos del formulario de registro.

### Qué suele devolver
- mensaje de usuario creado
- id del nuevo usuario

### Se usa en
- pantalla de registro

---

# 9. Resumen ultra rápido

## Públicas
- `POST /api/auth/login`
- `GET /api/mascotas`
- `GET /api/mascotas/recientes`
- `GET /api/mascotas/{id}`
- `GET /api/mascotas/{id}/avistamientos`
- `POST /api/mascotas/{id}/avistamientos`
- `POST /api/mascotas/{id}/contactos`
- `GET /api/colores`
- `GET /api/colores/{id}`
- `GET /api/especies`
- `GET /api/razas`
- `GET /api/usuarios`
- `GET /api/usuarios/{id}`
- `POST /api/usuarios`

## Privadas
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/me/perfil`
- `PUT /api/me/perfil`
- `PATCH /api/me/password`
- `DELETE /api/me/cuenta`
- `GET /api/me/mascotas`
- `GET /api/me/avistamientos`
- `GET /api/me/notificaciones`
- `PATCH /api/me/notificaciones/contactos/{id}/leer`
- `PATCH /api/me/notificaciones/avistamientos/{id}/leer`
- `POST /api/mascotas`
- `PUT /api/mascotas/{id}`
- `POST /api/mascotas/{id}/fotos`
- `DELETE /api/mascotas/{id}`
- `PATCH /api/mascotas/{id}/recuperar`

---

# 10. Qué documento mirar según lo que necesites

Si quieres una visión rápida, usa este archivo.

Si quieres ver:
- ejemplos más completos
- cuerpos detallados
- respuestas más largas
- reglas de negocio explicadas con más detalle

entonces mira:

```txt
documentacion/api.md
```
