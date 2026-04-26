import { createTemplate } from "../ui-utils.js";
import { appFooterHTML, appFooterCSS } from "../templates/appFooterTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(appFooterHTML, appFooterCSS);

export class AppFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Limpiamos e inyectamos el contenido del template
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        // Lógica para que al hacer click en footer-brand vaya a la landing page
        const brand = this.querySelector('.footer-brand');
        if (brand) {
            brand.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }
}

customElements.define('app-footer', AppFooter);