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
            const size = this.getQRSize();

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
    
    // Método para abrir el modal y generar el QR
    open() {
        this.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            this.generate();
        });
    }

    // Método para cerrar el modal
    close() {
        this.classList.remove('is-visible');
        document.body.style.overflow = 'auto';
    }

    // Método para ajustar tamaño según el div que lo contiene
    getQRSize() {
        const width = window.innerWidth;

        if (width < 480) return 100;
        if (width < 768) return 180;
        if (width > 768) return 200;
    }
}

customElements.define('qr-code', QRCodeComponent);