import { API } from '../api.js';
import { Auth } from '../auth.js';

import { showInputError, clearInputErrors } from '../ui-utils.js';
import { showSuccess, showHttpError } from '../main.js';

import { PetMap } from './petMap.js';
import { addressAutocomplete } from '../ui-utils.js';

import { createTemplate } from "../ui-utils.js";
import { avisCreationFormHTML, avisCreationFormCSS } from "../templates/avistamientoCreationFormTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(avisCreationFormHTML, avisCreationFormCSS);


export class AvistamientoCreationForm extends HTMLElement {
    constructor() {
        super();
        this._petId = null;
        this._currentLocationDetails = null;
    }

    // Permitimos pasar el ID de la mascota dinámicamente
    set petId(value) {
        this._petId = value;
    }



    connectedCallback() {
        this.render();
    }



    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        const form = this.querySelector('#avistamiento-form');

        // Lógica para regisrar ubicaciones en el formulario
            const mapComponentForm = document.querySelector('#avistamiento-form-map');
            const latInput = document.querySelector('#lat-input');
            const lngInput = document.querySelector('#lng-input');
            const addressInput = this.querySelector('#avistamiento-form-loc');
            const searchBtn = this.querySelector('#avistamiento-search-btn');

            // Activamos el modo registro cuando cargue el mapa (usamos función de petMap.js)
            mapComponentForm.map.whenReady(() => {
                mapComponentForm.initRegistrationMode();
            });

            mapComponentForm.addEventListener('location-selected', (e) => {
            this._currentLocationDetails = {
                latitud: parseFloat(e.detail.lat),
                longitud: parseFloat(e.detail.lng),
                direccion_formateada: e.detail.direccion_formateada,
                municipio: e.detail.municipio,
                provincia: e.detail.provincia,
                codigo_postal: e.detail.codigo_postal,
                pais: e.detail.pais
            };

            // Actualizamos los inputs del formulario
            if (latInput) latInput.value = e.detail.lat;
            if (lngInput) lngInput.value = e.detail.lng;
            if (addressInput) addressInput.value = e.detail.direccion_formateada;
        });   

            // Uso del buscador por dirección (declarado en petMap.js)
            searchBtn.addEventListener('click', async () => {
                const result = await mapComponentForm.searchAddress(addressInput.value);
                if (result) {
                    this._currentLocationDetails = {
                        latitud: result.latitud,
                        longitud: result.longitud,
                        direccion_formateada: result.direccion_formateada,
                        municipio: result.municipio,
                        provincia: result.provincia,
                        codigo_postal: result.codigo_postal,
                        pais: result.pais
                    };
                    
                    // Actualizamos los inputs ocultos por seguridad
                    this.querySelector('#lat-input').value = result.latitud,
                    this.querySelector('#lng-input').value = result.longitud
                }
            });

        // Lógica para el autocompletado de direcciones (Usamos la API Nominatim con el método de ui-utils.js)
            const inputLoc = this.querySelector('#avistamiento-form-loc');
            const resultsContainer = this.querySelector('#loc-autocomplete');
            const mapComponent = this.querySelector('#avistamiento-form-map');

            addressAutocomplete(inputLoc, resultsContainer, (data) => {
                if (mapComponent && mapComponent.map) {
                    mapComponent.map.setView([data.lat, data.lon], 16);
                    if (mapComponent.registrationMarker) {
                        mapComponent.registrationMarker.setLatLng([data.lat, data.lon]);
                    }
                }
                console.log("Dirección seleccionada:", data.address);
            });










        // Lógica para registrar fotografías y previsualizarlas
            const fotoDiv = this.querySelector('.foto-div');
            const fotoInput = this.querySelector('#avistamiento-fotos');
            const previewContainer = this.querySelector('#preview-container');
            const fileNameLabel = this.querySelector('#file-name-label');
            const icon = this.querySelector('#upload-icon');

            
            // ACCESIBILIDAD
            fotoDiv.setAttribute('tabindex', '0'); // Permite que el teclado lo "vea"
            fotoDiv.setAttribute('role', 'button'); // Le dice al lector de voz que es un botón

            // Evento para el ratón
            fotoDiv.addEventListener('click', () => {
                fotoInput.click();
            });

            // Evento para el teclado
            fotoDiv.addEventListener('keydown', (e) => {
                // Si el usuario pulsa "Enter" o la barra espaciadora
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fotoInput.click(); 
                }
            });

            if (fotoInput) {
                fotoInput.onchange = (e) => {
                    const files = e.target.files;
                    previewContainer.innerHTML = '';

                    if (files.length > 0) {
                        // Ocultamos el icono y actualizamos el texto
                        if (icon) icon.style.display = 'none';
                        fileNameLabel.textContent = `${files.length} archivos seleccionados`;

                        // Creamos la miniatura de cada archivo
                        Array.from(files).forEach(file => {
                            const reader = new FileReader();
                            
                            // Creamos un elemento imagen para cada archivo
                            const img = document.createElement('img');
                            img.src = URL.createObjectURL(file);
                            
                            // Añadimos la imagen al contenedor
                            previewContainer.appendChild(img);
                        });
                    } else {
                        // Si el usuario cancela o no elige nada, restauramos el estado inicial
                        if (icon) icon.style.display = 'block';
                        fileNameLabel.textContent = "Haz clic para seleccionar o arrastra imágenes";
                    }
                };
            }

        // Cerrar formulario al pinchar fuera (overlay)
        const overlay = this.querySelector('#a-panel-overlay');
        overlay.onclick = () => this.close();

        // Limpiar campos
        const btnReset = this.querySelector('#avistamiento-btn-reset');
        btnReset.onclick = () => {
                form.reset();
                if (previewContainer) previewContainer.innerHTML = '';
                this._currentLocationDetails = null;

                const httpCat = this.querySelector('http-cat');
                if (httpCat) httpCat.style.display = 'none';
            };

        // Envío del formulario
        form.onsubmit = async (e) => {
            e.preventDefault();
            await this.sendMsg(); // Usamos método implementado abajo
        };

        this.loadUserData();
    }



    // Lógica para cargar los datos del usuario autenticado en el formulario
        async loadUserData() {
            const user = Auth.getUserData();

            if (user) {
                this.querySelector('#avistamiento-form-email').value = user.correo || '';
                this.querySelector('#avistamiento-form-telefono').value = user.telefono || '';
            }
        }
     
        

    // Lógica para validar los datos antes de enviarlos
        validateForm() {
            clearInputErrors(this);
            let isValid = true;

            const email = this.querySelector('#avistamiento-form-email').value;
            const phone = this.querySelector('#avistamiento-form-telefono').value;
            const dateVal = this.querySelector('#avistamiento-form-date').value;
            const timeVal = this.querySelector('#avistamiento-form-time').value;
            const address = this.querySelector('#avistamiento-form-loc').value;

            // Teléfono (Obligatorio)
            if (!phone.trim()) {
                showInputError(this, 'avistamiento-form-telefono', 'El teléfono es obligatorio para contactarte');
                isValid = false;
            } else if (!/^\+?[0-9\s\-]{9,15}$/.test(phone)) {
                showInputError(this, 'avistamiento-form-telefono', 'Formato de teléfono no válido');
                isValid = false;
            }


            // Email (Opcional, validamos formato)
            if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showInputError(this, 'avistamiento-form-email', 'El formato del correo no es válido');
                isValid = false;
            }

            // Ubicación
            if (!address.trim() || !this._currentLocationDetails) {
                showInputError(this, 'avistamiento-form-loc', 'Debes seleccionar una ubicación exacta en el mapa');
                isValid = false;
            }

            // Fecha y Hora
            if (!dateVal || !timeVal) {
                showInputError(this, 'avistamiento-form-date', 'Indica la fecha y hora del avistamiento');
                isValid = false;
            } else {
                const selectedDate = new Date(`${dateVal}T${timeVal}`);
                if (selectedDate > new Date()) {
                    showInputError(this, 'avistamiento-form-date', 'La fecha no puede ser posterior al momento actual.');
                    isValid = false;
                }
            }
            return isValid;
        }



    // Lógica para enviar el formulario
        async sendMsg() {
            // Limpiamos posibles errores previos
            clearInputErrors(this);
            const httpCat = document.querySelector('http-cat');
            if (httpCat) httpCat.style.display = 'none';
            

            if (!this._petId) {
                alert("Error: No se ha especificado la mascota.");
                return;
            }

            // Realizamos validaciones con el método de arriba
            if (!this.validateForm()) {
                    return; 
                }

            // Obtenemos datos ya validados
            const dateVal = this.querySelector('#avistamiento-form-date').value;
            const timeVal = this.querySelector('#avistamiento-form-time').value;
            const selectedDateFormat = `${dateVal} ${timeVal}:00`; // Formateamos la fecha

            // Aseguramos que tomamos los valores numéricos para latitud y longigud
            const lat = parseFloat(this._currentLocationDetails?.latitud || this.querySelector('#lat-input').value);
            const lng = parseFloat(this._currentLocationDetails?.longitud || this.querySelector('#lng-input').value);

            // Usamos FormData para poder enviar archivos (fotografía). El backend usa multipart
            const formData = new FormData();

            // Añadimos campos básicos
            formData.append('telefono', this.querySelector('#avistamiento-form-telefono').value);
            formData.append('correo', this.querySelector('#avistamiento-form-email').value);
            formData.append('descripcion', this.querySelector('#avistamiento-dsc').value);
            formData.append('fecha_hora', selectedDateFormat);

            // Campos de ubicación
            formData.append('latitud', lat);
            formData.append('longitud', lng);

            if (this._currentLocationDetails) {
                formData.append('direccion_formateada', this._currentLocationDetails.direccion_formateada);
                formData.append('municipio', this._currentLocationDetails.municipio);
                formData.append('provincia', this._currentLocationDetails.provincia);
                formData.append('codigo_postal', this._currentLocationDetails.codigo_postal);
                formData.append('pais', this._currentLocationDetails.pais);
                formData.append('ubicacion_descripcion', "Ubicación confirmada por el usuario");
            }
            
            // Añadimos fotos
            const fileInput = this.querySelector('#avistamiento-fotos');
            const fileInputFiles = fileInput.files;
            if (fileInput && fileInputFiles.length > 0) {
                for (let i = 0; i < fileInputFiles.length; i++) {
                        formData.append('fotos[]', fileInput.files[i]); 
                    }
            }
            
            // Seleccionamos botón de enviar
            const submitBtn = this.querySelector('#avistamiento-btn-send');
// FORZAR ERROR DE PRUEBA
const email = this.querySelector('#avistamiento-form-email').value;
if (email === 'test@gato.com') {
    showHttpError({ 
        code: 403, 
        message: "No tienes permisos para editar este perfil.",
        validationErrors: ["Tu sesión ha caducado", "Reintenta loguearte"]
    }, this);
    return; // Detiene el envío real
}

            try {

                // Iniciamos estado de espera (botón)
                submitBtn.disabled = true;
                submitBtn.textContent = "Enviando..";

                // Llamamos a la API pasando el FormData directamente
                await API.crearAvistamiento(this._petId, formData);
                showSuccess("¡Avistamiento registrado con éxito!", this);
                setTimeout(() => this.close(), 3000); // Se cierra automáticamente tras 3s
                
            } catch (error) {
                showHttpError(error, this);

            } finally {
                // Restauramos el botón
                submitBtn.disabled = false;
                submitBtn.textContent = "Enviar";
            }
        }



    // Método para abrir el formulario
        open(petId) {
            this._petId = petId;
            this.classList.add('is-visible');
            document.body.style.overflow = 'hidden'; // Evita scroll de fondo

            //Renderiza el mapa
            const petMap = this.querySelector('#avistamiento-form-map');
            if (petMap && petMap.map) {
                setTimeout(() => {
                    petMap.map.invalidateSize();
                }, 100);
            }
        }



    // Método para cerrar el formulario
        close() {
            this.classList.remove('is-visible');
            document.body.style.overflow = 'auto';
            this.querySelector('#avistamiento-form').reset();

            const httpCat = this.querySelector('http-cat');
            if (httpCat) httpCat.style.display = 'none';
        }
}

customElements.define('avistamiento-creation-form', AvistamientoCreationForm);