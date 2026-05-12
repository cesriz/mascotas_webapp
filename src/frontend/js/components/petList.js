import './petCard.js';
import { showHttpError } from '../main.js';
import { createTemplate } from "../ui-utils.js";
import { petListHTML, petListCSS } from "../templates/petListTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(petListHTML, petListCSS);



export class PetList extends HTMLElement {
    constructor() {
        super();
        this._pets = null;
    }

    // Usamos un setter para pasarle las mascotas
    set pets(data) {
        this._pets = data;
        this.render();
    }

    connectedCallback() {
        if (this._pets && this._pets.length > 0) {
            this.render();
        }
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        const grid = this.querySelector('#grid-container');
        const emptyMsg = this.querySelector('#empty-msg');
        const httpCat = this.querySelector('http-cat');

        // Si hay algún error en la llamada en la API, se utiliza http-cats
        if (this._pets === null) {
            if (grid) grid.style.display = 'none';
            if (emptyMsg) emptyMsg.style.display = 'none';
            if (httpCat) httpCat.style.display = 'block';
            return;
        }
        const items = Array.isArray(this._pets) ? this._pets : []; 
        // Si no hay mascotas, mostramos el mensaje de "No encontrado"
        if (!this._pets || this._pets.length === 0) {
            if (grid) grid.style.display = 'none';
            if (emptyMsg) emptyMsg.style.display = 'block';
            if (httpCat) httpCat.style.display = 'none';
            return;
        }

        // Éxito
        grid.style.display = 'grid';
        emptyMsg.style.display = 'none';
        httpCat.style.display = 'none';

        items.forEach(petData => {
            const card = document.createElement('pet-card');
            card.petData = petData; 
            grid.appendChild(card);
            
            // Evento para editar
            card.addEventListener('edit-pet', (e) => {
                this.dispatchEvent(new CustomEvent('request-edit', {
                    detail: { petId: e.detail.petId },
                    bubbles: true,
                    composed: true
                }));
            });

            
        });
    }

    getGrid() {
        return this.querySelector('#grid-container');
    }
}

customElements.define('pet-list', PetList);