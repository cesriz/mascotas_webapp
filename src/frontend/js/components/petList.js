import './petCard.js';
import { showHttpError } from '../main.js';
import { createTemplate } from "../ui-utils.js";
import { petListHTML, petListCSS } from "../templates/petListTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(petListHTML, petListCSS);



export class PetList extends HTMLElement {
    constructor() {
        super();
        this._pets = [];
    }

    // Usamos un setter para pasarle las mascotas
    set pets(data) {
        this._pets = data;
        this.render();
    }

    setError(error) {
        this._pets = null; // Limpiamos mascotas para que no choquen visualmente
        this.render();
        showHttpError(error, this);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        const grid = this.querySelector('#grid');
        const emptyMsg = this.querySelector('#empty-msg');
        const httpCat = this.querySelector('http-cat');

        // Si hay algún error en la llamada en la API, se utiliza http-cats
        if (this._pets === null) {
            grid.style.display = 'none';
            emptyMsg.style.display = 'none';
            return;
        }

        // Si la llamada a la API es exitosa pero no hay mascotas
        if (this._pets.length === 0) {
            grid.style.display = 'none';
            emptyMsg.style.display = 'block';
            httpCat.style.display = 'none';
            return;
        }

        // Éxito
        grid.style.display = 'grid';
        emptyMsg.style.display = 'none';
        httpCat.style.display = 'none';

        this._pets.forEach(petData => {
            const card = document.createElement('pet-card');
            card.petData = petData; 
            
            // Evento para editar
            card.addEventListener('edit-pet', (e) => {
                this.dispatchEvent(new CustomEvent('request-edit', {
                    detail: { petId: e.detail.petId },
                    bubbles: true,
                    composed: true
                }));
            });

            grid.appendChild(card);
        });
    }
}

customElements.define('pet-list', PetList);