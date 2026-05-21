import { API } from '../api.js';
import { Auth } from '../auth.js';
import { PetContactForm } from './petContactForm.js';
import { AvistamientoCreationForm } from './avistamientoCreationForm.js';
import { QRCodeComponent } from './qr.js';
import { showHttpError, showSuccess } from '../main.js';

import { createTemplate } from "../ui-utils.js";
import { petDetailsHTML, petDetailsCSS } from "../templates/petDetailsTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(petDetailsHTML, petDetailsCSS);


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
            await this.fetchPetData(petId);
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
            // Utilizamos el método getMascotaById(id) de api.js
            this.petData = await API.getMascotaById(id);

            console.log(this.petData);
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

        // Título
            this.applyTitle(this.petData);

        // Imágenes
            const carrousel = this.querySelector('#carrousel');
            const dotsContainer = this.querySelector('#carrousel-dots');
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
            
        // Datos del evento
        // Fecha - mostramos una fecha u otra según el estado de la mascota
            const eventDateMap = {
                PERDIDA: this.petData.fecha_perdida,
                ENCONTRADA: this.petData.fecha_encontrada
            };
            const eventDate = this.petData.recuperada === 'RECUPERADA' ? this.petData.fecha_recuperada : eventDateMap[this.petData.estado] || '';
            
            // Formateamos fecha a DD/MM/YYYY
            const eventDateFormatted = eventDate ? new Date(eventDate).toLocaleDateString('es-ES') : 'No disponible';
            
            this.querySelector('#pet-det-date').textContent = `Fecha del suceso: ${eventDateFormatted}`;

        // Dirección
            this.querySelector('#pet-det-loc').textContent = `Lugar del suceso: ${this.petData.direccion_formateada}`
        
        // Recompensa.
            const reward = this.querySelector('.pet-det-reward-div');

            if (reward && this.petData.recompensa !== null && this.petData.recompensa > 0) {
                reward.style.display = 'flex';
            } else if (reward) {
                reward.style.display = 'none';
            }

        // Descripción y nombre
            this.querySelector('#pet-det-description').textContent = `${this.petData.descripcion}`;
            this.querySelector('#pet-name').textContent = `Características de ${this.petData.nombre}`;

        // Lista de detalles
            const list = this.querySelector('#pet-det-list');
            list.innerHTML = '';

            // Ponemos primera letra de cada palabra en mayúscula y resto minúscula
            const formatText = (str) => {
                if (!str) return 'Desconocido';
                return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            };
            
            // Colores
            const colors = this.petData.colores;

            const formatColors = colors.map(
                col => col.nombre).join(', ');

            // Edad - la calculamos según el año de nacimiento
            const birthDate = this.petData.fecha_nacimiento;
            const age = birthDate ? `${new Date().getFullYear() - new Date(birthDate).getFullYear()} años` : 'Desconocida';

            // Resto de datos
            const info = [
                `<strong>Especie:</strong> ${this.petData.especie_nombre || 'Desconocida'}`,
                `<strong>Raza:</strong> ${this.petData.raza_nombre || 'Desconocida'}`,
                `<strong>Sexo:</strong> ${(this.petData.sexo || '').toLowerCase() || 'Desconocido'}`,
                `<strong>Edad:</strong> ${age}`,
                `<strong>Tamaño:</strong> ${(this.petData.tamano || '').toLowerCase() || 'Desconocido'} `,
                `<strong>Peso:</strong> ${(this.petData.peso || '') || 'Desconocido'} `,
                `<strong>Colores:</strong> ${formatColors || 'No especificados'}`,
                `<strong>Chip:</strong> ${(this.petData.tiene_chip ? 'Sí' : 'No').toLowerCase() || 'Desconocido '}`          
            ];
            
                info.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = item;
                list.appendChild(li);
            });

   
        // Ejecutamos funciones definidas abajo
        this.initCarouselEvents();
        this.buttonEvents();
        this.applyButtons(this.petData);
    }

    // Lógica para mostrar el título del anuncio de forma dinámica según el estado
    applyTitle(pet) {
        const container = this.querySelector('.pet-details-title');
        if (!container) return;

        const est = pet.estado ? pet.estado.toLowerCase() : '';
        let htmlContent = '';

        if (est === 'perdida') {
            htmlContent = '<h3>SE BUSCA A <span id="pet-details-name">' + pet.nombre.toUpperCase() + '</span></h3>';
        } 
        else if (est === 'encontrada') {
            htmlContent = '<h3>SE HA ENCONTRADO ' + pet.especie_nombre.toUpperCase() || 'animal ' + '</h3>';
        } 
        else if (est === 'recuperada') {
            htmlContent = '<h3>¡<span id="pet-details-name">' + pet.nombre.toUpperCase() + '</span> HA VUELTO A CASA!</h3>';
        }

        container.innerHTML = htmlContent;
    }

    // Lógica para mostrar los botones del anuncio de forma dinámica según el estado y el propietario
    applyButtons(pet) {
        // Botón de avistamiento
        const avBtn = this.querySelector('#btn-avistamiento');
        if (!avBtn) return;

        const est = pet.estado ? pet.estado.toLowerCase() : '';
        if (est === 'encontrada' || est === 'recuperada') {
            avBtn.classList.add('hidden');
            avBtn.style.display = 'none';        
        }  else {
            avBtn.classList.remove('hidden');
            avBtn.style.display = 'block';
        }

        // Botón de reporte
        const repBtn = this.querySelector('#btn-report');
        const contcBtn = this.querySelector('#btn-contact');
        
        // Obtenemos los datos del usuario logueado desde Auth y comprobamos si es el dueño de la mascota
        const currentUser = Auth.getUserData(); 
        const isOwner = currentUser && currentUser.id === pet.usuario_id;

        if (isOwner) {
            avBtn.classList.add('hidden');
            repBtn.classList.add('hidden');
            contcBtn.classList.add('hidden');
        }  else {
            repBtn.classList.remove('hidden');
            contcBtn.classList.remove('hidden');
            avBtn.classList.remove('hidden');
        }

        // Botones de edición (están ocultos por defecto)
        const btnEdit = this.querySelector('#btn-edit');
        const btnRecover = this.querySelector('#btn-recover');
        const btnDelete = this.querySelector('#btn-delete');

        if (isOwner) {
            // Mostramos botones
            btnEdit.classList.remove('hidden');
            btnRecover.classList.remove('hidden');
            btnDelete.classList.remove('hidden');

            // Editar anuncio de mascota
            btnEdit.onclick = (e) => {
                e.stopPropagation();
                
                if (btnEdit) {
                    const petId = this.petData.id;
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
                    confirmPanel.open(this.petData.id);
                }

            };

            // Marcar como recuperada
            btnRecover.onclick = async (e) => {
                e.stopPropagation();

                const confirmRPanel = this.querySelector('#recover-confirm');

                if (confirmRPanel) {
                    confirmRPanel.open(this.petData.id);
                }
            };

        } if (isOwner && est == 'recuperada') {
            // Ocultamos el botón de 'recuperada'
            btnRecover.classList.add('hidden');
        }

    }

    // Lógica para mover el carrousel de imágenes
    moveToImage(index) {
        const photos = this.petData.fotos || [];
        if (index < 0) index = photos.length - 1;
        if (index >= photos.length) index = 0;

        this.currentIndex = index;
        const carrousel = this.querySelector('#carrousel');
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

        const QRBtn = this.querySelector('#btn-qr');
        const QR = this.querySelector('#qr');
        QRBtn.addEventListener('click', () => {
           QR.open();
        });

        // Botón reportar
        const reporteBtn = this.querySelector('#btn-report');
        const reportForm = this.querySelector('#report-modal');

        if (reporteBtn && reportForm) {
            reporteBtn.onclick = () => {
                console.log("Click en botón de reporte");
                reportForm.open(this.petData.id);
            };
        };

        //PENDIENTE IMPLEMENTAR BOTONES RRSS
  
    }

}

customElements.define('pet-details', PetDetail);