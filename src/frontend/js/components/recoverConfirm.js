import { API } from '../api.js';
import { showHttpError, showSuccess } from '../main.js';

import { createTemplate } from "../ui-utils.js";
import { recoverConfirmHTML, recoverConfirmCSS } from '../templates/recoverConfirmTemplate.js';
// Importamos plantilla (HTML y CSS)
const template = createTemplate(recoverConfirmHTML, recoverConfirmCSS);


export class RecoverConfirm extends HTMLElement {
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
        const btnCancel = this.querySelector('#btn-r-cancel');
        btnCancel.onclick = (e) => {
            e.stopPropagation();
            this.close();
        };

        // Marcar como recuperada
        const btnRecover = this.querySelector('#btn-r-recover');
        btnRecover.onclick = (e) => {
            e.stopPropagation();
            try {
                const result = API.marcarRecuperada(this._petId);
                console.log('Exito al actualizar la mascota:', result);

                const editDiv = this.querySelector('#recover-edit-actions');
                editDiv.classList.remove('hidden');

            } catch(error) {
                console.log('Error al actualizar la mascota', error)
            }
        };

        // Editar la mascota al pulsar el botón de editar
        const editBtn = this.querySelector('#btn-r-edit');
        editBtn.onclick = (e) => {
            e.stopPropagation();
            
            if (editBtn) {
                const petId = this._petId;

                if (petId) {
                    window.location.href = `perfil?panel=publicar&editar=${petId}`
                } else 
                    window.location.href = `perfil?panel=mascotas`;
            }
        };

        // Volver y recargar vista
        const reloadBtn = this.querySelector('#btn-r-reload');
        reloadBtn.onclick = (e) => {
            e.stopPropagation();
            
            if (reloadBtn) {
                const petId = this._petId;

                if (petId) {
                    window.location.href = `detalles?id=${petId}`
                } else 
                    window.location.href = `perfil?panel=mascotas`;
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

customElements.define('recover-confirm', RecoverConfirm);