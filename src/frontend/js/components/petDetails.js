import { API } from '../api.js';
import { PetContactForm } from './petContactForm.js';
import { AvistamientoCreationForm } from './avistamientoCreationForm.js';
import { showHttpError, showSuccess } from '../main.js';

import { createTemplate } from "../ui-utils.js";
import { petDetailsHTML, petDetailsCSS } from "../templates/petDetailsTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(petDetailsCSS);


export class PetDetail extends HTMLElement {
    constructor() {
        super();
        // Inicializamos el estado interno para guardar los datos de la mascota
        this.petData = null;
        this.currentIndex = 0; // Posición inicial del carrousel de imágenes
    }

    // Al conectarse, obtenemos el ID de la mascota desde un atributo o la URL
    async connectedCallback() {
        const petId = this.getAttribute('pet-id') || new URLSearchParams(window.location.search).get('id');

        if (petId) {
            console.log('recibiendo id');
            await this.fetchPetData(petId);
            console.log(' id recibido');
        } else {
            return;
        }
    }

    // Realizamos la llamada a la API que definimos en api.js
    async fetchPetData(id) {
        // Limpiamos posibles errores previos
        const httpCat = document.querySelector('http-cat');
        if (httpCat) httpCat.style.display = 'none';

        try {
            // Utilizamos el método getMascotaById(id) de tu archivo api.js
            console.log('fetch');
            this.petData = await API.getMascotaById(id);
            this.render();
        } catch (error) {
            console.error("Error cargando mascota:", error);
            showHttpError(error);
            return;
        }
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        // Imágenes
            const carrousel = this.querySelector('#carousel');
            const dotsContainer = this.querySelector('#carousel-dots');
            const photos = this.petData.fotos || [];

            if (photos.length > 0) {
                photos.forEach((photo, index) => {
                    const img = document.createElement('img');
                    img.src = photo.url;
                    img.alt = `Foto ${index + 1} de ${this.petData.nombre}`;
                    carrousel.appendChild(img);

                    // Creamos los puntos indicadores
                    const dot = document.createElement('div');
                    dot.className = `dot ${index === 0 ? 'active' : ''}`;
                    dot.onclick = () => this.moveToImage(index);
                    dotsContainer.appendChild(dot);
                });
            } else {
                // Imagen por defecto si no hay fotos
                carrousel.innerHTML = `<img src="../assets/placeholder.png">`;
            }

            // Ocultamos flechas si solo hay una imagen
            if (photos.length <= 1) {
                this.querySelector('#prev-btn').classList.add('hidden');
                this.querySelector('#next-btn').classList.add('hidden');
            }
    
        // Descripción y nombre
            this.querySelector('#pet-det-description').textContent = `${this.petData.descripcion}`;
            this.querySelector('#pet-name').textContent = `Datos de ${this.petData.nombre}`;

        // Lista de detalles
            const list = this.querySelector('#pet-det-list');
            list.innerHTML = '';

            // Función rápida para poner la primera letra de una palabra en mayúscula y resto minúscula
            const formatText = (str) => {
                if (!str) return 'Desconocido';
            };

            // Colores
            const colores = this.petData.colores;

            const coloresFormateados = colores.map(
                col => col.nombre).join(', ');

            const info = [
                `<strong>Estado:</strong> ${this.petData.estado}`,
                `<strong>Raza:</strong> ${this.petData.raza_nombre || 'Desconocida'}`,
                `<strong>Sexo:</strong> ${(this.petData.sexo || '').toLowerCase()}`,
                `<strong>Tamaño:</strong> ${(this.petData.tamano || '').toLowerCase()}`,
                `<strong>Colores:</strong> ${coloresFormateados || 'No especificados'}`,
                `<strong>Chip:</strong> ${(this.petData.tiene_chip ? 'Sí' : 'No').toLowerCase()}`,
                `<strong>Vista por última vez:</strong> ${this.petData.municipio}, ${this.petData.provincia}`            
            ];

            
                info.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = item;
                list.appendChild(li);
            });

   
        // Ejecutamo funciones definidas abajo
        this.initCarouselEvents();
        this.buttonEvents();
    }

    // Lógica para mover el carrousel de imágenes
    moveToImage(index) {
        const photos = this.petData.fotos || [];
        if (index < 0) index = photos.length - 1;
        if (index >= photos.length) index = 0;

        this.currentIndex = index;
        const carrousel = this.querySelector('#carousel');
        const dots = this.querySelectorAll('.dot');

        // Desplazamos el track horizontalmente
        carrousel.style.transform = `translateX(-${index * 100}%)`;

        // Actualizamos puntitos
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Botones del carrousel
    initCarouselEvents() {
        this.querySelector('#prev-btn').onclick = () => this.moveToImage(this.currentIndex - 1);
        this.querySelector('#next-btn').onclick = () => this.moveToImage(this.currentIndex + 1);
    }
    

    // Lógica de los botones
    buttonEvents() {
        // Botón contactar
        const contactBtn = this.querySelector('#btn-contact');
        const contactForm = this.querySelector('#contact-modal');

        if (contactBtn && contactForm) {
                contactBtn.onclick = () => {
                contactForm.open(this.petData.id);
            };
        };

        // Botón avistamiento
        const avistamientoBtn = this.querySelector('#btn-avistamiento');
        const avistamientoForm = this.querySelector('#avistamiento-modal');

        if (avistamientoBtn && avistamientoForm) {
                avistamientoBtn.onclick = () => {
                console.log("Click en botón avistamiento");
                avistamientoForm.open(this.petData.id);
            };
        };

/*PENDIENTE IMPLEMENTAR QR  
  const QRBtn = this.querySelector('#btn-qr');
        const QR = this.querySelector('#qr');
        QRBtn.addEventListener('click', () => {
            if (this.petData && this.petData.id) {
                QR.open(this.petData.id);
            }
        });
*/



//PENDIENTE IMPLEMENTAR BOTONES RRSS
  
    }

}

customElements.define('pet-detail-section', PetDetail);