import { API } from '../api.js';
import { Auth } from '../auth.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: none; /* Oculto por defecto hasta que se active */
        }

        :host(.is-visible) {
            display: block;
        }

        .pet-contact-form {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(600px, 90vw);
            z-index: 1000;
            max-height: 90vh;
            padding: 2rem;
            overflow-y: auto;
            display: flex; 
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            background-color: var(--backgroundblue);
            border: 2px solid var(--primary);
            border-radius: var(--radius-md);
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        
        .pet-contact-title {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: var(--text-md);
            gap: 5px;
            margin-bottom: 10px;
            transform: translate(-10px,0);
        }

        .pet-contact-title img {
            width: 24px;
            height: 24px;
        }

        .pet-contact-form-inputs {
            display: flex;
            flex-direction: column; 
            gap: 15px;
            width: 100%;
        }

        .pet-contact-form-inputs > div {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        input, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: var(--radius-sm);
            font-family: inherit;
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }

        .privacy-input {
            display: flex;
            margin-top: 10px;
            align-items: flex-start;
            gap: 10px;
            font-size: 0.9rem;
        }

        .privacy-input input {
            width: auto;
            margin-top: 4px;
        }

        .privacy-input a {
            color: var(--secondary500);
            text-decoration: underline;
        }

        .contact-buttons {
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        } 

        .contact-buttons button {
            flex: 1;
            max-width: 150px;
            padding: 10px;
            cursor: pointer;
        }

        .panel-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        }

        /* --------Tablets y móviles--------- */
        @media (max-width: 600px) {
            .contact-buttons {
                flex-direction: column;
            }
            .contact-buttons button {
                max-width: 100%;
            }
            .pet-contact-form {
                padding: 1.5rem;
            }
        }
    </style>

    <div class="panel-overlay" id="panel-bg"></div>
    <div class="pet-contact-form">
        <div class="pet-contact-title">
            <img src="../assets/icons/material-symbols--mail-outline.png">
            <h3>Contacta</h3>
        </div>

        <form id="form-contact">
            <div class="pet-contact-form-inputs">
                <div>            
                    <label for="contact-name">Nombre</label>
                    <input type="text" id="contact-name" required>
                </div>
                <div>            
                    <label for="contact-email">Email</label>
                    <input type="email" id="contact-email" required>
                </div>
                <div>            
                    <label for="contact-phone">Teléfono</label>
                    <input type="tel" id="contact-phone">
                </div>
                <div>            
                    <label for="contact-msg">Mensaje</label>
                    <textarea id="contact-msg" placeholder="Escribe aquí tu mensaje..." required></textarea>
                </div>
            </div>

            <label class="privacy-input">
                <input type="checkbox" id="privacy-check" required>
                <span>Mediante el envío de mis datos confirmo que he leído y acepto la <a href="privacidad.html" target="_blank">política de privacidad</a>.</span>
            </label>

            <div class="contact-buttons">
                <button type="button" class="button-secondary" id="contact-btn-reset">Limpiar</button>
                <button type="submit" class="button-primary" id="contact-btn-send">Enviar</button> 
            </div>
        </form>
    </div>
`;

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

        const bg = this.querySelector('#panel-bg');
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
        if (!this._petId) {
            alert("Error: No se ha especificado la mascota.");
            return;
        }

        const data = {
            nombre: this.querySelector('#contact-name').value,
            email: this.querySelector('#contact-email').value,
            telefono: this.querySelector('#contact-phone').value,
            mensaje: this.querySelector('#contact-msg').value
        };

        try {
            // Según tu api.md: POST /api/mascotas/{id}/contacto
            await API.call(`/api/mascotas/${this._petId}/contacto`, {
                method: 'POST',
                headers: API.getHeaders(),
                body: JSON.stringify(data)
            });

            alert("Mensaje enviado correctamente.");
            this.close();
        } catch (error) {
            console.error("Error al enviar contacto:", error);
            alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
        }
    }

    open(petId) {
        this._petId = petId;
        this.classList.add('is-visible');
        document.body.style.overflow = 'hidden'; // Evita scroll de fondo
    }

    close() {
        this.classList.remove('is-visible');
        document.body.style.overflow = 'auto';
        this.querySelector('#form-comunicacion').reset();
    }
}

customElements.define('pet-contact-form', PetContactForm);