import { Auth } from '../auth.js'; // Importante para la lógica de dueño
import { API } from '../api.js';
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
        const overlay = this.querySelector('.card-overlay');

        // Lógica del usuario - overlay
        // Obtenemos los datos del usuario logueado desde Auth y comprobamos si es el dueño de la mascota
        const currentUser = Auth.getUserData(); 
        const isOwner = currentUser && currentUser.id === pet.usuario_id;

        // Datos básicos de la mascota
        this.querySelector('#card-pet-img').alt = `Foto de ${pet.nombre}`;
        this.querySelector('#card-pet-raza').textContent = pet.raza_nombre || 'Desconocida';
        this.querySelector('#card-pet-loc').textContent = `${pet.municipio}, ${pet.provincia}`;
        this.querySelector('#card-pet-date').textContent = pet.fecha_evento ? new Date(pet.fecha_evento).toLocaleDateString() : 'Fecha no disponible';

        // Si el usuario es el dueño, mostramos el overlay y sus botones
        if (isOwner) {
            card.classList.add('is-owner');

            // Botones
            const btnVer = this.querySelector('#btn-ver');
            const btnEdit = this.querySelector('#btn-edit');
            const btnRecuperar = this.querySelector('#btn-recuperar');
            const btnDelete = this.querySelector('#btn-delete');

            // Lógica de botones
            // Ver detalles
            this.onclick = (e) => {
                e.stopPropagation();
                window.location.href = `detalles.html?id=${pet.id}`
            };

            // Editar
            btnEdit.onclick = (e) => {
                e.stopPropagation();
                window.location.href = `editar.html?id=${pet.id}`;
            };

            // Borrar
            btnDelete.onclick = async (e) => {
                e.stopPropagation();
                if (!confirm('¿Borrar anuncio?')) return;

                try {
                    await API.deleteMascota(pet.id);

                    showSuccess('Anuncio eliminado correctamente');
                    this.remove();

                } catch (error) {
                    showHttpError(error, this);
                }
            };

            // Marcar como recuperada
            btnRecuperar.onclick = async (e) => {
                e.stopPropagation();
                try {
                    await API.marcarRecuperada(pet.id);

                    showSuccess('Mascota marcada como recuperada');

                    window.location.reload();

                } catch (error) {
                    showHttpError(error);
                }
            };

            // Si ya está recuperada, ocultamos el botón de "¡Recuperada!".
            if (pet.estado?.toLowerCase() === 'recuperada') {
                btnRecuperar.style.display = 'none';
            }

        } else {
            // Si no, toda la tarjeta es un link que redirecciona a pet-detail
            card.addEventListener('click', () => {
                window.location.href = `detalles.html?id=${pet.id}`;
            });

            overlay.remove();
        }

        // Aplicamos funciones para mostrar la foto, el badge y el titulo
        this.applyPhoto();
        this.applyBadge(pet.estado);
        this.applyTitle(pet);
    }

        // Función para mostrar la fotografía
        // Obtiene tanto fotos en local como procedentes de Cloudinary
        applyPhoto() {
            const BASE_URL = 'http://localhost:3000'; // Servidor local

            if (!this._petData) return;
            
            const fotoPath = this._petData.foto_principal_url;
            let finalUrl = '../assets/placeholder.png'; // Imagen por defecto
    
            // Verificación de seguridad
            if (fotoPath && typeof fotoPath === 'string') {
                // Si empieza por "http" y contiene "cloudinary" o "localhost", usamos la url tal cual.
                if (fotoPath.startsWith('http')) {
                        finalUrl = fotoPath;
                    } else {
                        // Si es una ruta relativa que empieza por "/" (ej: /uploads/...)
                        const cleanPath = fotoPath.startsWith('/') ? fotoPath : `/${fotoPath}`;
                        finalUrl = cleanPath;
                    }
                }

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
