import { Auth } from '../auth.js';
import { API } from '../api.js';

import { createTemplate } from "../ui-utils.js";
import { navBarHTML, navBarCSS } from "../templates/appNavbarTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(navBarHTML, navBarCSS);

export class AppNavbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    async handleLogout() {
        try {
            await API.logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
        Auth.clearSession();
        window.location.href = 'index.html';
    }

    render() {
        const isLoggedIn = Auth.isLoggedIn();
        const user = Auth.getUserData();

        // Limpiamos el contenido previo y clonamos el template
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        // Configuramos los botones de autenticación dinámicamente (desktop y tablet/móvil)
        // Utilizamos la función de abajo
        const authBtn = this.querySelector('#btn-auth');
        this.setupAuthButton(authBtn, isLoggedIn);

        const mobileBtnAuth = this.querySelector('#mobile-btn-auth');
        this.setupAuthButton(mobileBtnAuth, isLoggedIn); 


        // Lógica para el botón publicar
        const publicarBtn = this.querySelector('#btn-publicar');
        publicarBtn.addEventListener('click', () => {
            if (isLoggedIn) {
                window.location.href = 'Usuario.html'; //MODIFICAR ESTO PARA QUE APAREZCA EN LA VENTANA DE PUBLICARR
            } else {
                window.location.href = 'Auth.html';
            }
        });

        // Lógica para el menú de hamburguesa en tablet/móvil
        const burgerBtn = this.querySelector('#hamburger-btn');
        const navbar = this.querySelector('#navbar');
        const navBtns = this.querySelectorAll('.nav-btn');

        if (burgerBtn && navbar) {
            burgerBtn.addEventListener("click", () => {
                navbar.classList.toggle("active");
                navBtns.forEach(btn => {
                    btn.classList.toggle("active");
                });
            });
    }}

    // Función para cambiar el contenido y la funcionalidad de un botón según autenticación de usuario
    setupAuthButton(btn, isLoggedIn) {
        if (!btn) return;                
            btn.textContent = isLoggedIn ? 'Mi Perfil' : 'Iniciar sesión';

            btn.onclick = () => {
                window.location.href = isLoggedIn ? 'Usuario.html' : 'Auth.html';
            };
        }
}


customElements.define('app-navbar', AppNavbar);