// Gestión de sesiones.

export const Auth = {
    // Guarda los datos de sesión tras un login con éxito
    setSession(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', user.role); 
    },
    
    // Borra los datos de la sesión
    clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
    },

    // Comprueba si el usuario tiene un token
    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    // Indica el rol del usuario actual ('admin' o 'user')
    getRole() {
        return localStorage.getItem('role');
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
    }
};