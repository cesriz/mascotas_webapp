import { API } from '../api.js';
import { showSuccess, showHttpError } from "../main.js";
import { createTemplate } from "../ui-utils.js";
import { avistamientoCardHTML, avistamientoCardCSS } from "../templates/avistamientoCardTemplate.js";

const template = createTemplate(avistamientoCardHTML, avistamientoCardCSS);

export class AvistamientoCard extends HTMLElement {
    constructor() {
        super();
        this._avistamientoData = null;
    }

    // Setter para inyectar los datos del avistamiento
    set avistamientoData(data) {
        this._avistamientoData = data;
        this.render();
    }

    connectedCallback() {
        this.style.display = 'block';
        if (this._avistamientoData) {
            this.render();
        }
    }

    render() {
        if (!this._avistamientoData) return;

        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        const avistamiento = this._avistamientoData;

        // Mapeo de datos
        this.querySelector('#card-avistamiento-pet-name').textContent = avistamiento.mascota_nombre;
        this.querySelector('#card-avistamiento-loc').textContent = avistamiento.direccion_formateada;
        this.querySelector('#card-avistamiento-date').textContent = new Date(avistamiento.fecha_hora).toLocaleDateString();
        this.querySelector('#card-avistamiento-desc').textContent = avistamiento.descripcion;
        
        // Carga de la imagen del avistamiento (con fallback)
        const imgElement = this.querySelector('#card-avistamiento-img');
        imgElement.src = avistamiento.foto_avistamiento_url || '../assets/placeholder.png';
        imgElement.onerror = () => { imgElement.src = '../assets/placeholder.png'; };

        // Al hacer click en la tarjeta redirecciona a pet-detail
        const card = this.querySelector('.avistamiento-card');

        if (!card) {
            console.error('No existe la tarjeta');

        }
        
        card.addEventListener('click', () => {
            const id = this._avistamientoData.mascota_id;
            console.log(id);
            
            if (id) {
                window.location.href = `detalles?id=${id}`;
            } else {
                console.error("Error: La mascota no tiene ID", this._avistamientoData);
            }
        });

        // Badge de estado de la mascota en el momento del avistamiento
        this.applyBadge(avistamiento.estado_mascota);
        // Fotografía
        this.applyPhoto();
    }

        // Función para mostrar la fotografía
        // Obtiene tanto fotos en local como procedentes de Cloudinary
        applyPhoto() {
            const BASE_URL = 'http://localhost:3000'; // Servidor local

            if (!this._avistamientoData) return;
            
            const fotoPath = this._avistamientoData.foto_avistamiento_url;
            let finalUrl = '../assets/placeholder.png'; // Imagen por defecto

            // Verificación de seguridad
            if (fotoPath && typeof fotoPath === 'string') {
                // Si empieza por "http" y contiene "cloudinary" o "localhost", usamos la url tal cual.
                if (fotoPath.startsWith('http')) {
                        finalUrl = fotoPath;
                    } else {
                        // Si es una ruta relativa que empieza por "/" (ej: /uploads/...)
                        const cleanPath = fotoPath.startsWith('/') ? fotoPath : `/${fotoPath}`;
                        finalUrl = BASE_URL + cleanPath;
                    }
                }

            // Buscamos la imagen y asignamos la URL
            const imgElement = this.querySelector('#card-avistamiento-img');
            if (imgElement) {
                imgElement.src = finalUrl;
                // Si la imagen falla al cargar (404), ponemos el placeholder
                imgElement.onerror = () => {
                imgElement.src = '../assets/placeholder.png';
                };
            }
        }


        // Función para mostrar el badge de forma dinámica según el estado de la mascota
        applyBadge(estado) {
            const badge = this.querySelector('#avistamiento-badge');
            const badgeText = this.querySelector('#badge-text');
            if (!badge || !badgeText) return;

            const est = estado ? estado.toLowerCase() : '';
            badge.className = 'badge'; 
            if (est === 'perdida') badge.classList.add('badge-perdido');
            if (est === 'encontrada') badge.classList.add('badge-encontrado');
            if (est === 'recuperada') badge.classList.add('badge-recuperado');
    
            badgeText.textContent = est.toUpperCase();
        }
}

customElements.define('avistamiento-card', AvistamientoCard);