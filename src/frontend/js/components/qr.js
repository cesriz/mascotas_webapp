import { API } from '../api.js';
import { Auth } from '../auth.js';
import { showHttpError, showSuccess } from '../main.js';

import { createTemplate } from "../ui-utils.js";
import { qrHTML, qrCSS } from '../templates/qrTemplate.js';

// Importamos plantilla (HTML y CSS)
const template = createTemplate(qrHTML, qrCSS);


export class QRCodeComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        window.addEventListener('resize', () => this.generate());
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        // Cerrar al pinchar fuera (overlay)    
        const bg = this.querySelector('#q-panel-overlay');
        if (bg) bg.onclick = () => this.close();

        this.generate();
    }

    generate() {
        const qrImgContainer = this.querySelector("#qrcode");
        if (qrImgContainer) {
            qrImgContainer.innerHTML = "";
            // Usamos 'new window.QRCode' para asegurar que llamamos a la librería y no a la clase de este archivo
            const size = Math.min(window.innerWidth * 0.5, 200); // Establecemos un tamaño responsive para el QR

            new window.QRCode(qrImgContainer, {
                text: window.location.href,
                width: size,
                height: size,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : window.QRCode.CorrectLevel.H
            });
        }
    }
    
    // Método para abrir el modal
    open() {
        this.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    // Método para cerrar el modal
    close() {
        this.classList.remove('is-visible');
        document.body.style.overflow = 'auto';
    }
}

customElements.define('qr-code', QRCodeComponent);