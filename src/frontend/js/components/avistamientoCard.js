import { API } from '../api.js';
import { Auth } from '../auth.js';
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
        const card = this.querySelector('.avistamiento-card');

        if (!card) {
            console.error('No existe la tarjeta');
        }

        // Mapeo de datos
        this.querySelector('#card-avistamiento-pet-name').textContent = avistamiento.mascota_nombre;
        this.querySelector('#card-avistamiento-loc').textContent = avistamiento.direccion_formateada;
        this.querySelector('#card-avistamiento-date').textContent = new Date(avistamiento.fecha_hora).toLocaleDateString();
        this.querySelector('#card-avistamiento-desc').textContent = avistamiento.descripcion;
        
        // Carga de la imagen del avistamiento (con fallback)
        const imgElement = this.querySelector('#card-avistamiento-img');
        imgElement.src = avistamiento.foto_avistamiento_url || '../assets/placeholder.png';
        imgElement.onerror = () => { imgElement.src = '../assets/placeholder.png'; };


        // Lógica para los botones de acción
        const actions = this.querySelector('.avistamiento-card-actions');
        
        // Obtenemos los datos del usuario logueado desde Auth y comprobamos si es el dueño de la mascota
        const currentUser = Auth.getUserData(); 
        const isOwner = currentUser && currentUser.id === avistamiento.usuario_id;

        if (isOwner) {
            card.classList.add('is-owner');
            this.classList.add('is-owner');

            // Botones
            const btnDelete = this.querySelector('#btn-delete');

            // Borrar avistamiento de mascota
            btnDelete.onclick = async (e) => {
                e.stopPropagation();

                const confirmPanel = this.querySelector('#delete-confirm');

                if (confirmPanel) {
                    confirmPanel.open(this._avistamientoData.id, 'avistamiento', this._avistamientoData.foto_avistamiento_id);                }
            };

            // Borrar imagen de avistamiento de mascota
            const photoDelete = this.querySelector('#btn-delete-photo');
            photoDelete.addEventListener('click', async (e) => {
                e.stopPropagation();

                const confirmPanel = this.querySelector('#delete-confirm');
                const photoId = this._avistamientoData.foto_avistamiento_id;

                if (confirmPanel) 
                    confirmPanel.open(null, 'foto', photoId); 
            });

        } else {
            // Si no es el dueño, eliminamos el elemento del DOM por seguridad
            actions.remove(); 
        }

        // Al hacer click en la tarjeta redirecciona a pet-detail       
        card.addEventListener('click', () => {
            const id = this._avistamientoData.mascota_id;
            if (id) {
                window.location.href = `detalles?id=${id}`;
            } else {
                console.error("Error: La mascota no tiene ID", this._avistamientoData);
            }
        });

        // ACCESIBILIDAD: hacer la tarjeta enfocable y permitir activación por teclado
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button'); 
        card.setAttribute('aria-label', `Ver detalles del avistamiento de ${avistamiento.mascota_nombre}`);

        card.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const id = this._avistamientoData.mascota_id;
                if (id) window.location.href = `detalles?id=${id}`;
            }
        };

        // Badge de estado de la mascota en el momento del avistamiento
        this.applyBadge(avistamiento.estado_mascota);
        // Fotografía
        this.applyPhoto();
    }

        // Función para mostrar la fotografía
        // Obtiene tanto fotos en local como procedentes de Cloudinary
        applyPhoto() {
            if (!this._avistamientoData) return;
            
            const fotoPath = this._avistamientoData.foto_avistamiento_url;
            const finalUrl = API.resolveMediaUrl(fotoPath);

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
