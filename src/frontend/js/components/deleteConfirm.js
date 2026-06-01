import { API } from '../api.js';
import { showHttpError, showSuccess } from '../main.js';

import { createTemplate } from "../ui-utils.js";
import { deleteConfirmHTML, deleteConfirmCSS } from '../templates/deleteConfirmTemplate.js';
// Importamos plantilla (HTML y CSS)
const template = createTemplate(deleteConfirmHTML, deleteConfirmCSS);


export class DeleteConfirm extends HTMLElement {
    constructor() {
        super();
        this._id = null;
        this._type = 'null'; //mascota o avistamiento
        this._photoId = 'null';
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

        // Borramos registro según el tipo que le pasemos
        const btnDelete = this.querySelector('#btn-c-delete');
            if (btnDelete) {
                btnDelete.onclick = async (e) => {
                    e.stopPropagation();

                    const httpCat = this.querySelector('http-cat');
                    if (httpCat) httpCat.style.display = 'none';

                    try {
                        if (this._type === 'mascota') {
                            await API.deleteMascota(this._id);
                            showSuccess('Mascota eliminada correctamente', this);

                        } else if (this._type === 'foto') {
                            await API.deleteFotoAvistamiento(this._photoId);
                            showSuccess('Fotografía eliminada correctamente', this);

                        } else if (this._type === 'avistamiento') {
                            if (this._photoId) await API.deleteFotoAvistamiento(this._photoId);
                            await API.deleteAvistamiento(this._id);
                            showSuccess('Avistamiento eliminado correctamente', this);
                        }

                        setTimeout(() => window.location.href = 'perfil.html', 3000);
                    } catch (error) {
                        showHttpError(error, this);
                    }
                };
            }

        // Cerramos formulario al pinchar fuera (overlay)
        const overlay = this.querySelector('#a-panel-overlay');
        overlay.onclick = () => this.close();

    }

    // Método para abrir el formulario
        open(id, type, fotoId) {
            this._id = id;
            this._type = type;
            this._photoId = fotoId;

            this.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        }

    // Método para cerrar el formulario
        close() {
            this.classList.remove('is-visible');
            document.body.style.overflow = 'auto';
            const httpCat = this.querySelector('http-cat');
            if (httpCat) {
                httpCat.style.display = 'none';
                httpCat.removeAttribute('code');
            }
        }

}

customElements.define('delete-confirm', DeleteConfirm);