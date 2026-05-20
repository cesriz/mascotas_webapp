import { Auth } from '../auth.js';
import { showSuccess, showHttpError } from "../main.js";
import { HttpCat } from './http-cat.js';
import { API } from '../api.js';

import { createTemplate } from "../ui-utils.js";
import { authLoginHTML, authLoginCSS } from "../templates/authLoginTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(authLoginHTML, authLoginCSS);

export class AuthLogin extends HTMLElement {
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
        // Comprobamos si el usuario está autenticado y redirigimos a la landing
        if (Auth.isLoggedIn()) {
            window.location.href = 'index.html';
            return; // Detenemos la ejecución para no cargar el resto de la lógica
        }

        // Contenedores principales
        const loginDiv = this.querySelector('#login-div');
        const forgotDiv = this.querySelector('#forgot-pss-div');
        
        // Secciones de formulario
        const initDiv = this.querySelector('#init-div');
        const registerDiv = this.querySelector('#register-div');

        // Botones de control
        const initBtn = this.querySelector('#init-btn');
        const registerBtn = this.querySelector('#register-btn');
        const changerBtn = this.querySelector('#changer');

        // Contenedores de botones (para estilos visuales de pestaña activa)
        const initBtnDiv = this.querySelector('.init-btn-div');
        const registerBtnDiv = this.querySelector('.register-btn-div');

        // Estado inicial
        forgotDiv.style.display = 'none';
        registerDiv.style.display = 'none';
        initBtnDiv.style.borderBottom = '3px solid var(--primary, #000)';

        // Lógica de intercambio entre autenticaciónn, registro y recuperación de contraseña
        // Función para resetear pestañas
        const resetTabs = () => {
            initDiv.style.display = 'none';
            registerDiv.style.display = 'none';
            initBtnDiv.style.borderBottom = 'none';
            registerBtnDiv.style.borderBottom = 'none';

            initBtnDiv.style.backgroundColor = 'inherit';
            initBtn.style.borderRadius = 'var(--radius-md) 0 0 0';

            registerBtnDiv.style.backgroundColor = 'inherit';
            registerBtn.style.borderRadius = '0 var(--radius-md) 0 0';
        };

        // Click en "Iniciar Sesión"
        initBtn.addEventListener('click', () => {
            resetTabs();
            initDiv.style.display = 'flex';
            initBtnDiv.style.borderBottom = '3px solid var(--primary, #000)';
            initBtnDiv.style.backgroundColor = 'var(--backgroundorange)';
            initBtn.style.borderRadius = 'var(--radius-md) 0 0 0';
        });

        // Click en "Registrarse"
        registerBtn.addEventListener('click', () => {
            resetTabs();
            registerDiv.style.display = 'flex';
            registerBtnDiv.style.borderBottom = '3px solid var(--primary, #000)';
            registerBtnDiv.style.backgroundColor = 'var(--backgroundorange)';
            registerBtn.style.borderRadius = '0 var(--radius-md) 0 0';
        });

        // Click en "¿Has olvidado tu contraseña?"
        changerBtn.addEventListener('click', () => {
            changerBtn.style.display = 'none';
            forgotDiv.style.display = 'block'; 
        });
    
        // Lógica de Peticiones API
        // Inicio de sesión
        const loginForm = this.querySelector('#init');
        loginForm.addEventListener('submit', async (e) => {
            console.log('clic boton');
            e.preventDefault();
            const credentials = {
                correo: this.querySelector('#auth-correo').value,
                password: this.querySelector('#auth-pass').value
            };

            try {
                console.log('try');
                const data = await API.login(credentials);
console.log("Respuesta completa de API:", data);
                // Se guarda el token en localStorage
                Auth.setSession(data.token, data.usuario);
                loginForm.reset();
 
                showSuccess("¡Bienvenido!");
                
                // Redirigir tras un breve delay o emitir evento
                setTimeout(() => window.location.href = 'index.html', 1500);
            } catch (error) {
                showHttpError(error);
            }
        });

        // Registro
        const registerForm = this.querySelector('#register');
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userData = {
                nombre: this.querySelector('#register-name').value,
                apellidos: this.querySelector('#register-surname').value,
                correo: this.querySelector('#register-correo').value,
                telefono: this.querySelector('#register-phone').value,
                direccion: this.querySelector('#register-direction').value,
                password: this.querySelector('#register-pass').value
            };

            console.log('datos obtenidos');

            try {
                await API.registro(userData);

                console.log('llamada');

                showSuccess("Registro completado. Ya puedes iniciar sesión.");
                registerForm.reset(); console.log('reset');
                setTimeout(() => initBtn.click(), 2500);

            } catch (error) {
                showHttpError(error);
            }
        });

    // Recuperar contraseña
        const forgotForm = this.querySelector('#forgot-pss');
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = this.querySelector('#forgot-correo').value;

            try {
                const data = await API.forgotPassword(email);

                showSuccess("Se ha procesado la solicitud. Revisa tu correo electrónico.")
            } catch (error) {
                showHttpError(error, this);
            }
        });
    }
}
       


customElements.define('auth-login', AuthLogin);