import { Auth } from '../auth.js';
import { API } from '../api.js';

import { createTemplate } from "../ui-utils.js";
import { navBarHTML, navBarCSS } from "../templates/appNavbarTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(navBarHTML, navBarCSS);
const ACCESSIBILITY_STORAGE_KEY = 'mp_accessibility_mode';
const ACCESSIBILITY_CLASS = 'alto-contraste';

export class AppNavbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.restoreAccessibilityMode();
        this.render();

        // Evento para actualizar notificaciones cuando se marcan como leídas
        window.addEventListener('notificationsUpdated', () => {
            this.showNotifications();
        });
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

        this.querySelectorAll('.btn-accesibilidad').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setAccessibilityMode(!this.isAccessibilityModeEnabled());
            });
        });
        this.updateAccessibilityButtons();

        // Lógica para el botón publicar
        this.querySelectorAll('#btn-publish, #mobile-btn-publicar').forEach(publishBtn => {
            publishBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Evita cualquier recarga accidental
                if (isLoggedIn) {
                    window.location.href = 'perfil?panel=publicar';
                } else {
                    window.location.href = 'login.html';
                }
            });
        });

        // Lógica para el menú de hamburguesa en tablet/móvil
        const burgerBtn = this.querySelector('#hamburger-btn');
        const navbar = this.querySelector('#navbar');
        const navBtns = this.querySelectorAll('.nav-btn');

        if (burgerBtn && navbar) {
            burgerBtn.addEventListener("click", () => {
                const isOpen = navbar.classList.toggle("active");
                burgerBtn.setAttribute('aria-expanded', String(isOpen));
                burgerBtn.setAttribute(
                    'aria-label',
                    isOpen ? 'Cerrar menu de navegacion' : 'Abrir menu de navegacion'
                );
                navBtns.forEach(btn => {
                    btn.classList.toggle("active");
                });
            });
        }

        // Botón de notificaciones (usamos función declarada abajo)
        if (Auth.isLoggedIn()) {
            this.showNotifications();
        }

        // Declarada abajo
        this.updateActiveLinks();
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
        // Obtenemos la ruta actual (ej: "/tablon.html")
        // Usamos decodeURI por si hay caracteres especiales y eliminamos barras iniciales
        const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();;
        // Buscamos todos los enlaces dentro del componente
        const links = this.querySelectorAll('nav.navbar a');

        links.forEach(link => {
            // Obtenemos solo el nombre del archivo del atributo href
            const href = link.getAttribute('href') || '';

            const linkPath = link.getAttribute('href').split('/').pop();

            // Comparamos y añadimos/quitamos la clase
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Lógica para el botón de notificaciones
    // Obtener número de notificaciones y mostrarlas
    async showNotifications() {
        try {
            const data = await API.getNotificaciones();
            const count = data?.resumen.total_no_leidas || 0;

            const badge = this.querySelector('#notification-badge');
            if (count > 0) {
                badge.textContent = count > 9 ? '9+' : count;
                badge.style.display = 'inline-block'; // Cambiamos a inline-block para que se vea
            } else {
            badge.style.display = 'none';
            }
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
        }

        // Si pulsamos, redirigimos al panel de notificaciones
        this.querySelectorAll('#btn-notifications, #mobile-btn-notifications').forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = 'perfil?panel=notificaciones'; 
            });
        });
    }

    // Accesibilidad
    restoreAccessibilityMode() {
        try {
            const storedValue = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
            document.body.classList.toggle(ACCESSIBILITY_CLASS, storedValue === 'true');
        } catch (error) {
            console.warn('No se pudo recuperar la preferencia de accesibilidad:', error);
        }
    }

    isAccessibilityModeEnabled() {
        return document.body.classList.contains(ACCESSIBILITY_CLASS);
    }

    setAccessibilityMode(isEnabled) {
        document.body.classList.toggle(ACCESSIBILITY_CLASS, isEnabled);

        try {
            localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, String(isEnabled));
        } catch (error) {
            console.warn('No se pudo guardar la preferencia de accesibilidad:', error);
        }

        this.updateAccessibilityButtons();
    }

    updateAccessibilityButtons() {
        const isEnabled = this.isAccessibilityModeEnabled();

        this.querySelectorAll('.btn-accesibilidad').forEach(btn => {
            btn.setAttribute('aria-pressed', String(isEnabled));
            btn.setAttribute(
                'aria-label',
                isEnabled ? 'Desactivar modo de alto contraste' : 'Activar modo de alto contraste'
            );
            btn.setAttribute(
                'title',
                isEnabled ? 'Desactivar modo de alto contraste' : 'Activar modo de alto contraste'
            );
        });
    }
}



customElements.define('app-navbar', AppNavbar);
