import { API } from '../api.js';
import { showHttpError, showSuccess } from '../main.js';

import { createTemplate } from "../ui-utils.js";
import { deleteConfirmHTML, deleteConfirmCSS } from '../templates/deleteConfirmTemplate.js';
// Importamos plantilla (HTML y CSS)
const template = createTemplate(deleteConfirmHTML, deleteConfirmCSS);


export class DeleteConfirm extends HTMLElement {
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

        // Cerrar el modal al pulsar el botón de volver
        const btnCancel = this.querySelector('#btn-c-cancel');
        btnCancel.onclick = (e) => {
            e.stopPropagation();
            this.close();
        };

        // Borrar la mascota al pulsar el botón de confirmar
        const btnDelete = this.querySelector('#btn-c-delete');
        btnDelete.onclick = (e) => {
            e.stopPropagation();
            try {
                const result = API.deleteMascota(this._petId);
                console.log('Exito al borrar la mascota:', result);
                window.location.href = 'perfil.html';

            } catch(error) {
                console.log('Error al borrar la mascota', error)
            }
        };

        // Cerrar formulario al pinchar fuera (overlay)
        const overlay = this.querySelector('#a-panel-overlay');
        overlay.onclick = () => this.close();

    }

    // Método para abrir el formulario
        open(petId) {
            this._petId = petId;
            this.classList.add('is-visible');
        }

    // Método para cerrar el formulario
        close() {
            this.classList.remove('is-visible');
            document.body.style.overflow = 'auto';
        }

}

customElements.define('delete-confirm', DeleteConfirm);