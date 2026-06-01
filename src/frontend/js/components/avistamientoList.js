import { API } from "../api.js";
import { createTemplate } from "../ui-utils.js";
import { avistamientoListHTML, avistamientoListCSS } from "../templates/avistamientoListTemplate.js";
import { AvistamientoCard } from "./avistamientoCard.js"; // Asegúrate de que está registrado
import { showHttpError } from "../main.js";

const template = createTemplate(avistamientoListHTML, avistamientoListCSS);

export class AvistamientoList extends HTMLElement {
    constructor() {
        super();
        this._avistamientos = [];
    }

    async connectedCallback() {

        this.appendChild(template.content.cloneNode(true));
        await this.loadMyAvistamientos();
    }

    // Metodo para cargar avistamientos reportados por el usuario
    async loadMyAvistamientos() {
        const grid = this.querySelector('#avistamientos-grid');
        
        try {

              this._avistamientos = await API.getMisAvistamientos(); 
    
            // Limpiamos el texto de carga inicial
            grid.innerHTML = ''; 
    
            // Control de lista vacía
            if (!this._avistamientos || this._avistamientos.length === 0) {
                const emptyDiv = this.querySelector('#empty-state');
                emptyDiv.innerHTML = 
                    `   <p>No se encontraron avistamientos reportados.</p>
                        <img src="../assets/Gemini_Generated_Image_12vyw712vyw712vy.png" alt="Gato cuenco vacío" id="list-img">
                    `;
                return;
            }

            
            // Creamos componentes avistamiento-card uno por uno
            this._avistamientos.forEach(data => {
                const card = document.createElement('avistamiento-card'); 
                
                // Usamos el setter 'avistamientoData' de avistamientoCard
                card.avistamientoData = data; 
                
                // Lo añadimos a la cuadrícula
                grid.appendChild(card);
            });

        } catch (error) {
            console.error("Error al cargar la lista de avistamientos del usuario:", error);
            showHttpError(error, this);
        }
    }
}

// Registramos el Custom Element para poder usarlo como <avistamiento-list></avistamiento-list>
customElements.define('avistamiento-list', AvistamientoList);