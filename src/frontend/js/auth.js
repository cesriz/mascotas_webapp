/**
 * auth.js funciona como el gestor de acceso y sesiones
 *  - Guarda, lee o borra el token y los datos de usuario
 *  - Valida o bloquea el acceso según los permisos de usuario
 */
import { API } from "./api.js";

export const Auth = {
    // Guarda los datos de sesión tras un login con éxito
    setSession(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        // Guardamos el rol siempre en minúsculas para evitar errores de comparación
        localStorage.setItem('rol', user.rol.toLowerCase()); 
    },
    
    // Borra los datos de la sesión
    clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rol');
    },

    // Comprueba si el usuario tiene un token
    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    // Indica el rol del usuario actual ('admin' o 'user')
    getRole() {
        return localStorage.getItem('rol');
    },

    // Comprueba si el usuario es adminsitrador
    isAdmin() {
        return this.getRole() === 'admin';
    },

    // Devuelve los datos guardados del usuario
    getUserData() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Devuelve solo el token
    getToken() {
        return localStorage.getItem('token');
    },

    // Valida el token y actualiza los datos guardados del usuario.
    async syncUser() {
        // Comprobamos si hay token guardado
        const token = this.getToken();
        if (!token) return null;

        try {
            // Obtenemos los datos del usuario logeado
            const user = await API.getMe(); 

            if (!user) throw new Error("No se encontraron datos de usuario");

            // Actualizamos el localStorage con los datos del servidor
            // Usamos setSession para actualizar token, user y rol
            this.setSession(token, user);

            return user; // Devolvemos el usuario actualizado
        } catch (error) {
            // Si el servidor da error, la sesión ya no es válida
            console.error("Error en syncUser:", error.message);
            this.clearSession();
            return null;
        }
    }

    
};