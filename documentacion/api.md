# API - Mascotas WebApp

## 1. Qué es este archivo

Documentación sobre como usar api


---

## 2. Base URL en local

```txt
http://localhost:3000
```

Servicios del entorno local:
- Backend API: `http://localhost:3000`
- phpMyAdmin: `http://localhost:8081`
- MySQL: `localhost:3306`

---

## 3. Autenticación

### Cómo funciona

Las rutas privadas usan token.

El frontend debe guardar el token que devuelve el login y enviarlo en la cabecera `Authorization`.

Ejemplo:

```http
Authorization: Bearer TU_TOKEN
```

### Qué rutas son privadas

Son privadas las rutas que llevan información del usuario autenticado o que modifican recursos propios.

Ejemplos:
- `/api/auth/me`
- `/api/auth/logout`
- `/api/me/...`
- crear mascota
- editar mascota propia
- borrar mascota propia
- marcar mascota como recuperada
- subir fotos a mascota propia

### Qué rutas son públicas

Son públicas las que puede usar cualquier persona aunque no tenga sesión iniciada.

Ejemplos:
- listar mascotas
- ver detalle de una mascota
- ver avistamientos de una mascota
- crear avistamiento
- enviar mensaje de contacto sobre una mascota
- catálogos
- crear usuario
- login

---

## 4. Formato general de respuestas

### Respuesta de éxito simple

```json
{
  "success": true,
  "data": {}
}
```

### Respuesta de éxito con mensaje

```json
{
  "success": true,
  "message": "Operación realizada correctamente",
  "data": {}
}
```

### Error simple

```json
{
  "success": false,
  "message": "Mensaje de error"
}
```

### Error de validación

```json
{
  "success": false,
  "errors": [
    "Campo obligatorio",
    "Otro error"
  ]
}
```

---

## 5. Códigos HTTP que más se usan

- `200` OK
- `201` Creado correctamente
- `401` No autenticado
- `403` Autenticado pero sin permiso
- `404` Recurso no encontrado
- `422` Error de validación
- `500` Error interno del servidor

---

## 6. Content-Type

### application/json
Se usa en la mayoría de formularios normales.

### multipart/form-data
Se usa cuando se envían archivos.

En este proyecto se usa sobre todo en:
- `POST /api/mascotas/{id}/fotos`
- `POST /api/mascotas/{id}/avistamientos` si además del texto se mandan fotos

---

## 7. Reglas de negocio importantes

### Estados de mascota
Valores válidos:
- `PERDIDA`
- `ENCONTRADA`
- `RECUPERADA`

### Sexo
Valores válidos:
- `MACHO`
- `HEMBRA`
- `DESCONOCIDO`

### Tamaño
Valores válidos:
- `PEQUENO`
- `MEDIANO`
- `GRANDE`
- `DESCONOCIDO`

### Fotos de mascota
Una mascota se crea primero sin fotos y luego las fotos se suben con otro endpoint.

### Avistamientos
Un avistamiento puede crearlo:
- un usuario logueado
- una persona pública sin cuenta

Si el usuario está logueado, el backend guarda su `usuario_id`.
Si no está logueado, `usuario_id` queda a `null`.

### Mensajes de contacto
Un mensaje de contacto sobre una mascota también puede enviarlo:
- un usuario logueado
- una persona pública sin cuenta

Si el usuario está logueado, el backend guarda `usuario_remitente_id`.
Si no está logueado, ese campo queda a `null`.

### Cambio de contraseña
Cambiar la contraseña **no cierra la sesión actual automáticamente**.
Eso hay que tenerlo en cuenta en frontend y también en pruebas.

### Usuarios públicos
Actualmente existen endpoints públicos de usuarios porque todavía no está cerrada la parte de administración. De momento se documentan tal cual están en el backend.

---

# 8. Endpoints

---

## 8.1 Autenticación

### POST /api/auth/login

Inicia sesión y devuelve token.

**Privada:** no

**Body JSON**

```json
{
  "correo": "usuario@correo.com",
  "password": "123456"
}
```

**Éxito**

```json
{
  "success": true,
  "message": "Login correcto",
  "data": {
    "token": "TOKEN_AQUI",
    "usuario": {
      "id": 1,
      "nombre": "Cesar",
      "apellidos": "Ruiz",
      "correo": "usuario@correo.com",
      "telefono": "600000000",
      "direccion": "Murcia",
      "rol": "USUARIO"
    }
  }
}
```

**Errores comunes**
- `422` si falta correo o password
- `401` si las credenciales no son válidas

**Uso frontend**
- pantalla de login
- guardar token en almacenamiento del frontend

---

### GET /api/auth/me

Devuelve el usuario autenticado actual a partir del token.

**Privada:** sí

**Headers**

```http
Authorization: Bearer TU_TOKEN
```

**Éxito**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Cesar",
    "apellidos": "Ruiz",
    "correo": "usuario@correo.com",
    "telefono": "600000000",
    "direccion": "Murcia",
    "rol": "USUARIO"
  }
}
```

**Uso frontend**
- recuperar sesión al recargar la app
- saber si el usuario está logueado
- pintar cabecera o menú privado

---

### POST /api/auth/logout

Cierra sesión invalidando el token guardado en base de datos.

**Privada:** sí

**Headers**

```http
Authorization: Bearer TU_TOKEN
```

**Body**
No necesita body.

**Éxito**

```json
{
  "success": true,
  "message": "Logout correcto"
}
```

**Uso frontend**
- botón cerrar sesión
- limpiar token guardado en frontend

---

## 8.2 Zona privada del usuario autenticado

### GET /api/me/perfil

Devuelve el perfil privado completo del usuario autenticado.

**Privada:** sí

**Éxito**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Cesar",
    "apellidos": "Ruiz",
    "correo": "usuario@correo.com",
    "telefono": "600000000",
    "direccion": "Murcia",
    "fecha_registro": "2026-04-06 10:00:00",
    "rol": "USUARIO",
    "email_verificado": 0,
    "activo": 1
  }
}
```

**Uso frontend**
- pantalla “Mi perfil”
- rellenar formulario inicial del perfil

---

### PUT /api/me/perfil

Actualiza los datos editables del perfil.

**Privada:** sí

**Body JSON**

```json
{
  "nombre": "Cesar",
  "apellidos": "Ruiz",
  "correo": "usuario@correo.com",
  "telefono": "600000000",
  "direccion": "Murcia"
}
```

**Campos obligatorios**
- `nombre`
- `correo`

**Campos opcionales**
- `apellidos`
- `telefono`
- `direccion`

**Éxito**

```json
{
  "success": true,
  "message": "Perfil actualizado correctamente",
  "data": {
    "id": 1,
    "nombre": "Cesar",
    "apellidos": "Ruiz",
    "correo": "usuario@correo.com",
    "telefono": "600000000",
    "direccion": "Murcia",
    "fecha_registro": "2026-04-06 10:00:00",
    "rol": "USUARIO",
    "email_verificado": 0,
    "activo": 1
  }
}
```

**Errores comunes**
- `422` si falta nombre o correo
- `422` si el correo no es válido
- `422` si el correo ya lo usa otro usuario

**Uso frontend**
- formulario “Mi perfil”
- guardar cambios del perfil

---

### PATCH /api/me/password

Cambia la contraseña del usuario autenticado.

**Privada:** sí

**Body JSON**

```json
{
  "current_password": "claveActual123",
  "new_password": "claveNueva123",
  "new_password_confirm": "claveNueva123"
}
```

**Reglas de validación**
- `current_password` obligatoria
- `new_password` obligatoria
- mínimo 6 caracteres
- `new_password_confirm` obligatoria
- la nueva contraseña y la confirmación deben coincidir
- la nueva contraseña no puede ser igual a la actual

**Éxito**

```json
{
  "success": true,
  "message": "Contraseña actualizada correctamente"
}
```

**Importante**
La sesión actual sigue abierta. El token actual sigue siendo válido hasta que se haga logout.

**Uso frontend**
- formulario “Seguridad”

---

### DELETE /api/me/cuenta

Desactiva la cuenta del usuario autenticado y limpia el token.

**Privada:** sí

**Body**
No necesita body.

**Éxito**

```json
{
  "success": true,
  "message": "Cuenta desactivada correctamente"
}
```

**Importante**
Esto es una baja lógica, no un borrado físico completo de todos los datos.

**Uso frontend**
- botón “Eliminar cuenta”
- después de esto, en frontend conviene limpiar token y enviar al usuario a login o a home

---

### GET /api/me/mascotas

Devuelve las mascotas publicadas por el usuario autenticado, en formato tarjeta.

**Privada:** sí

**Respuesta típica**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Luna",
      "estado": "PERDIDA",
      "raza_nombre": "Labrador",
      "especie_nombre": "Perro",
      "municipio": "Murcia",
      "provincia": "Murcia",
      "fecha_evento": "2026-04-01",
      "tipo_fecha_evento": "PERDIDA",
      "foto_principal_url": "/uploads/mascotas/luna.jpg"
    }
  ]
}
```

**Uso frontend**
- sección “Mis mascotas”
- listado privado del perfil
- tarjetas con botón editar, borrar o marcar recuperada

---

### GET /api/me/avistamientos

Devuelve los avistamientos creados por el usuario autenticado.

**Privada:** sí

**Respuesta típica**

```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "mascota_id": 3,
      "mascota_nombre": "Luna",
      "estado_mascota": "PERDIDA",
      "fecha_hora": "2026-04-05 18:20:00",
      "descripcion": "La vi cerca del parque",
      "direccion_formateada": "Murcia",
      "municipio": "Murcia",
      "provincia": "Murcia",
      "latitud": 37.99,
      "longitud": -1.13,
      "foto_avistamiento_url": "/uploads/avistamientos/a1.jpg",
      "foto_mascota_url": "/uploads/mascotas/luna.jpg"
    }
  ]
}
```

**Uso frontend**
- sección “Mis avistamientos”

---

### GET /api/me/notificaciones

Devuelve el centro de notificaciones del usuario autenticado.

Incluye:
- resumen con contadores
- mensajes de contacto recibidos
- avistamientos recibidos sobre sus mascotas

**Privada:** sí

**Respuesta típica**

```json
{
  "success": true,
  "data": {
    "resumen": {
      "total_no_leidas": 4,
      "contactos_no_leidos": 1,
      "avistamientos_no_leidos": 3
    },
    "contactos": [
      {
        "id": 10,
        "mascota_id": 3,
        "usuario_destinatario_id": 1,
        "usuario_remitente_id": null,
        "nombre": "Ana",
        "correo": "ana@correo.com",
        "telefono": "611111111",
        "mensaje": "Creo que la vi en la zona norte",
        "leido_destinatario": 0,
        "fecha_creacion": "2026-04-06 11:20:00",
        "fecha_leido": null,
        "mascota_nombre": "Luna",
        "mascota_estado": "PERDIDA",
        "foto_mascota_url": "/uploads/mascotas/luna.jpg"
      }
    ],
    "avistamientos": [
      {
        "id": 8,
        "mascota_id": 3,
        "usuario_remitente_id": null,
        "telefono": "622222222",
        "correo": "persona@correo.com",
        "descripcion": "La vi cerca de una gasolinera",
        "fecha_hora": "2026-04-05 18:20:00",
        "leido_propietario": 0,
        "fecha_leido_propietario": null,
        "mascota_nombre": "Luna",
        "mascota_estado": "PERDIDA",
        "direccion_formateada": "Murcia",
        "municipio": "Murcia",
        "provincia": "Murcia",
        "codigo_postal": "30001",
        "pais": "España",
        "latitud": 37.99,
        "longitud": -1.13,
        "ubicacion_descripcion": "Junto al parque",
        "foto_avistamiento_url": "/uploads/avistamientos/a1.jpg",
        "foto_mascota_url": "/uploads/mascotas/luna.jpg"
      }
    ]
  }
}
```

**Uso frontend**
- centro de notificaciones del perfil
- pestaña de avisos y mensajes

---

### PATCH /api/me/notificaciones/contactos/{id}/leer

Marca un mensaje de contacto como leído.

**Privada:** sí

**Body**
No necesita body.

**Éxito**

```json
{
  "success": true,
  "message": "Mensaje marcado como leído"
}
```

**Errores comunes**
- `404` si el mensaje no existe
- `403` si no pertenece al usuario destinatario

---

### PATCH /api/me/notificaciones/avistamientos/{id}/leer

Marca un avistamiento recibido como leído por el dueño de la mascota.

**Privada:** sí

**Body**
No necesita body.

**Éxito**

```json
{
  "success": true,
  "message": "Avistamiento marcado como leído"
}
```

**Errores comunes**
- `404` si el avistamiento no existe
- `403` si el avistamiento no corresponde a una mascota del usuario

---

## 8.3 Mascotas públicas y privadas

### GET /api/mascotas

Listado general de mascotas con filtros, orden y paginación.

**Privada:** no

**Query params admitidos**
- `estado`
- `especie_id`
- `raza_id`
- `sexo`
- `tamano`
- `municipio`
- `provincia`
- `q_ubicacion`
- `fecha_desde`
- `fecha_hasta`
- `color_ids`
- `tiene_chip`
- `con_fotos`
- `orden`
- `page`
- `limit`

**Valores válidos importantes**
- `estado`: `PERDIDA`, `ENCONTRADA`, `RECUPERADA`
- `sexo`: `MACHO`, `HEMBRA`, `DESCONOCIDO`
- `tamano`: `PEQUENO`, `MEDIANO`, `GRANDE`, `DESCONOCIDO`
- `orden`: `recientes`, `antiguos`, `nombre_asc`, `nombre_desc`

**Ejemplo**

```txt
GET /api/mascotas?estado=PERDIDA&provincia=Murcia&page=1&limit=12
```

**Respuesta típica**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Luna",
      "estado": "PERDIDA",
      "sexo": "HEMBRA",
      "tamano": "MEDIANO",
      "tiene_chip": true,
      "recompensa": 100,
      "raza_id": 2,
      "raza_nombre": "Labrador",
      "especie_id": 1,
      "especie_nombre": "Perro",
      "municipio": "Murcia",
      "provincia": "Murcia",
      "direccion_formateada": "Murcia",
      "latitud": 37.99,
      "longitud": -1.13,
      "fecha_evento": "2026-04-01",
      "tipo_fecha_evento": "PERDIDA",
      "foto_principal_url": "/uploads/mascotas/luna.jpg"
    }
  ],
  "meta": {
    "total": 40,
    "page": 1,
    "limit": 12,
    "pages": 4,
    "has_next_page": true,
    "has_prev_page": false,
    "filters": {
      "estado": "PERDIDA"
    }
  }
}
```

**Uso frontend**
- tablón principal
- filtros
- búsquedas
- paginación

---

### GET /api/mascotas/recientes

Devuelve tarjetas recientes para la home.

**Privada:** no

**Query params**
- `limit` opcional

**Ejemplo**

```txt
GET /api/mascotas/recientes?limit=4
```

**Uso frontend**
- bloque “anuncios recientes” de la home

---

### GET /api/mascotas/{id}

Devuelve el detalle completo de una mascota.

**Privada:** no

**Incluye**
- datos principales de la mascota
- ubicación
- colores
- fotos de la mascota
- dueño del anuncio
- avistamientos asociados
- fotos de cada avistamiento

**Importante**
En este proyecto, el detalle público de la mascota sí puede devolver correo y teléfono del dueño porque así se ha decidido para facilitar el contacto también fuera de la app.

**Respuesta típica resumida**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "usuario_id": 1,
    "nombre": "Luna",
    "raza_id": 2,
    "sexo": "HEMBRA",
    "tiene_chip": true,
    "tamano": "MEDIANO",
    "peso": 12.5,
    "descripcion": "Se perdió cerca del parque",
    "estado": "PERDIDA",
    "fecha_registro": "2026-04-01 10:00:00",
    "fecha_perdida": "2026-04-01",
    "fecha_encontrada": null,
    "fecha_recuperada": null,
    "fecha_nacimiento": "2023-05-10",
    "recompensa": 100,
    "raza_nombre": "Labrador",
    "especie_id": 1,
    "especie_nombre": "Perro",
    "ubicacion_id": 5,
    "direccion_formateada": "Murcia",
    "municipio": "Murcia",
    "provincia": "Murcia",
    "codigo_postal": "30001",
    "pais": "España",
    "latitud": 37.99,
    "longitud": -1.13,
    "ubicacion_descripcion": "Parque",
    "colores": [
      { "id": 1, "nombre": "Negro" }
    ],
    "fotos": [
      {
        "id": 20,
        "url": "/uploads/mascotas/luna.jpg",
        "es_principal": 1,
        "orden": 0
      }
    ],
    "dueno": {
      "id": 1,
      "nombre": "Cesar",
      "apellidos": "Ruiz",
      "correo": "usuario@correo.com",
      "telefono": "600000000"
    },
    "avistamientos": [
      {
        "id": 8,
        "mascota_id": 1,
        "usuario_id": null,
        "telefono": "622222222",
        "correo": "persona@correo.com",
        "descripcion": "La vi cerca de una gasolinera",
        "fecha_hora": "2026-04-05 18:20:00",
        "leido_propietario": 0,
        "fecha_leido_propietario": null,
        "ubicacion_id": 10,
        "direccion_formateada": "Murcia",
        "municipio": "Murcia",
        "provincia": "Murcia",
        "codigo_postal": "30001",
        "pais": "España",
        "latitud": 37.99,
        "longitud": -1.13,
        "ubicacion_descripcion": "Junto al parque",
        "fotos": []
      }
    ]
  }
}
```

**Uso frontend**
- página de detalle
- mapa
- ficha completa de la mascota
- datos de contacto

---

### POST /api/mascotas

Crea una mascota nueva.

**Privada:** sí

**Body JSON**

```json
{
  "nombre": "Luna",
  "raza_id": 2,
  "sexo": "HEMBRA",
  "tiene_chip": true,
  "tamano": "MEDIANO",
  "peso": 12.5,
  "fecha_nacimiento": "2023-05-10",
  "descripcion": "Se perdió cerca del parque",
  "fecha_perdida": "2026-03-27",
  "fecha_encontrada": null,
  "fecha_recuperada": null,
  "estado": "PERDIDA",
  "recompensa": 100,
  "colores": [1, 3],
  "ubicacion": {
    "latitud": 37.99,
    "longitud": -1.13,
    "direccion_formateada": "Murcia",
    "municipio": "Murcia",
    "provincia": "Murcia",
    "codigo_postal": "30001",
    "pais": "España",
    "descripcion": "Parque"
  }
}
```

**Importante**
Aunque el frontend mande `usuario_id`, el backend usa siempre el usuario del token.

**Validaciones importantes**
- `nombre` obligatorio
- `raza_id` obligatorio
- `sexo` obligatorio
- `tamano` obligatorio
- `descripcion` obligatoria
- `estado` obligatorio
- `colores` obligatorio y debe ser array
- al menos 1 color válido
- máximo 5 colores
- `ubicacion` obligatoria
- según el estado, la fecha correspondiente también es obligatoria:
  - si `PERDIDA` → `fecha_perdida`
  - si `ENCONTRADA` → `fecha_encontrada`
  - si `RECUPERADA` → `fecha_recuperada`

**Éxito**

```json
{
  "success": true,
  "message": "Mascota creada correctamente",
  "data": {
    "id": 12,
    "ubicacion_id": 18,
    "colores": [1, 3]
  }
}
```

**Uso frontend**
- formulario “Publicar mascota”

---

### POST /api/mascotas/{id}/fotos

Sube fotos de una mascota ya creada.

**Privada:** sí

**Content-Type**
`multipart/form-data`

**Campos**
- `fotos[]` archivos de imagen

**Importante**
Solo puede subir fotos el propietario de la mascota.

**Uso frontend**
- segundo paso después de crear mascota
- galería o edición de fotos

---

### PUT /api/mascotas/{id}

Actualiza una mascota propia.

**Privada:** sí

**Body JSON**
Muy parecido al de creación.

Se recomienda mandar todos los campos editables de la mascota y de la ubicación.

**Importante**
- solo el propietario puede editar
- el backend fuerza el `usuario_id` del token

**Uso frontend**
- formulario de edición de mascota

---

### DELETE /api/mascotas/{id}

Borra una mascota propia.

**Privada:** sí

**Body**
No necesita body.

**Importante**
Solo puede borrar el propietario.

**Uso frontend**
- botón eliminar publicación

---

### PATCH /api/mascotas/{id}/recuperar

Marca una mascota propia como recuperada.

**Privada:** sí

**Body**
No necesita body.

**Importante**
Solo puede hacerlo el propietario.

**Uso frontend**
- botón “Marcar como recuperada” en “Mis mascotas” o en el detalle privado

---

## 8.4 Avistamientos

### GET /api/mascotas/{id}/avistamientos

Devuelve los avistamientos asociados a una mascota.

**Privada:** no

**Respuesta típica**

```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "mascota_id": 3,
      "usuario_id": null,
      "telefono": "622222222",
      "correo": "persona@correo.com",
      "descripcion": "La vi cerca del parque",
      "fecha_hora": "2026-04-05 18:20:00",
      "leido_propietario": 0,
      "fecha_leido_propietario": null,
      "ubicacion_id": 10,
      "direccion_formateada": "Murcia",
      "municipio": "Murcia",
      "provincia": "Murcia",
      "codigo_postal": "30001",
      "pais": "España",
      "latitud": 37.99,
      "longitud": -1.13,
      "ubicacion_descripcion": "Junto al parque",
      "fotos": []
    }
  ]
}
```

**Uso frontend**
- listado de avistamientos en el detalle de la mascota
- mapa de avistamientos

---

### POST /api/mascotas/{id}/avistamientos

Crea un avistamiento para una mascota concreta.

**Privada:** no, pero también admite usuario logueado

**Casos posibles**
- persona pública sin cuenta
- usuario autenticado con token

**Si hay token**
- el backend guarda `usuario_id`
- si faltan teléfono o correo, el backend puede completarlos con los datos del usuario autenticado

**Si no hay token**
- `usuario_id` queda a `null`

**Body JSON**

```json
{
  "telefono": "622222222",
  "correo": "persona@correo.com",
  "descripcion": "La vi cerca de una gasolinera",
  "fecha_hora": "2026-04-05 18:20:00",
  "ubicacion": {
    "latitud": 37.99,
    "longitud": -1.13,
    "direccion_formateada": "Murcia",
    "municipio": "Murcia",
    "provincia": "Murcia",
    "codigo_postal": "30001",
    "pais": "España",
    "descripcion": "Junto al parque"
  }
}
```

**Si se quieren subir fotos**
También puede enviarse como `multipart/form-data` con los campos de texto y además:
- `fotos[]`

**Validaciones importantes**
- `telefono` obligatorio
- `correo` opcional, pero si viene debe ser válido
- `fecha_hora` obligatoria
- `ubicacion` obligatoria
- `ubicacion.latitud` obligatoria y numérica
- `ubicacion.longitud` obligatoria y numérica
- `ubicacion.municipio` obligatoria
- `ubicacion.provincia` obligatoria

**Éxito**

```json
{
  "success": true,
  "message": "Avistamiento creado correctamente",
  "data": {
    "id": 8,
    "mascota_id": 3,
    "usuario_id": null,
    "ubicacion_id": 10
  }
}
```

**Uso frontend**
- formulario “Registrar avistamiento”
- lo puede usar tanto usuario externo como usuario logueado

---

## 8.5 Contacto sobre una mascota

### POST /api/mascotas/{id}/contactos

Envía un mensaje de contacto sobre una mascota concreta.

**Privada:** no, pero también admite usuario logueado

**Casos posibles**
- persona pública sin cuenta
- usuario autenticado con token

**Si hay token**
- el backend guarda `usuario_remitente_id`
- si faltan nombre, correo o teléfono, puede completarlos con datos del perfil

**Si no hay token**
- `usuario_remitente_id` queda a `null`

**Body JSON**

```json
{
  "nombre": "Ana",
  "correo": "ana@correo.com",
  "telefono": "611111111",
  "mensaje": "Creo que la vi en la zona norte"
}
```

**Validaciones importantes**
- `nombre` obligatorio
- `correo` obligatorio y válido
- `telefono` obligatorio
- `mensaje` obligatorio

**Éxito**

```json
{
  "success": true,
  "message": "Mensaje de contacto enviado correctamente",
  "data": {
    "id": 10,
    "mascota_id": 3,
    "usuario_destinatario_id": 1,
    "usuario_remitente_id": null
  }
}
```

**Uso frontend**
- formulario “Contactar” desde el detalle de una mascota
- también sirve para mensajes de una persona externa a la aplicación

---

## 8.6 Catálogos

### GET /api/colores

Devuelve todos los colores.

**Privada:** no

**Respuesta típica**

```json
{
  "success": true,
  "data": [
    { "id": 1, "nombre": "Negro" },
    { "id": 2, "nombre": "Blanco" }
  ]
}
```

**Uso frontend**
- select múltiple de colores
- filtros

---

### GET /api/colores/{id}

Devuelve un color por id.

**Privada:** no

---

### GET /api/especies

Devuelve todas las especies.

**Privada:** no

**Uso frontend**
- select de especies

---

### GET /api/razas

Devuelve razas.

**Privada:** no

**Query params**
- `especie_id` opcional

**Ejemplo**

```txt
GET /api/razas?especie_id=1
```

**Uso frontend**
- select dependiente de razas

---

## 8.7 Usuarios

### GET /api/usuarios

Devuelve el listado de usuarios.

**Privada:** no actualmente

**Nota**
Este endpoint está así ahora mismo porque la parte de administración todavía no está cerrada. Se documenta tal cual existe en backend.

---

### GET /api/usuarios/{id}

Devuelve un usuario por id.

**Privada:** no actualmente

**Nota**
Igual que el endpoint anterior, se deja documentado porque existe en backend aunque más adelante probablemente se revise.

---

### POST /api/usuarios

Crea un usuario nuevo.

**Privada:** no

**Body JSON**

```json
{
  "nombre": "Cesar",
  "apellidos": "Ruiz",
  "correo": "usuario@correo.com",
  "telefono": "600000000",
  "direccion": "Murcia",
  "password": "123456"
}
```

**Validación actual**
En controlador solo se exige:
- `nombre`
- `correo`
- `password`

Los demás campos pueden ir vacíos.

**Éxito**

```json
{
  "success": true,
  "message": "Usuario creado correctamente",
  "data": {
    "id": 15
  }
}
```

**Uso frontend**
- registro de usuario

---

# 9. Ejemplos de flujos reales de frontend

## Flujo A: login y perfil

1. `POST /api/auth/login`
2. guardar token
3. `GET /api/auth/me`
4. `GET /api/me/perfil`
5. si se edita el perfil → `PUT /api/me/perfil`
6. si se cambia contraseña → `PATCH /api/me/password`
7. si se cierra sesión → `POST /api/auth/logout`

---

## Flujo B: publicar una mascota

1. usuario logueado
2. `POST /api/mascotas`
3. guardar el `id` de la mascota creada
4. `POST /api/mascotas/{id}/fotos`
5. refrescar con `GET /api/me/mascotas` o `GET /api/mascotas/{id}`

---

## Flujo C: usuario externo registra un avistamiento

1. abre el detalle con `GET /api/mascotas/{id}`
2. manda formulario a `POST /api/mascotas/{id}/avistamientos`
3. no necesita cuenta ni token
4. el dueño lo verá luego en `GET /api/me/notificaciones`

---

## Flujo D: usuario externo envía un mensaje de contacto

1. abre el detalle con `GET /api/mascotas/{id}`
2. manda formulario a `POST /api/mascotas/{id}/contactos`
3. no necesita cuenta ni token
4. el dueño lo verá luego en `GET /api/me/notificaciones`

---

## Flujo E: centro de notificaciones

1. usuario logueado llama a `GET /api/me/notificaciones`
2. pinta resumen, contactos y avistamientos
3. si abre un contacto → `PATCH /api/me/notificaciones/contactos/{id}/leer`
4. si abre un avistamiento → `PATCH /api/me/notificaciones/avistamientos/{id}/leer`

---

# 10. Consejos para frontend

- Centralizar el token en un solo sitio.
- Hacer una función común para meter el header `Authorization` en rutas privadas.
- En formularios, mostrar los errores de `422` tal como llegan en `errors[]`.
- En las pantallas privadas, si llega `401`, redirigir a login.
- Después de crear, editar o borrar, refrescar la vista con el GET correspondiente.
- En avistamientos, si se van a subir fotos, recordar que el envío pasa a `multipart/form-data`.
- Para filtros, construir la query string solo con los campos que estén informados.

---

# 11. Checklist rápida para el compañero de frontend

## Sin token
Puede usar:
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

## Con token
Además de lo anterior, puede usar:
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

# 12. Última nota

Si en el futuro cambia algo del backend, este archivo hay que actualizarlo a la vez. La documentación útil no es la más bonita, sino la que coincide de verdad con el código actual.
