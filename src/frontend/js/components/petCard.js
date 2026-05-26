import { Auth } from '../auth.js'; // Importante para la lógica de dueño
import { API } from '../api.js';
import { DeleteConfirm } from './deleteConfirm.js';
import { RecoverConfirm } from './recoverConfirm.js';
import { createTemplate } from "../ui-utils.js";
import { petCardHTML, petCardCSS } from "../templates/petCardTemplate.js";
import { showSuccess, showHttpError } from "../main.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(petCardHTML, petCardCSS);


export class PetCard extends HTMLElement {
    constructor() {
        super();
        this._petData = null;
    }

    set petData(data) {
        this._petData = data;
        this.render();
    }

    connectedCallback() {
        if (this._petData) {
            this.render();
        }
    }

    render() {
        if (!this._petData) return;

        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        const pet = this._petData;
        const card = this.querySelector('.pet-card');

        // Datos básicos de la mascota
        this.querySelector('#card-pet-img').alt = `Foto de ${pet.nombre}`;
        this.querySelector('#card-pet-raza').textContent = pet.raza_nombre || 'Desconocida';
        this.querySelector('#card-pet-loc').textContent = `${pet.municipio}, ${pet.provincia}`;
        this.querySelector('#card-pet-date').textContent = pet.fecha_evento ? new Date(pet.fecha_evento).toLocaleDateString() : 'Fecha no disponible';

        // Lógica para los botones de acción
        const actions = this.querySelector('.pet-card-actions');
        
        // Obtenemos los datos del usuario logueado desde Auth y comprobamos si es el dueño de la mascota
        const currentUser = Auth.getUserData(); 
        const isOwner = currentUser && currentUser.id === pet.usuario_id;

        if (isOwner) {
            card.classList.add('is-owner');
            this.classList.add('is-owner');

            // Botones
            const btnEdit = this.querySelector('#btn-edit');
            const btnRecover = this.querySelector('#btn-recover');
            const btnDelete = this.querySelector('#btn-delete');

            // Editar anuncio de mascota
            btnEdit.onclick = (e) => {
                e.stopPropagation();
                
                if (btnEdit) {
                    const petId = this._petData.id;
                    if (petId) {
                        window.location.href = `perfil?panel=publicar&editar=${petId}`
                    } else 
                        window.location.href = `perfil?panel=mascotas`;
                }
            };

            // Borrar anuncio de mascota
            btnDelete.onclick = async (e) => {
                e.stopPropagation();

                const confirmPanel = this.querySelector('#delete-confirm');

                if (confirmPanel) {
                    confirmPanel.open(pet.id, 'mascota', null);
                }

            };

            // Marcar como recuperada
            btnRecover.onclick = async (e) => {
                e.stopPropagation();

                const confirmRPanel = this.querySelector('#recover-confirm');

                if (confirmRPanel) {
                    confirmRPanel.open(pet.id);
                }
            };

            // Si ya está recuperada, ocultamos el botón de "¡Recuperada!".
            if (pet.estado?.toLowerCase() === 'recuperada') {
                btnRecover.style.display = 'none';
            }

        } else {
            // Si no es el dueño, eliminamos el elemento del DOM por seguridad
            actions.remove(); 
        }


        // Ver detalles de mascota: toda la tarjeta es un link que redirecciona a pet-detail
        card.addEventListener('click', () => {
            const id = this._petData.id;
            if (id) {
                window.location.href = `detalles?id=${id}`;
            } else {
                console.error("Error: La mascota no tiene ID", this._petData);
            }
        });

        // Aplicamos funciones para mostrar la foto, el badge y el titulo
        this.applyPhoto();
        this.applyBadge(pet.estado);
        this.applyTitle(pet);
    }

        // Función para mostrar la fotografía
        // Obtiene tanto fotos en local como procedentes de Cloudinary
        applyPhoto() {
            if (!this._petData) return;
            
            const fotoPath = this._petData.foto_principal_url;
            const finalUrl = API.resolveMediaUrl(fotoPath);

            // Buscamos la imagen y asignamos la URL
            const imgElement = this.querySelector('#card-pet-img');
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
            const badge = this.querySelector('#pet-badge');
            const badgeText = this.querySelector('#badge-text');
            const est = estado ? estado.toLowerCase() : '';
            
            badge.classList.remove('badge-perdido', 'badge-encontrado', 'badge-recuperado');

            if (est === 'perdida') badge.classList.add('badge-perdido');
            if (est === 'encontrada') badge.classList.add('badge-encontrado');
            if (est === 'recuperada') badge.classList.add('badge-recuperado');
            badgeText.textContent = est.toUpperCase();
        }


        // Función para mostrar el título del anuncio de forma dinámica según el estado
        applyTitle(pet) {
            const container = this.querySelector('.pet-card-title');
            if (!container) return;

            const est = pet.estado ? pet.estado.toLowerCase() : '';
            let htmlContent = '';

            if (est === 'perdida') {
                htmlContent = `<h3>Se busca a <span id="card-pet-name">${pet.nombre}</span></h3>`;
            } 
            else if (est === 'encontrada') {
                htmlContent = '<h3>Se ha encontrado ' + pet.especie_nombre.toLowerCase() || 'animal ' + '</h3>';
            } 
            else if (est === 'recuperada') {
                htmlContent = `<h3>¡<span id="card-pet-name">${pet.nombre}</span> ha vuelto a casa!</h3>`;
            }

            container.innerHTML = htmlContent;
        }

}

customElements.define('pet-card', PetCard);
