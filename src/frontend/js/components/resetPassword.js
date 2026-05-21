import { API } from '../api.js';
import { createTemplate } from "../ui-utils.js";
import { resetPasswordHTML, resetPasswordCSS } from "../templates/resetPasswordTemplate.js";
import { showSuccess, showHttpError } from "../main.js";

const template = createTemplate(resetPasswordHTML, resetPasswordCSS);

export class ResetPassword extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.initLogic();
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));
    }

    initLogic() {
        const resetForm = this.querySelector('#reset-pss');
        const passwordInput = this.querySelector('#password');
        const passwordConfirmInput = this.querySelector('#password-confirm');

        // Extraemos el token de la URL: ejemplo.com/reset.html?token=123
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const password = passwordInput.value;
            const passwordConfirm = passwordConfirmInput.value;

            // Validaciones básicas
            if (!token) {
                alert('El token de recuperación no es válido o no existe.');
                return;
            }

            if (password !== passwordConfirm) {
                alert('Las contraseñas no coinciden');
                return;
            }

            if (password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres');
                return;
            }

            // Preparamos los datos
            const payload = {
                token: token,
                password: password,
                password_confirm: passwordConfirm
            };

            try {
                // Llamada a la API
                const response = await API.resetPassword(payload);
                
                console.log('Exito al cambiar la contraseña.');

                // SUCCESS -----> 
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 5000);

                } catch (error) {
                    // Si hay un error de red o el servidor se cae
                    console.error('Error al cambiar la contraseña', error);
                }

        });
    }
}

customElements.define('reset-password', ResetPassword);