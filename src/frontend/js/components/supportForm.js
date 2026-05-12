import { API } from '../api.js';
import { showHttpError, showSuccess } from '../main.js';
import { createTemplate } from "../ui-utils.js";
import { supportFormCSS, supportFormHTML } from '../templates/supportFormTemplate.js';

const template = createTemplate(supportFormHTML, supportFormCSS);

export class SupportForm extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        const bg = this.querySelector('#panel-overlay');
        const form = this.querySelector('#form-support');
        const btnReset = this.querySelector('#support-btn-reset');

        bg.onclick = () => this.close();
        btnReset.onclick = () => form.reset();

        form.onsubmit = async (e) => {
            e.preventDefault();
            await this.sendSupportMsg();
        };
    }

    async sendSupportMsg() {
        const httpCat = this.querySelector('http-cat');
        if (httpCat) httpCat.style.display = 'none';

        const data = {
            asunto: this.querySelector('#support-subject').value,
            categoria: this.querySelector('#support-category').value,
            mensaje: this.querySelector('#support-msg').value,
            nombre: this.querySelector('#support-name').value,
            correo: this.querySelector('#support-correo').value,
            telefono: this.querySelector('#support-phone').value
        };

        try {
            // Suponiendo que tienes un endpoint para soporte general
            await API.crearSoporte(data);
            showSuccess("Mensaje de soporte enviado correctamente");
            setTimeout(() => this.close(), 2000);
        } catch (error) {
            console.error("Error al enviar soporte:", error);
            showHttpError(error, this);
        }
    }

    open() {
        this.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.classList.remove('is-visible');
        document.body.style.overflow = 'auto';
        this.querySelector('#form-support').reset();
    }
}

customElements.define('support-form', SupportForm);