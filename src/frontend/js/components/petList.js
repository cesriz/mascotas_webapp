import './petCard.js';
import './http-cat.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        .pet-list{
            display: block;
            width: 100%;
        }
        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            padding: 1rem;
        }

        .empty-state img {
            max-width: 200px;
            margin-bottom: 1rem;
        }
    </style>

    <div class= "pet-list">
        <div class="grid-container" id="grid"></div>
        <div id="empty-message" style="display: none;"></div>
    </div> 
`;

export class PetList extends HTMLElement {
    constructor() {
        super();
        this._pets = [];
    }

    set pets(data) {
        this._pets = data;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        const grid = this.querySelector('#grid');
        const emptyMessage = this.querySelector('#empty-message');
        const httpCat = document.createElement('http-cat');

        // Si no hay mascotas, mostramos el mensaje de "vacío"
        if (!this._pets || this._pets.length === 0) {
            grid.style.display = 'none';
            emptyMessage.style.display = 'block';
            emptyMessage.appendChild(httpCat);
            return;
        }

        // Si hay mascotas, las mostramos
        grid.style.display = 'grid';
        emptyMessage.style.display = 'none';

        this._pets.forEach(petData => {
            const card = document.createElement('pet-card');
            
            // Le pasamos los datos del objeto a cada tarjeta
            card.petData = petData; 
            
            grid.appendChild(card);
        });
    }
}

customElements.define('pet-list', PetList);