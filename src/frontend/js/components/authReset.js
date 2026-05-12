import { API } from '../api.js';
import { showSuccess, showHttpError } from "../main.js";
import { createTemplate } from "../ui-utils.js";
import { authResetHTML, authResetCSS } from "../templates/authResetTemplate.js";

const template = createTemplate(authResetHTML, authResetCSS); 

export class AuthResetPassword extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.initLogic();
    }

    render() {
        this.innerHTML = template.innerHTML;
        
        // Extraer el token de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
            this.querySelector('#reset-token').value = token;
        } else {
            showHttpError({ message: "Token no proporcionado o inválido" });
        }
    }

    initLogic() {
        const resetForm = this.querySelector('#reset-pss');
        
        // Evento del formulario
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const password = this.querySelector('#new-pass').value;
            const password_confirm = this.querySelector('#confirm-pass').value;
            const token = this.querySelector('#reset-token').value;

            // Validación de contraseñas
            if (password !== password_confirm) {
                showHttpError({ message: "Las contraseñas no coinciden" });
                return;
            }

            try {
                // Llamamos a la API
                await API.resetPassword({ token, password, password_confirm });
                
                showSuccess("Contraseña actualizada correctamente");
                
                // Redirigir al login tras 2 segundos
                setTimeout(() => window.location.href = 'login.html', 2000);
            } catch (error) {
                showHttpError(error);
            }
        });
    }
}

customElements.define('auth-reset-password', AuthResetPassword);