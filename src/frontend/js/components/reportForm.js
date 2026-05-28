import { API } from '../api.js';
import { Auth } from '../auth.js';

import { showHttpError, showSuccess } from '../main.js';
import { createTemplate, showInputError, clearInputErrors } from "../ui-utils.js";

import { reportFormHTML, reportFormCSS } from "../templates/reportFormTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(reportFormHTML, reportFormCSS);

export class ReportForm extends HTMLElement {
    constructor() {
        super();
        this._petId = null;
    }

    // Setter para pasar el id de la mascota
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
        const form = this.querySelector('#form-report');
        const btnReset = this.querySelector('#report-btn-reset');

        // Cerrar al pinchar fuera (overlay)
        bg.onclick = () => this.close();

        // Limpiar campos
        btnReset.onclick = () => {
            form.reset();
            const httpCat = this.querySelector('http-cat');
            if (httpCat) httpCat.style.display = 'none';
        };

        // Envío del formulario
        form.onsubmit = async (e) => {
            e.preventDefault();
            await this.sendReport();
        };

        this.loadUserData();
    }



    // Lógica para cargar los datos del usuario autenticado en el formulario
    async loadUserData() {
        const user = Auth.getUserData();

        if (user) {
            this.querySelector('#report-name').value = `${user.nombre} ${user.apellidos}` || '';
            this.querySelector('#report-correo').value = user.correo || '';
            this.querySelector('#report-phone').value = user.telefono || '';
        }
    }

    

    // Lógica para validar datos antes de enviar el reporte
    validateForm() {
        clearInputErrors(this);
        let isValid = true;

        const asunto = this.querySelector('#report-subject').value;
        const message = this.querySelector('#report-msg').value;
        const name = this.querySelector('#report-name').value;
        const email = this.querySelector('#report-correo').value;
        const phone = this.querySelector('#report-phone').value;
        
        // Asunto
        if (!asunto.trim()) {
            showInputError(this, 'report-subject', 'El asunto es obligatorio');
            isValid = false;
        }

        // Mensaje
        if (!message.trim()) {
            showInputError(this, 'report-msg', 'Debes describir el motivo del reporte');
            isValid = false;
        }

        // Nombre
        if (!name.trim()) {
            showInputError(this, 'report-name', 'El nombre es obligatorio');
            isValid = false;
        }

        // Correo
        if (!email.trim()) {
            showInputError(this, 'report-correo', 'El correo es obligatorio');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showInputError(this, 'report-correo', 'El formato del correo no es válido');
            isValid = false;
        }

        // Teléfono
        if (phone && !/^\+?[0-9\s\-]{9,15}$/.test(phone)) {
            showInputError(this, 'report-phone', 'Formato de teléfono no válido');
            isValid = false;
        }


        return isValid;
    }



    // Método para enviar el mensaje de reporte
    async sendReport() {
        // Limpiamos posibles errores previos
        const httpCat = this.querySelector('http-cat');
        if (httpCat) httpCat.style.display = 'none';

        if (!this._petId) {
            showHttpError({ code: 400, message: "ID de mascota no válido" }, this);
            return;
        }

        // Validamos datos
        if (!this.validateForm()) {
            return;
        }

        const data = {
            asunto: this.querySelector('#report-subject').value,
            mensaje: this.querySelector('#report-msg').value,
            nombre: this.querySelector('#report-name').value,
            correo: this.querySelector('#report-correo').value,
            telefono: this.querySelector('#report-phone').value
        };

        const submitBtn = this.querySelector('#report-btn-send');

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Enviando...";

            // Llamada a API
            await API.crearReporte(this._petId, data);
            showSuccess("Reporte enviado correctamente", this);
            setTimeout(() => this.close(), 3000); 
        
        } catch (error) {
            showHttpError(error, this);

        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Enviar";
        }
    }

    // Método para abrir el formulario
    open(petId) {
        this._petId = petId;
        this.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    // Método para cerrar el formulario
    close() {
        this.classList.remove('is-visible');
        document.body.style.overflow = 'auto';
        this.querySelector('#form-report').reset();

        const httpCat = this.querySelector('http-cat');
        if (httpCat) {
            httpCat.style.display = 'none';
            httpCat.removeAttribute('code');
            httpCat.removeAttribute('message');
            httpCat.removeAttribute('errors');
        }

    }
}

customElements.define('report-form', ReportForm);