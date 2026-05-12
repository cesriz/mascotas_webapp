import { Auth } from '../auth.js';
import { createTemplate } from "../ui-utils.js";
import { appAsideCSS, appAsideHTML } from "../templates/appAsideTemplate.js";

const template = createTemplate(appAsideHTML, appAsideCSS);

export class AppAside extends HTMLElement {
    constructor() {
        super();
        // Estado interno: 'USER' (por defecto) o 'ADMIN'
        this._mode = 'USER';
    }

    connectedCallback() {
        this.render();
    }

    // Cambiamos entre modo Usuario y modo Admin si el usuario tiene rol de administrador
    toggleModo() {
        this._mode = (this._mode === 'USER') ? 'ADMIN' : 'USER';
        this.render();
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        // Configuramos el botón para colapsar el aside
        const colapseBtn = this.querySelector('#aside-btn');
        const asideElement = this.querySelector('app-aside');

        colapseBtn.onclick = () => {
            asideElement.classList.toggle('aside-collapsed');
            
            // Giramos el icono
            colapseBtn.querySelector('img').style.transform = 
                asideElement.classList.contains('aside-collapsed') ? 'rotate(180deg)' : 'rotate(0deg)';
        };

        // Comprobamos el rol del usuario (auth.js)
        const isAdminRole = Auth.isAdmin();
        const isAdminVisible = isAdminRole && this._mode === 'ADMIN';

        // Si el panel está en modo "Admin", mostramos el título
        const titleEl = this.querySelector('#aside-title');
        if (isAdminVisible) {
            titleEl.classList.remove('hidden');
        } else {
            titleEl.classList.add('hidden');
        }

        // Mostramos unos enlaces u otros según el modo
        const linksContainer = this.querySelector('#aside-links');
        linksContainer.innerHTML = isAdminVisible ? this.getAdminLinks() : this.getUserLinks();

        // Lógica del botón
        const actionBtn = this.querySelector('#aside-action-btn');
        if (!isAdminRole) {
            // Usuario normal: siempre "Publicar"
            actionBtn.textContent = 'PUBLICAR ANUNCIO';
            actionBtn.dataset.panel = 'publicar';
        } else {
            // Administrador: toggle entre vistas
            actionBtn.textContent = isAdminVisible ? 'VISTA USUARIO' : 'VISTA ADMINISTRADOR';
            actionBtn.onclick = () => this.toggleModo();
        }
    }

    // Método para mostrar los links en modo usuario
    getUserLinks() {
        return `
            <a data-panel="mascotas">MIS MASCOTAS</a>
            <a data-panel="avistamientos">MIS AVISTAMIENTOS</a>
            <a data-panel="notificaciones">NOTIFICACIONES</a>
            <a data-panel="perfil">MI PERFIL</a>
            <a data-panel="logout">CERRAR SESIÓN</a>
        `;
    }

    // Método para mostrar los links en modo admin
    getAdminLinks() {
        return `
            <a data-panel="admin-anuncios">MODERACIÓN DE ANUNCIOS</a>
            <a data-panel="admin-usuarios">GESTIÓN DE USUARIOS</a>
            <a data-panel="admin-reportes">REPORTES Y DENUNCIAS</a>
            <a data-panel="admin-ajustes">AJUSTES DEL SISTEMA</a>
            <a data-panel="logout">CERRAR SESIÓN</a>
        `;
    }
}

customElements.define('app-aside', AppAside);