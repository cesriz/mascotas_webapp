import { createTemplate } from "../ui-utils.js";
import { petQrModalHTML, petQrModalCSS } from "../templates/petQrModalTemplate.js";
import { generateQrDataUrl, getPetDetailUrl } from "../qr-utils.js";

const template = createTemplate(petQrModalHTML, petQrModalCSS);

export class PetQrModal extends HTMLElement {
    constructor() {
        super();
        this.qrDataUrl = ''; // Almacena el QR en formato imagen
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.bindEvents();
    }

    // Abre el modal con el mismo QR que se usa en el cartel RRSS
    async open(pet) {
        if (!pet) return;

        // Genera la URL del anuncio
        const detailUrl = getPetDetailUrl(pet.id);
        // Convertimos la URL del anuncio en un QR
        this.qrDataUrl = await generateQrDataUrl(detailUrl);

        // Rellena los datos del modal
        this.setText('#qr-title', `QR de ${pet.nombre || 'la mascota'}`);
        this.setText('#qr-url', detailUrl);

        const image = this.querySelector('#qr-image');
        if (image) {
            image.src = this.qrDataUrl;
            image.alt = `QR del anuncio de ${pet.nombre || 'la mascota'}`;
        }
        // Muestra el modal quitando la clase hidden
        this.querySelector('#qr-backdrop')?.classList.remove('hidden');
    }

    close() {
        this.querySelector('#qr-backdrop')?.classList.add('hidden');
    }

    bindEvents() {
        const backdrop = this.querySelector('#qr-backdrop');
        const downloadBtn = this.querySelector('#qr-download');

        backdrop?.addEventListener('click', (event) => {
            if (event.target === backdrop) this.close();
        });

        downloadBtn?.addEventListener('click', () => this.downloadQr());
    }

    downloadQr() {
        if (!this.qrDataUrl) return;

        // Crea un link temporal para descargar la imagen QR
        const link = document.createElement('a');
        link.download = 'qr-anuncio-mascota.png';
        link.href = this.qrDataUrl;
        link.click();
    }

    // Utilidad para actualizar el texto de un elemento 
    setText(selector, text) {
        const element = this.querySelector(selector);
        if (element) element.textContent = text;
    }
}

customElements.define('pet-qr-modal', PetQrModal);
