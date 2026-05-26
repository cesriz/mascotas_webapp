import { API } from '../api.js';
import { Auth } from '../auth.js';
import { showHttpError, showSuccess } from '../main.js';

import { createTemplate } from "../ui-utils.js";
import { userDeleteConfirmHTML, userDeleteConfirmCSS } from '../templates/userDeleteConfirmTemplate.js';
// Importamos plantilla (HTML y CSS)
const template = createTemplate(userDeleteConfirmHTML, userDeleteConfirmCSS);


export class userDeleteConfirm extends HTMLElement {
    constructor() {
        super();
        this._user = null;
    }

    set user(value) {
            this._user = value;
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
        btnDelete.onclick = async (e) => {
            e.stopPropagation();

            // Limpiamos http-cat
            const httpCat = this.querySelector('http-cat');
            if (httpCat) httpCat.style.display = 'none';
            
            try {
                const result = await API.deletePerfil();
                showSuccess("Cuenta eliminada. Lamentamos verte partir.");
                Auth.clearSession(); // Borramos datos de sesión
                setTimeout(() => window.location.href = 'index.html', 3000);
                
            } catch(error) {
                showHttpError(error);
            }
        };

        // Cerrar formulario al pinchar fuera (overlay)
        const overlay = this.querySelector('#a-panel-overlay');
        overlay.onclick = () => this.close();

    }

    // Método para abrir el formulario
        open() {
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

customElements.define('user-delete-confirm', userDeleteConfirm);