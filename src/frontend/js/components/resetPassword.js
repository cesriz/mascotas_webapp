import { API } from '../api.js';
import { createTemplate, initPasswordToggles } from "../ui-utils.js";
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
        const resetTokenInput = this.querySelector('#reset-token');
        const submitButton = resetForm.querySelector('button[type="submit"]');

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            showHttpError({
                code: 400,
                message: 'El token de recuperación no es válido o no existe.'
            });

            submitButton.disabled = true;
            passwordInput.disabled = true;
            passwordConfirmInput.disabled = true;
            return;
        }

        // Mostrar y ocultar contraseña en el input (ui-utils)
        initPasswordToggles(this);

        resetTokenInput.value = token;

        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const password = passwordInput.value.trim();
            const passwordConfirm = passwordConfirmInput.value.trim();

            if (password !== passwordConfirm) {
                showHttpError({
                    code: 422,
                    message: 'Las contraseñas no coinciden.'
                });
                return;
            }

            if (password.length < 6) {
                showHttpError({
                    code: 422,
                    message: 'La contraseña debe tener al menos 6 caracteres.'
                });
                return;
            }

            const payload = {
                token,
                password,
                password_confirm: passwordConfirm
            };

            try {
                submitButton.disabled = true;
                passwordInput.disabled = true;
                passwordConfirmInput.disabled = true;
                submitButton.textContent = 'RESTABLECIENDO...';

                await API.resetPassword(payload);

                showSuccess('Contraseña actualizada correctamente. Redirigiendo al login...');

                resetForm.reset();

                // Quitamos el token de la URL visualmente para que no se quede expuesto.
                window.history.replaceState({}, document.title, window.location.pathname);

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1800);

            } catch (error) {
                submitButton.disabled = false;
                passwordInput.disabled = false;
                passwordConfirmInput.disabled = false;
                submitButton.textContent = 'RESTABLECER CONTRASEÑA';

                showHttpError(error);
            }
        });
    }
}

customElements.define('reset-password', ResetPassword);