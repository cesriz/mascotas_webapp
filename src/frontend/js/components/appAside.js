import { Auth } from '../auth.js';
import { createTemplate } from "../ui-utils.js";
import { appAsideCSS, appAsideHTML } from "../templates/appAsideTemplate.js";

const template = createTemplate(appAsideHTML, appAsideCSS);

export class AppAside extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        // Logica del botón para colapsar el asidei
        const colapseBtn = this.querySelector('#aside-btn');
        const asideElement = this.querySelector('#aside');

        colapseBtn.onclick = () => {
            asideElement.classList.toggle('aside-collapsed');
            
            // Giramos el icono
            colapseBtn.querySelector('img').style.transform = 
                asideElement.classList.contains('aside-collapsed') ? 'rotate(180deg)' : 'rotate(0deg)';
        };

        // Lógica para mostrar "publicar" o "editar" según el modo del formulario
        const publishLink = this.querySelector('#aside-publish');

        // Comprobamos el rol del usuario (auth.js)
        const isAdminRole = Auth.isAdmin()
        console.log(isAdminRole);
        const adminPanel = this.querySelector('#admin-links');
        // Si el usuario tiene el rol de admin, mostramos el panel de administrador
        if (isAdminRole) {
            adminPanel.classList.remove('hidden');
        } else {
            adminPanel.classList.add('hidden');
        }

        // Escuchamos clics para actualizar el resaltado de los links sin recargar
        this.addEventListener('click', (e) => {
            const link = e.target.closest('[data-panel]');
            if (link) {
                // Delay para que la URL cambie antes de comprobarla
                setTimeout(() => {
                    this.highlightActiveLink();
                }, 20);
            }
        });

        // Resaltamos el link actual al cargar
        this.highlightActiveLink();
    }

    // Función para gestionar el resaltado de los links
    highlightActiveLink() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPanel = urlParams.get('panel');

        // Quitamos la clase de todos los links
        this.querySelectorAll('.aside-a').forEach(link => {
            link.classList.remove('aside-a-active');
        });

        if (urlPanel) {
            const activeLink = this.querySelector(`[data-panel="${urlPanel}"]`);
            if (activeLink) {
                activeLink.classList.add('aside-a-active');
            }
        }
    }
}

customElements.define('app-aside', AppAside);