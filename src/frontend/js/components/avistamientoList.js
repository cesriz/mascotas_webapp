// components/avistamientoList.js

import { API } from "../api.js";
import { createTemplate } from "../ui-utils.js";
import { avistamientoListHTML, avistamientoListCSS } from "../templates/avistamientoListTemplate.js";
import { AvistamientoCard } from "./avistamientoCard.js"; // Asegúrate de que está registrado

// Instanciamos la utilidad para empaquetar el template
const template = createTemplate(avistamientoListHTML, avistamientoListCSS);

export class AvistamientoList extends HTMLElement {
    constructor() {
        super();
        this._avistamientos = [];
    }

    async connectedCallback() {
        // 1. Inyectamos la estructura base en el DOM del componente
        this.appendChild(template.content.cloneNode(true));
        
        // 2. Cargamos y renderizamos los datos del usuario
        await this.loadMyAvistamientos();
    }

    async loadMyAvistamientos() {
        const grid = this.querySelector('#avistamientos-grid');
        
        try {
            // Hacemos el fetch a tu endpoint específico (ajústalo según tu api.js)
            this._avistamientos = await API.getMisAvistamientos(); 

            // Limpiamos el texto de carga inicial
            grid.innerHTML = ''; 

            // Control de lista vacía
            if (!this._avistamientos || this._avistamientos.length === 0) {
                grid.innerHTML = '<p class="no-data-text">No has reportado ningún avistamiento todavía.</p>';
                return;
            }

            // 3. Renderizado dinámico: Creamos componentes avistamiento-card uno por uno
            this._avistamientos.forEach(data => {
                const card = document.createElement('avistamiento-card'); 
                
                // Usamos el setter 'avistamientoData' que ya tienes programado en tu tarjeta
                card.avistamientoData = data; 
                
                // Lo añadimos a la cuadrícula
                grid.appendChild(card);
            });

        } catch (error) {
            console.error("Error al cargar la lista de avistamientos del usuario:", error);
            if (grid) {
                grid.innerHTML = '<p class="error-text">Hubo un problema al cargar tus avistamientos. Inténtalo de nuevo más tarde.</p>';
            }
        }
    }
}

// Registramos el Custom Element para poder usarlo como <avistamiento-list></avistamiento-list>
customElements.define('avistamiento-list', AvistamientoList);