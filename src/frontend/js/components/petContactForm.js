import { API } from '../api.js';
import { Auth } from '../auth.js';
import { showHttpError, showSuccess } from '../main.js';

import { createTemplate } from "../ui-utils.js";
import { petContactFormHTML, petContactFormCSS } from "../templates/petContactFormTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(petContactFormHTML, petContactFormCSS);


export class PetContactForm extends HTMLElement {
    constructor() {
        super();
        this._petId = null;
    }

    // Permitimos pasar el ID de la mascota dinámicamente
    set petId(value) {
        this._petId = value;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        const bg = this.querySelector('#panel-overlay');
        const form = this.querySelector('#form-contact');
        const btnReset = this.querySelector('#contact-btn-reset');

        // Cerrar al pinchar fuera (overlay)
        bg.onclick = () => this.close();

        // Limpiar campos
        btnReset.onclick = () => form.reset();

        // Envío del formulario
        form.onsubmit = async (e) => {
            e.preventDefault();
            await this.sendMsg();
        };
    }

    async sendMsg() {
        // Limpiamos posibles errores previos
        const httpCat = document.querySelector('http-cat');
        if (httpCat) httpCat.style.display = 'none';

        if (!this._petId) {
            alert("Error: No se ha especificado la mascota.");
            return;
        }

        const data = {
            nombre: this.querySelector('#contact-name').value,
            correo: this.querySelector('#contact-correo').value,
            telefono: this.querySelector('#contact-phone').value,
            mensaje: this.querySelector('#contact-msg').value
        };

        try {
            // POST /api/mascotas/{id}/contacto
            await API.enviarContacto(this._petId, data);
            showSuccess("Mensaje enviado correctamente");
            setTimeout(() => this.close(), 2000); // Se cierra automáticamente tras 2s
        
        } catch (error) {
            console.error("Error al enviar contacto:", error);
            showHttpError(error, this);
        }
        
    }

    // Método para abrir el formulario
    open(petId) {
        this._petId = petId;
        this.classList.add('is-visible');
        document.body.style.overflow = 'hidden'; // Evita scroll de fondo
    }

    // Método para cerrar el formulario
    close() {
        this.classList.remove('is-visible');
        document.body.style.overflow = 'auto';
        this.querySelector('#form-contact').reset();
    }
}

customElements.define('pet-contact-form', PetContactForm);