import { API } from '../api.js';
import { Auth } from '../auth.js';
import { PetMap } from './petMap.js';
import { showHttpError, showSuccess } from '../main.js';

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
                console.log(result);
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

            fotoDiv.addEventListener('click', () => {
                fotoInput.click();
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
                previewImg.style.display = 'none';
                this._currentLocationDetails = null;
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
           

    // Lógica para enviar el formulario
        async sendMsg() {
            // Limpiamos posibles errores previos
            const httpCat = document.querySelector('http-cat');
            if (httpCat) httpCat.style.display = 'none';

            if (!this._petId) {
                alert("Error: No se ha especificado la mascota.");
                return;
            }

            // Obtenemos valores del formulario
            const dateVal = this.querySelector('#avistamiento-form-date').value;
            const timeVal = this.querySelector('#avistamiento-form-time').value;

            // Validaciones básicas antes de enviar
            if (!dateVal || !timeVal) {
                alert("Por favor, indica la fecha y la hora del avistamiento.");
                return;
            }

            // Validamos la fecha y formateamos para el backend: "YYYY-MM-DD HH:mm:ss"
            const selectedDate = new Date(`${dateVal}T${timeVal}`);
            const today = new Date();
            if (selectedDate > today) {
                alert("La fecha y hora del avistamiento no pueden ser posteriores al momento actual.");
                return;
            }

            const selectedDateFormat = `${dateVal} ${timeVal}:00`;


            if (!this._currentLocationDetails) {
                alert("Primero busca una dirección en el mapa para obtener los datos de ubicación.");
                return;
            }

            // Aseguramos que tomamos los valores numéricos para latitud y longigud
            const lat = parseFloat(this._currentLocationDetails?.latitud || this.querySelector('#lat-input').value);
            const lng = parseFloat(this._currentLocationDetails?.longitud || this.querySelector('#lng-input').value);

            if (isNaN(lat) || isNaN(lng)) {
                alert("La ubicación no es válida. Por favor, selecciona un punto en el mapa.");
                return;
            }

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

            try {
                // Llamamos a la API pasando el FormData directamente
                const response = await API.crearAvistamiento(this._petId, formData);
                showSuccess("¡Avistamiento registrado con éxito!");
                setTimeout(() => this.close(), 2000); // Se cierra automáticamente tras 2s
                
            } catch (error) {
                console.error("Error al enviar el avistamiento:", error);
                //showHttpError(error, this);
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
        }
}

customElements.define('avistamiento-creation-form', AvistamientoCreationForm);