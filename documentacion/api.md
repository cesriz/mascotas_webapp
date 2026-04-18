# API - Mascotas WebApp

## 1. Qué es este archivo

Documentación más completa de la API REST del proyecto.

Recoge las rutas activas que aparecen en el backend, cómo se usan desde frontend y qué validaciones o comportamientos importantes conviene tener en cuenta.

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

Son privadas las rutas que usan el usuario autenticado o que modifican recursos propios.

Ejemplos:
- `/api/auth/me`
- `/api/auth/logout`
- `/api/me/...`
- crear mascota
- editar mascota propia
- borrar mascota propia
- marcar mascota como recuperada
- subir fotos a mascota propia

### Qué rutas son admin

Además de estar autenticadas, requieren rol `ADMIN`.

Ejemplos:
- `/api/admin/anuncios`
- `/api/admin/reportes`
- `/api/admin/soporte`
- `/api/admin/usuarios`

### Qué rutas son públicas

Son públicas las que puede usar cualquier persona aunque no tenga sesión iniciada.

Ejemplos:
- listar mascotas
- ver detalle de una mascota
- ver avistamientos de una mascota
- crear avistamiento
- enviar mensaje de contacto sobre una mascota
- reportar un anuncio
- enviar mensaje de soporte
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
- `POST /api/mascotas/{id}/avistamientos` cuando además del texto se mandan imágenes

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

### Estado de publicación de anuncios
Valores válidos:
- `PUBLICADO`
- `OCULTO`

### Estados de reportes
Valores válidos:
- `PENDIENTE`
- `REVISADO`
- `DESCARTADO`

### Estados de soporte
Valores válidos:
- `ABIERTO`
- `CERRADO`

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

### Reportes
Un reporte sobre un anuncio también puede enviarlo:
- un usuario logueado
- una persona pública sin cuenta

Si el usuario está logueado, el backend guarda `usuario_reportante_id`.
Si no está logueado, ese campo queda a `null`.

### Soporte
Un mensaje de soporte puede venir:
- de un usuario autenticado
- de una persona pública sin cuenta

Si el usuario está autenticado, backend puede rellenar automáticamente nombre, correo o teléfono si no vienen informados.

### Cambio de contraseña
Cambiar la contraseña **no cierra la sesión actual automáticamente**.

### Baja de cuenta
`DELETE /api/me/cuenta` hace una baja lógica de la cuenta. No es un borrado físico completo. La documentación de frontend debería tratarlo como desactivación.

### Anuncios ocultos
Si una mascota tiene `estado_publicacion = OCULTO`, su detalle no está disponible para usuarios normales. Solo puede verlo el dueño del anuncio o un admin.

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

Desactiva la cuenta del usuario autenticado.

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
- después de esto conviene limpiar token en frontend y redirigir fuera del área privada

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

**Nota**
Los valores de `provincia` y `municipio` pueden obtenerse desde los endpoints de catálogos:
- `GET /api/provincias`
- `GET /api/municipios`
- `GET /api/municipios?provincia=Murcia`

Esto permite rellenar selects dinámicos en frontend y luego reutilizar esos valores en `GET /api/mascotas`.

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

**Respuesta típica**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Luna",
      "estado": "PERDIDA",
      "foto_principal_url": "/uploads/mascotas/luna.jpg"
    }
  ]
}
```

**Uso frontend**
- home
- bloque de anuncios recientes

---

### GET /api/mascotas/{id}

Devuelve el detalle completo de una mascota.

**Privada:** no, salvo restricciones por anuncio oculto

**Respuesta típica**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Luna",
    "estado": "PERDIDA",
    "descripcion": "Se perdió cerca de casa",
    "colores": [
      {
        "id": 1,
        "nombre": "Negro"
      }
    ],
    "fotos": [
      {
        "id": 4,
        "url": "/uploads/mascotas/luna.jpg"
      }
    ],
    "dueno": {
      "id": 1,
      "nombre": "Cesar"
    },
    "avistamientos": []
  }
}
```

**Errores comunes**
- `404` si la mascota no existe
- `403` si el anuncio está oculto y quien consulta no es dueño ni admin

**Uso frontend**
- pantalla detalle de mascota
- ficha ampliada del anuncio

---

### POST /api/mascotas

Crea una mascota nueva del usuario autenticado.

**Privada:** sí

**Body JSON**

```json
{
  "nombre": "Luna",
  "raza_id": 2,
  "sexo": "HEMBRA",
  "tiene_chip": true,
  "tamano": "MEDIANO",
  "peso": 18.5,
  "fecha_nacimiento": "2022-05-01",
  "descripcion": "Muy sociable",
  "estado": "PERDIDA",
  "fecha_perdida": "2026-04-01",
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
    "descripcion": "Zona del parque"
  }
}
```

**Campos obligatorios**
- `nombre`
- `raza_id`
- `sexo`
- `tamano`
- `descripcion`
- `estado`
- `colores` como array válido
- `ubicacion`

**Reglas importantes**
- si `estado = PERDIDA`, `fecha_perdida` es obligatoria
- si `estado = ENCONTRADA`, `fecha_encontrada` es obligatoria
- si `estado = RECUPERADA`, `fecha_recuperada` es obligatoria
- hay que seleccionar entre 1 y 5 colores válidos

**Éxito**

```json
{
  "success": true,
  "message": "Mascota creada correctamente",
  "data": {
    "id": 12
  }
}
```

**Errores comunes**
- `401` si no hay token
- `422` si faltan campos obligatorios o la validación falla

**Uso frontend**
- formulario de alta de mascota

---

### PUT /api/mascotas/{id}

Actualiza una mascota del usuario autenticado.

**Privada:** sí

**Body JSON**
Mismo formato general que en creación.

**Importante**
Solo puede editarla su dueño.

**Éxito**

```json
{
  "success": true,
  "message": "Mascota actualizada correctamente",
  "data": {
    "id": 12
  }
}
```

**Errores comunes**
- `401` si no hay token
- `403` si no pertenece al usuario
- `404` si no existe
- `422` si la validación falla

**Uso frontend**
- edición de anuncio

---

### POST /api/mascotas/{id}/fotos

Sube fotos para una mascota ya existente.

**Privada:** sí

**Content-Type**
`multipart/form-data`

**Campo esperado**
- `fotos`

**Éxito**

```json
{
  "success": true,
  "message": "Fotos subidas correctamente",
  "data": [
    {
      "id": 20,
      "url": "/uploads/mascotas/abc123.jpg"
    }
  ]
}
```

**Errores comunes**
- `401` si no hay token
- `422` si no se envía al menos una imagen en `fotos`
- `403` si la mascota no pertenece al usuario

**Uso frontend**
- paso de subida de fotos posterior a creación
- galería de edición

---

### DELETE /api/mascotas/{id}

Borra una mascota y sus datos relacionados.

**Privada:** sí

**Importante**
Solo puede borrarla su dueño.

**Éxito**

```json
{
  "success": true,
  "message": "Mascota eliminada correctamente"
}
```

**Uso frontend**
- botón eliminar publicación

---

### PATCH /api/mascotas/{id}/recuperar

Marca una mascota como recuperada.

**Privada:** sí

**Body**
No necesita body.

**Éxito**

```json
{
  "success": true,
  "message": "Mascota marcada como recuperada correctamente",
  "data": {
    "id": 12,
    "estado": "RECUPERADA",
    "fecha_recuperada": "2026-04-12"
  }
}
```

**Errores comunes**
- `401` si no hay token
- `403` si no pertenece al usuario
- `422` si ya estaba recuperada

**Uso frontend**
- cerrar caso
- mover anuncio a finales felices o histórico

---

## 8.4 Avistamientos

### GET /api/mascotas/{id}/avistamientos

Lista los avistamientos de una mascota concreta.

**Privada:** no

**Respuesta típica**

```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "telefono": "622222222",
      "correo": "persona@correo.com",
      "descripcion": "La vi cerca de una gasolinera",
      "fecha_hora": "2026-04-05 18:20:00",
      "municipio": "Murcia",
      "provincia": "Murcia",
      "latitud": 37.99,
      "longitud": -1.13,
      "fotos": [
        {
          "id": 30,
          "url": "/uploads/avistamientos/a1.jpg"
        }
      ]
    }
  ]
}
```

**Errores comunes**
- `404` si la mascota no existe

**Uso frontend**
- detalle de mascota
- línea temporal de avistamientos

---

### POST /api/mascotas/{id}/avistamientos

Crea un nuevo avistamiento para una mascota.

**Privada:** no

**Puede enviarse como JSON**

```json
{
  "telefono": "622222222",
  "correo": "persona@correo.com",
  "descripcion": "La vi en una rotonda",
  "fecha_hora": "2026-04-05 18:20:00",
  "ubicacion": {
    "latitud": 37.99,
    "longitud": -1.13,
    "direccion_formateada": "Murcia",
    "municipio": "Murcia",
    "provincia": "Murcia",
    "codigo_postal": "30001",
    "pais": "España",
    "descripcion": "Junto a una gasolinera"
  }
}
```

**O como multipart/form-data**

Campos habituales:
- `telefono`
- `correo`
- `descripcion`
- `fecha_hora`
- `latitud`
- `longitud`
- `direccion_formateada`
- `municipio`
- `provincia`
- `codigo_postal`
- `pais`
- `ubicacion_descripcion`
- `fotos`

**Reglas importantes**
- `telefono` obligatorio
- `fecha_hora` obligatoria
- `ubicacion` obligatoria
- `correo` opcional, pero si viene debe ser válido

**Éxito**

```json
{
  "success": true,
  "message": "Avistamiento creado correctamente",
  "data": {
    "id": 8,
    "mascota_id": 3
  }
}
```

**Errores comunes**
- `404` si la mascota no existe
- `422` si la validación falla

**Uso frontend**
- formulario “He visto esta mascota”

---

## 8.5 Contacto sobre anuncios

### POST /api/mascotas/{id}/contactos

Envía un mensaje de contacto al usuario que publicó la mascota.

**Privada:** no

**Body JSON**

```json
{
  "nombre": "Juan",
  "correo": "juan@email.com",
  "telefono": "600000000",
  "mensaje": "Creo que la vi por el parque"
}
```

**Reglas de validación**
- `nombre` obligatoria
- `correo` obligatoria y válida
- `telefono` obligatoria
- `mensaje` obligatoria

**Éxito**

```json
{
  "success": true,
  "message": "Mensaje enviado correctamente",
  "data": {
    "id": 15,
    "mascota_id": 3
  }
}
```

**Errores comunes**
- `404` si la mascota no existe
- `422` si fallan validaciones

**Uso frontend**
- formulario de contacto en el detalle de la mascota

---

## 8.6 Reportes de anuncios

### POST /api/mascotas/{id}/reportes

Crea un reporte sobre un anuncio.

**Privada:** no

**Body JSON**

```json
{
  "asunto": "Anuncio sospechoso",
  "motivo": "fraude",
  "mensaje": "No parece una publicación real",
  "nombre": "Ana",
  "correo": "ana@email.com",
  "telefono": "611111111"
}
```

**Reglas de validación**
- `asunto` obligatoria
- `motivo` obligatoria
- `mensaje` obligatoria
- `nombre` obligatoria
- `correo` obligatoria y válida
- `telefono` opcional

**Éxito**

```json
{
  "success": true,
  "message": "Reporte enviado correctamente",
  "data": {
    "id": 6,
    "mascota_id": 3
  }
}
```

**Errores comunes**
- `404` si la mascota no existe
- `422` si la validación falla

**Uso frontend**
- botón o modal “Reportar anuncio”

---

## 8.7 Soporte general

### POST /api/soporte

Crea un mensaje de soporte.

**Privada:** no

**Body JSON**

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

**Reglas de validación**
- `asunto` obligatoria
- `mensaje` obligatoria
- `nombre` obligatoria
- `correo` obligatoria y válida
- `categoria` opcional, por defecto `GENERAL`
- `telefono` opcional

**Éxito**

```json
{
  "success": true,
  "message": "Mensaje de soporte enviado correctamente",
  "data": {
    "id": 4
  }
}
```

**Errores comunes**
- `422` si la validación falla

**Uso frontend**
- formulario de soporte o contacto general

---

## 8.8 Catálogos

### GET /api/colores

Lista todos los colores.

**Privada:** no

**Éxito**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Negro"
    }
  ]
}
```

**Uso frontend**
- filtros por color
- selector de colores en formulario de mascota

---

### GET /api/colores/{id}

Devuelve un color concreto.

**Privada:** no

**Errores comunes**
- `404` si el color no existe

---

### GET /api/especies

Lista especies.

**Privada:** no

**Uso frontend**
- formularios
- filtros

---

### GET /api/razas

Lista razas.

**Privada:** no

**Query params**
- `especie_id` opcional

**Uso frontend**
- combo dependiente de razas
- filtros del tablón

---

### GET /api/provincias

Lista las provincias existentes en la tabla `ubicaciones`.

**Privada:** no

**Respuesta típica**

```json
{
  "success": true,
  "data": [
    "Murcia",
    "Alicante"
  ]
}

```
---

### GET /api/municipios

Lista los municipios existentes en la tabla `ubicaciones`.

**Privada:** no

**Query params**
- `provincia` opcional

**Ejemplos**

GET /api/municipios
GET /api/municipios?provincia=Murcia

**Respuesta típica**

```json

{
  "success": true,
  "data": [
    "Cartagena",
    "Molina de Segura",
    "Murcia"
  ]
}

```


## 8.9 Usuarios públicos

### POST /api/usuarios

Registra un nuevo usuario.

**Privada:** no

**Body JSON**

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

**Reglas importantes**
- `nombre` obligatoria
- `correo` obligatoria y válida
- `password` obligatoria y mínimo 6 caracteres
- el backend ignora cualquier rol enviado y fuerza siempre `USUARIO`

**Éxito**

```json
{
  "success": true,
  "message": "Usuario creado correctamente",
  "data": {
    "id": 9
  }
}
```

**Errores comunes**
- `422` si la validación falla

**Uso frontend**
- pantalla de registro

---

## 8.10 Panel admin

### GET /api/admin/anuncios

Devuelve el listado de anuncios para moderación.

**Privada:** sí

**Admin:** sí

**Éxito**

```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "nombre": "Luna",
      "estado": "PERDIDA",
      "estado_publicacion": "PUBLICADO"
    }
  ]
}
```

**Uso frontend**
- panel de moderación de anuncios

---

### PATCH /api/admin/anuncios/{id}/estado

Cambia el estado de publicación de un anuncio.

**Privada:** sí

**Admin:** sí

**Body JSON**

```json
{
  "estado_publicacion": "OCULTO"
}
```

**Valores válidos**
- `PUBLICADO`
- `OCULTO`

**Éxito**

```json
{
  "success": true,
  "message": "Estado del anuncio actualizado correctamente"
}
```

**Errores comunes**
- `422` si `estado_publicacion` no es válido

**Uso frontend**
- ocultar o republicar anuncios

---

### DELETE /api/admin/anuncios/{id}

Elimina un anuncio desde administración.

**Privada:** sí

**Admin:** sí

**Éxito**

```json
{
  "success": true,
  "message": "Anuncio eliminado correctamente"
}
```

**Uso frontend**
- acción destructiva en moderación

---

### GET /api/admin/reportes

Devuelve todos los reportes con información relacionada.

**Privada:** sí

**Admin:** sí

**Uso frontend**
- bandeja de reportes
- tabla de revisión

---

### PATCH /api/admin/reportes/{id}/estado

Cambia el estado de un reporte.

**Privada:** sí

**Admin:** sí

**Body JSON**

```json
{
  "estado": "REVISADO",
  "notas_admin": "Revisado por administración"
}
```

**Valores válidos**
- `PENDIENTE`
- `REVISADO`
- `DESCARTADO`

**Éxito**

```json
{
  "success": true,
  "message": "Reporte actualizado correctamente"
}
```

**Errores comunes**
- `422` si `estado` no es válido

**Uso frontend**
- flujo de gestión de reportes

---

### GET /api/admin/soporte

Devuelve todos los mensajes de soporte con sus relaciones.

**Privada:** sí

**Admin:** sí

**Uso frontend**
- panel admin de soporte
- listado de tickets

---

### PATCH /api/admin/soporte/{id}/estado

Cambia el estado de un mensaje de soporte.

**Privada:** sí

**Admin:** sí

**Body JSON**

```json
{
  "estado": "CERRADO",
  "notas_admin": "Incidencia resuelta"
}
```

**Valores válidos**
- `ABIERTO`
- `CERRADO`

**Éxito**

```json
{
  "success": true,
  "message": "Mensaje de soporte actualizado correctamente"
}
```

**Errores comunes**
- `422` si `estado` no es válido

**Uso frontend**
- cerrar incidencias
- añadir trazabilidad administrativa

---

### GET /api/admin/usuarios

Devuelve el listado de usuarios para gestión administrativa.

**Privada:** sí

**Admin:** sí

**Uso frontend**
- panel de usuarios
- activar o desactivar cuentas

---

### PATCH /api/admin/usuarios/{id}/estado

Activa o desactiva un usuario.

**Privada:** sí

**Admin:** sí

**Body JSON**

```json
{
  "activo": 0
}
```

**Valores válidos**
- `1` = activo
- `0` = inactivo

**Éxito**

```json
{
  "success": true,
  "message": "Estado del usuario actualizado correctamente"
}
```

**Errores comunes**
- `422` si `activo` no es 0 o 1

**Uso frontend**
- bloqueo o reactivación de usuarios

---

## 9. Resumen rápido de endpoints activos

### Autenticación
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Zona privada
- `GET /api/me/perfil`
- `PUT /api/me/perfil`
- `PATCH /api/me/password`
- `DELETE /api/me/cuenta`
- `GET /api/me/mascotas`
- `GET /api/me/avistamientos`
- `GET /api/me/notificaciones`
- `PATCH /api/me/notificaciones/contactos/{id}/leer`
- `PATCH /api/me/notificaciones/avistamientos/{id}/leer`

### Mascotas
- `GET /api/mascotas`
- `GET /api/mascotas/recientes`
- `GET /api/mascotas/{id}`
- `POST /api/mascotas`
- `PUT /api/mascotas/{id}`
- `POST /api/mascotas/{id}/fotos`
- `DELETE /api/mascotas/{id}`
- `PATCH /api/mascotas/{id}/recuperar`

### Avistamientos
- `GET /api/mascotas/{id}/avistamientos`
- `POST /api/mascotas/{id}/avistamientos`

### Contacto, reportes y soporte
- `POST /api/mascotas/{id}/contactos`
- `POST /api/mascotas/{id}/reportes`
- `POST /api/soporte`

### Catálogos
- `GET /api/colores`
- `GET /api/colores/{id}`
- `GET /api/especies`
- `GET /api/razas`
- `GET /api/provincias`
- `GET /api/municipios`

### Usuarios públicos
- `POST /api/usuarios`

### Admin
- `GET /api/admin/anuncios`
- `PATCH /api/admin/anuncios/{id}/estado`
- `DELETE /api/admin/anuncios/{id}`
- `GET /api/admin/reportes`
- `PATCH /api/admin/reportes/{id}/estado`
- `GET /api/admin/soporte`
- `PATCH /api/admin/soporte/{id}/estado`
- `GET /api/admin/usuarios`
- `PATCH /api/admin/usuarios/{id}/estado`
