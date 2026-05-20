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
        const publishBtn = this.querySelector('#btn-publish');
        publishBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Evita cualquier recarga accidental
            if (isLoggedIn) {
                window.location.href = 'perfil?panel=publicar';
            } else {
                window.location.href = 'login.html';
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

        // Declarada abajo
        this.updateActiveLinks();
    }
}
    // Función para cambiar el contenido y la funcionalidad de un botón según autenticación de usuario
    setupAuthButton(btn, isLoggedIn) {
        if (!btn) return;                
            btn.textContent = isLoggedIn ? 'MI PERFIL' : 'INICIAR SESIÓN';

            btn.onclick = () => {
                window.location.href = isLoggedIn ? 'perfil.html' : 'login.html';
            };
        }
    
    // Función para marcar el link según la vista activa
    updateActiveLinks() {
        // Obtenemos la ruta actual (ej: "/Tablon.html")
        // Usamos decodeURI por si hay caracteres especiales y eliminamos barras iniciales
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        // Buscamos todos los enlaces dentro del componente
        const links = this.querySelectorAll('nav.navbar a');

        links.forEach(link => {
            // Obtenemos solo el nombre del archivo del atributo href
            const linkPath = link.getAttribute('href').split('/').pop();

            // Comparamos y añadimos/quitamos la clase
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}



customElements.define('app-navbar', AppNavbar);