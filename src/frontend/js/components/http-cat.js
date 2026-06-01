import { createTemplate } from "../ui-utils.js";
import { httpCatHTML, httpCatCSS } from "../templates/http-catTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(httpCatHTML, httpCatCSS);

export class HttpCat extends HTMLElement {
    // Función que sirve para que el navegador actualice el código si este cambia.
    static get observedAttributes() { 
        return ['code', 'message', 'errors']; 
    }

    attributeChangedCallback() { 
        this.render(); 
    }

    connectedCallback() { 
        this.render(); 
    }

    render() {
        this.innerHTML = ''; 
        this.appendChild(template.content.cloneNode(true));
        
        const code = this.getAttribute('code') || '500';
        const message = this.getAttribute('message');
        const errors = this.getAttribute('errors');

        const img = this.querySelector('#cat-img');
        const messagesContainer = this.querySelector('#messages');

        // Usamos la URL según la documentción de la API
        img.src = `https://http.cat/${code}`;

        let html = '';

        if (message) {
            html += `<p class="error-msg">${message}</p>`;
        }

        if (errors) {
            const parsed = JSON.parse(errors);
            parsed.forEach(err => {
                html += `<p class="error-msg">${err}</p>`;
            });
            }

            messagesContainer.innerHTML = html;

            // Lógica para cerrar el modal
            const closeBtn = this.querySelector('#close-cat');
            const retryBtn = this.querySelector('#retry-btn');

            const hideMe = () => {
                this.style.display = 'none';
                this.removeAttribute('code');
                this.removeAttribute('message');
                this.removeAttribute('errors');
            };

            if (closeBtn) closeBtn.onclick = hideMe;
            if (retryBtn) retryBtn.onclick = hideMe;
    }
}
customElements.define('http-cat', HttpCat);