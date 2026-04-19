//Configuración de peticiones HTTP al backend
const BASE_URL = 'http://localhost:3000'; // Cambia esto por tu URL real


export const API = {
    // Función para no repetir el token en cada llamada.
    // Multipart = false cuando no se envían archivos. Se indica el Content-Type en los headers. Es el valor por defecto.
    // Multipart = true cuando sí se envían archivos / objetos FormData (fotografías). El navegador genera un header especial de forma autónoma.
    getHeaders(isMultipart = false) {
        // Comprobamos si hay un token guardado en localStorage y lo incluimos en los headers 
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Si isMultipart = false se indica al navegador que se está enviando un JSON
        if (!isMultipart) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
    },

    //Función general para todas las peticiones
    async call(endpoint, options = {}) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, options);

            // Verificamos si la respuesta es JSON antes de parsear
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw { code: response.status, message: "Error crítico: El servidor no respondió con JSON" };
            }

            const data = await response.json();
            
            if (!data.success) {
                // Si hay errores de validación, los priorizamos. 
                throw { 
                    code: response.status, 
                    message: data.message || "Error de validación",
                    validationErrors: data.errors || null // Array de fallos
                };
            }

            return data.data;

        } catch (error) {
            // Si el error ya tiene nuestro formato del backend, se relanza
            if (error.code) throw error;

            // Si es un error de red (fetch falló totalmente), simulamos un 404
            console.error("Error de red o servidor:", error);
            throw { code: 404, message: "No se pudo conectar con el servidor" };
        }
        
    },

// Métodos específicos

// Zona pública del usuario
    // Iniciar sesión
    login(credentials) { 
        return this.call('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); 
    },

    // Ver listado de usuarios
    getUsuarios() { 
        return this.call('/api/usuarios', { headers: this.getHeaders() }); 
    },

    // Ver datos de un usuario concreto
    getUsuarioById(id) { 
        return this.call(`/api/usuarios/${id}`, { headers: this.getHeaders() }); 
    },

    // Crear nuevo usuario / Registrarse
    registro(userData) {
        return this.call('/api/usuarios', { method: 'POST', body: JSON.stringify(userData) });
    },
    
// Zona privada de usuario
    // Cerrar sesión
    logout() { 
        return this.call('/auth/logout', { method: 'POST', headers: this.getHeaders() }); 
    },

    // Ver qué usuario está logueado
    getMe() { return this.call('/auth/me', { headers: this.getHeaders() }); 
    },

    // Obtener los datos de perfil del usuario
    getPerfil() { 
        return this.call('/api/me/perfil', { headers: this.getHeaders() }); 
    },

    // Actualizar datos de perfil del usuario
    updatePerfil(data) { 
        return this.call('/api/me/perfil', { method: 'PUT', headers: this.getHeaders(), body: JSON.stringify(data) }); 
    },

    // Actualizar contraseña
    updatePassword(data) { 
        return this.call('/api/me/password', { method: 'PATCH', headers: this.getHeaders(), body: JSON.stringify(data) }); 
    },

    // Eliminar cuenta (desactiva la cuenta, no la borra de la base de datos)
    deletePerfil() {
        return this.call('/api/me/cuenta', { method: 'DELETE', headers: this.getHeaders() });
    },

    // Ver mascotas publicadas por el usuario
    getMisMascotas() { 
        return this.call('/api/me/mascotas', { headers: this.getHeaders() }); 
    },

    // Ver avistamientos creados por el usuario
    getMisAvistamientos() {
            return this.call('/api/me/avistamientos', { headers: this.getHeaders() });
    },

    // Ver notificaciones
    getNotificaciones() { 
        return this.call('api/me/notificaciones', { headers: this.getHeaders() }); 
    },
    
    // Marcar notificaciones como leídas
    leerContacto(id) { 
        return this.call(`/api/me/notificaciones/contactos/${id}/leer`, { method: 'PATCH', headers: this.getHeaders() }); 
    },

    leerAvistamiento(id) { 
        return this.call(`/api/me/notificaciones/avistamientos/${id}/leer`, { method: 'PATCH', headers: this.getHeaders() }); 
    },


// Zona pública de mascotas
    // Listar mascotas publicadas
    getMascotas(filtros = "") { 
        return this.call(`/api/mascotas${filtros}`); 
    },

    // Listar mascotas publicadas recientes
    getMascotasRecientes(limit = 4) { 
        return this.call(`/api/mascotas/recientes?limit=${limit}`); 
    },

    // Ver detalles de una mascota
    getMascotaById(id) { 
        return this.call(`/api/mascotas/${id}`); 
    },


// Zona privada de mascotas (es necesario estar autenticado)
    // Crear mascota
    crearMascota(data) { 
        return this.call('/api/mascotas', { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(data) }); 
    },

    // Subir fotos de mascota
    subirFotosMascota(id, formData) {
        return this.call(`/api/mascotas/${id}/fotos`, { 
            method: 'POST', 
            headers: this.getHeaders(true), // true para quitar Content-Type JSON
            body: formData 
        });
    },

    // Actualizar datos de una mascota existente
    updateMascota(id, data) {
        return this.call(`/api/mascotas/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
    },

    // Marcar mascota como recuperada
    marcarRecuperada(id) { 
        return this.call(`api/mascotas/${id}/recuperar`, { method: 'PATCH', headers: this.getHeaders() }); 
    },

    // Eliminar mascota
    deleteMascota(id) { 
        return this.call(`/api/mascotas/${id}`, { method: 'DELETE', headers: this.getHeaders() }); 
    },


// Avistamientos y contacto
    // Ver los avistamientos de una mascota concreta
    getAvistamientosMascota(id) {
        return this.call(`/api/mascotas/${id}/avistamientos`); 
    },

    // Registrar un avistamiento de una mascota
    crearAvistamiento(idMascota, formData) {
        return this.call(`/api/mascotas/${idMascota}/avistamientos`, { 
            method: 'POST', 
            headers: this.getHeaders(true), 
            body: formData 
        });
    },

    // Enviar un mensaje al usuario que publicó la mascota
    enviarContacto(idMascota, data) {
        return this.call(`/api/mascotas/${idMascota}/contactos`, { 
            method: 'POST', 
            headers: this.getHeaders(), 
            body: JSON.stringify(data) 
        });
    },


// Catálogos
    // Listar colores disponibles
    getColores() { 
        return this.call('/api/colores'); 
    },

    // Obtener color concreto
    getColorById(id) {
        return this.call('/api/colores/{id}'); 
    },

    // Listar especies disponibles
    getEspecies() { 
        return this.call('/api/especies'); 
    },

    // Listar razas disponibles - filtro por especie opcional
    getRazas(especieId = "") { 
        const query = especieId ? `?especie_id=${especieId}` : "";
        return this.call(`/api/razas${query}`); 
    },
    
    // Listar provincias disponibles
    getProvincias() {
        return this.call('/api/provincias');
    },

    // Listar los municipios disponibles - filtro por provincia opcional 
    getMunicipios(provincia = '') {
        const query = provincia ? `?provincia=${provincia}` : "";
        return this.call(`/api/municipios${query}`);
    },

// Administración y configuración

    // Listar reportes de mascotas (problemas, contenido inapropiado, etc.)
    getAdminReportes() {
        return this.call('/api/admin/reportes', { headers: this.getHeaders() });
    },

    // Actualizar el estado de un reporte (PENDIENTE, REVISADO, DESCARTADO)
    updateReporteEstado(id, data) {
        return this.call(`/api/admin/reportes/${id}/estado`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
    },

    // Listar mensajes de soporte técnico enviados por usuarios
    getAdminSoporte() {
        return this.call('/api/admin/soporte', { headers: this.getHeaders() });
    },

    // Cambiar estado de un ticket de soporte (ABIERTO, CERRADO)
    updateSoporteEstado(id, data) {
        return this.call(`/api/admin/soporte/${id}/estado`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
    },

    // Listar todos los usuarios del sistema para gestión
    getAdminUsuarios() {
        return this.call('/api/admin/usuarios', { headers: this.getHeaders() });
    },

    // Cambiar el estado de un usuario (Activar, Bloquear, Suspender)
    updateUsuarioEstado(id, data) {
        return this.call(`/api/admin/usuarios/${id}/estado`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
    }, 

    
    // Cargar datos de Cloudinary y Leaflet [NO IMPLEMENTADOS EN EL BACKEND]
    getConfig() { 
        return this.call('/api/config', { headers: this.getHeaders() }); 
    },

    // Actualizar datos de configuración
    updateConfig(data) { 
        return this.call('/api/config', { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(data) }); 
    },
};