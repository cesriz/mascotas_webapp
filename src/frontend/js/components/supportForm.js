import { API } from '../api.js';
import { Auth } from '../auth.js';

import { showHttpError, showSuccess } from '../main.js';
import { createTemplate, showInputError, clearInputErrors } from "../ui-utils.js";

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

        btnReset.onclick = () => {
            form.reset();
            // Limpiamos el gato al resetear el formulario
            const httpCat = this.querySelector('http-cat');
            if (httpCat) httpCat.style.display = 'none';
        };

        form.onsubmit = async (e) => {
            e.preventDefault();
            await this.sendSupportMsg();
        };

        this.loadUserData();
    }

    // Lógica para cargar los datos del usuario autenticado en el formulario
    async loadUserData() {
        const user = Auth.getUserData();

        if (user) {
            this.querySelector('#support-user-id').value = user.id || '';
            this.querySelector('#support-name').value = `${user.nombre} ${user.apellidos}` || '';
            this.querySelector('#support-correo').value = user.correo || '';
            this.querySelector('#support-phone').value = user.telefono || '';
        }
    }

    // Método de validación antes de enviar los datos del formulario
    validateForm() {
        clearInputErrors(this);
        let isValid = true;

        const asunto = this.querySelector('#support-subject').value;
        const nombre = this.querySelector('#support-name').value;
        const correo = this.querySelector('#support-correo').value;
        const mensaje = this.querySelector('#support-msg').value;

        if (!asunto.trim()) {
            showInputError(this, 'support-subject', 'El asunto es obligatorio');
            isValid = false;
        }

        if (!nombre.trim()) {
            showInputError(this, 'support-name', 'El nombre es obligatorio');
            isValid = false;
        }

        if (!correo.trim()) {
            showInputError(this, 'support-correo', 'El correo es obligatorio');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            showInputError(this, 'support-correo', 'El formato del correo no es válido');
            isValid = false;
        }

        if (!mensaje.trim()) {
            showInputError(this, 'support-msg', 'El mensaje es obligatorio');
            isValid = false;
        }

        return isValid;
    }

    // Lógica para enviar el mensaje de soporte
    async sendSupportMsg() {
        const httpCat = this.querySelector('http-cat');
        if (httpCat) httpCat.style.display = 'none';

        // Validamos antes de enviar
        if (!this.validateForm()) return;

        const data = {
            usuario_id:this.querySelector('#support-user-id').value,
            asunto: this.querySelector('#support-subject').value,
            categoria: this.querySelector('#support-category').value,
            mensaje: this.querySelector('#support-msg').value,
            nombre: this.querySelector('#support-name').value,
            correo: this.querySelector('#support-correo').value,
            telefono: this.querySelector('#support-phone').value
        };

        const submitBtn = this.querySelector('#support-btn-send');

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Enviando...";

            // Llamamos a la API
            await API.crearSoporte(data);
            showSuccess("Mensaje de soporte enviado correctamente", this);
            setTimeout(() => this.close(), 2000);

        } catch (error) {
            console.error("Error al enviar soporte:", error);
            showHttpError(error, this);

        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Enviar";
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

        const httpCat = this.querySelector('http-cat');
        if (httpCat) {
            httpCat.style.display = 'none';
            httpCat.removeAttribute('code');
            httpCat.removeAttribute('message');
            httpCat.removeAttribute('errors');
        }
    }
}

customElements.define('support-form', SupportForm);