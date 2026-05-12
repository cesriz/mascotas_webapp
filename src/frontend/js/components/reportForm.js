import { API } from '../api.js';
import { showHttpError, showSuccess } from '../main.js';
import { createTemplate } from "../ui-utils.js";
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
        btnReset.onclick = () => form.reset();

        // Envío del formulario
        form.onsubmit = async (e) => {
            e.preventDefault();
            await this.sendReport();
        };
    }

    // Método para enviar el mensaje de reporte
    async sendReport() {
        // Limpiamos posibles errores previos
        const httpCat = this.querySelector('http-cat');
        if (httpCat) httpCat.style.display = 'none';

        if (!this._petId) {
            alert("Error: No se ha especificado el anuncio.");
            return;
        }

        const data = {
            asunto: this.querySelector('#report-subject').value,
            motivo: this.querySelector('#report-report').value,
            mensaje: this.querySelector('#report-msg').value,
            nombre: this.querySelector('#report-name').value,
            correo: this.querySelector('#report-correo').value,
            telefono: this.querySelector('#report-phone').value
        };

        try {
            // Llamada a API
            await API.crearReporte(this._petId, data);
            showSuccess("Reporte enviado correctamente");
            setTimeout(() => this.close(), 2000); 
        
        } catch (error) {
            console.error("Error al enviar reporte:", error);
            showHttpError(error, this);
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
    }
}

customElements.define('report-form', ReportForm);