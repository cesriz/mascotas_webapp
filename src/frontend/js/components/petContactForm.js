import { API } from '../api.js';
import { Auth } from '../auth.js';
import { showHttpError, showSuccess } from '../main.js';

import { createTemplate, showInputError, clearInputErrors } from "../ui-utils.js";
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
        btnReset.onclick = () => {
            form.reset();
            const httpCat = this.querySelector('http-cat');
            if (httpCat) httpCat.style.display = 'none';
        }

        // Envío del formulario
        form.onsubmit = async (e) => {
            e.preventDefault();
            await this.sendMsg();
        };


        this.loadUserData();
    }

    // Lógica para cargar los datos del usuario autenticado en el formulario
    async loadUserData() {
        const user = Auth.getUserData();

        if (user) {
            this.querySelector('#contact-name').value = `${user.nombre} ${user.apellidos}` || '';
            this.querySelector('#contact-correo').value = user.correo || '';
            this.querySelector('#contact-phone').value = user.telefono || '';
        }
    }


    // Lógica para validar los datos antes de enviarlos
    validateForm() {
        clearInputErrors(this);
        let isValid = true;

        const nombre = this.querySelector('#contact-name').value;
        const correo = this.querySelector('#contact-correo').value;
        const telefono = this.querySelector('#contact-phone').value;
        const mensaje = this.querySelector('#contact-msg').value;
        const privacy = this.querySelector('#privacy-check').checked;

        if (!nombre.trim()) {
            showInputError(this, 'contact-name', 'El nombre es obligatorio');
            isValid = false;
        }

        if (!correo.trim()) {
            showInputError(this, 'contact-correo', 'El correo es obligatorio');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            showInputError(this, 'contact-correo', 'El formato del correo no es válido');
            isValid = false;
        }

        if (!telefono.trim()) {
            showInputError(this, 'contact-phone', 'El teléfono es obligatorio');
            isValid = false;
        }

        if (!mensaje.trim()) {
            showInputError(this, 'contact-msg', 'Debes escribir un mensaje');
            isValid = false;
        }

        return isValid;
    }
        

    // Lógica para enviar el mensaje
    async sendMsg() {

        
        // Limpiamos posibles errores previos
        clearInputErrors(this);
        const httpCat = document.querySelector('http-cat');
        if (httpCat) httpCat.style.display = 'none';

        // Validamos datos antes de enviar
        if (!this.validateForm()) {
            return;
        }

        if (!this._petId) {
            showHttpError({ code: 400, message: "No se ha especificado la mascota." }, this);            return;
        }

        const data = {
            nombre: this.querySelector('#contact-name').value,
            correo: this.querySelector('#contact-correo').value,
            telefono: this.querySelector('#contact-phone').value,
            mensaje: this.querySelector('#contact-msg').value
        };

        const submitBtn = this.querySelector('#contact-btn-send');

        try {
            // Cambiamos el estado del botón
            submitBtn.disabled = true;
            submitBtn.textContent = "Enviando...";

            await API.enviarContacto(this._petId, data);
            showSuccess("Mensaje enviado correctamente", this);
            setTimeout(() => this.close(), 3000); // Se cierra automáticamente tras 2s
        
        } catch (error) {
            showHttpError(error, this);
            // Scroll al inicio del panel para ver al gato
            const panel = this.querySelector('.pet-contact-form') || this;
            panel.scrollTop = 0;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Enviar";
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

        // Ocultamos el gato al cerrar
        const httpCat = this.querySelector('http-cat');
        if (httpCat) httpCat.style.display = 'none';
    }
}

customElements.define('pet-contact-form', PetContactForm);