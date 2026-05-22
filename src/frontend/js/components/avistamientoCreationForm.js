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

        const overlay = this.querySelector('#a-panel-overlay');
        const form = this.querySelector('#avistamiento-form');
        const btnReset = this.querySelector('#avistamiento-btn-reset');

        // Lógica para regisrar ubicaciones en el formulario
            const mapComponentForm = document.querySelector('#avistamiento-form-map');
            const latInput = document.querySelector('#lat-input');
            const lngInput = document.querySelector('#lng-input');
            const addressInput = this.querySelector('#avistamiento-form-loc');
            const searchBtn = this.querySelector('#avistamiento-search-btn');

            // Activamos el modo registro cuando cargue el mapa
            // Utilizamos una función propia de Leaflet
            mapComponentForm.map.whenReady(() => {
                mapComponentForm.initRegistrationMode();
            });

            // Si el usuario mueve el marcador, obtenemos coordenadas
            mapComponentForm.addEventListener('location-selected', async (e) => {

                const lat = e.detail.lat;
                const lng = e.detail.lng;
                
                latInput.value = lat;
                lngInput.value = lng;

                try {
                    // Llamamos a la API de Nominatim para obtener la dirección real de las coordenadas
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);                    
                    const result = await response.json();

                    if (result && result.address) {
                        // Guardamos datos de la ubicación
                        this._currentLocationDetails = {
                            latitud: parseFloat(lat),
                            longitud: parseFloat(lng),
                            direccion_formateada: result.display_name,
                            municipio: result.address.city || result.address.town || result.address.village || "No especificado",
                            provincia: result.address.province || result.address.state || "No especificado",
                            codigo_postal: result.address.postcode || "",
                            pais: result.address.country || "España"
                        };

                        // Actualizamos el input de direcciones
                        if (addressInput) {
                            addressInput.value = result.display_name;
                        }
                        
                        console.log("Datos de ubicación actualizados:", this._currentLocationDetails);
                    }
                } catch (error) {
                    console.error("Error en geocodificación", error);
                    // Respuesta en caso de error de red
                    this._currentLocationDetails = {
                        latitud: lat,
                        longitud: lng,
                        direccion_formateada: "Ubicación seleccionada en el mapa"
                    };
                }
            });

            // Uso del buscador por dirección (declarado en petMap.js)
            searchBtn.addEventListener('click', async () => {
                const result = await mapComponentForm.searchAddress(addressInput.value);
                console.log(result);
                if (result) {
                        this._currentLocationDetails = {
                            latitud: parseFloat(result.lat),
                            longitud: parseFloat(result.lon),
                            direccion_formateada: result.displayName,
                            municipio: result.address?.city || result.address?.town || result.address?.village || "No especificado",
                            provincia: result.address?.province || result.address?.state || "No especificado",
                            codigo_postal: result.address?.postcode || "00000",
                            pais: result.address?.country || "España"
                    };
                    
                    // Actualizamos los inputs ocultos por seguridad
                    this.querySelector('#lat-input').value = result.lat;
                    this.querySelector('#lng-input').value = result.lon;
                }
            });

        // Lógica para el autocompletado de direcciones (Usamos la API Nominatim con el método de ui-utils.js)
            const inputLoc = this.querySelector('#avistamiento-form-loc');
            const resultsContainer = this.querySelector('#loc-autocomplete');
            const mapComponent = this.querySelector('#avistamiento-form-map');

            addressAutocomplete(inputLoc, resultsContainer, (data) => {
                if (mapComponent && mapComponent.map) {
                    mapComponent.map.setView([data.lat, data.lon], 16);
                    if (mapComponent.marker) {
                        mapComponent.marker.setLatLng([data.lat, data.lon]);
                    }
                }
                console.log("Dirección seleccionada:", data.address);
            });

        // Lógica para registrar fotografías
            const fotoDiv = this.querySelector('.foto-div');
            const fotoInput = this.querySelector('#avistamiento-foto');
            const previewImg = this.querySelector('#preview-img');
            const fileNameLabel = this.querySelector('#file-name-label');

            fotoDiv.addEventListener('click', () => {
                fotoInput.click();
            });

            // Ver fotografía antes de enviarla (vista previa)
            fotoInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                        previewImg.src = URL.createObjectURL(file);
                        previewImg.style.display = 'block';
                        
                        // Cambiar el texto para dar feedback al usuario
                        fileNameLabel.textContent = `Archivo seleccionado: ${file.name}`;
                        
                        // Ocultar el icono y el texto original para que se vea mejor la foto
                        this.querySelector('#upload-icon').style.display = 'none';
                    }
                };
                
                // Evitar que el clic en el input se propague (bucle infinito=
                fotoInput.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

        // Cerrar formulario al pinchar fuera (overlay)
        overlay.onclick = () => this.close();

        // Limpiar campos
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

            if (!this._currentLocationDetails) {
                alert("Primero busca una dirección en el mapa para obtener los datos de ubicación.");
                return;
            }

            //Formateamos fecha_hora para el backend: "YYYY-MM-DD HH:mm:ss"
            const fecha_hora = `${dateVal} ${timeVal}:00`;

            // Usamos FormData para poder enviar archivos (fotografía). El backend usa multipart
            const formData = new FormData();

            // Añadimos campos básicos
            formData.append('telefono', this.querySelector('#avistamiento-form-telefono').value);
            formData.append('correo', this.querySelector('#avistamiento-form-email').value);
            formData.append('descripcion', this.querySelector('#avistamiento-dsc').value);
            formData.append('fecha_hora', fecha_hora); // La variable que calculamos antes

            // Campos de ubicación
            formData.append('latitud', this._currentLocationDetails.latitud);
            formData.append('longitud', this._currentLocationDetails.longitud);
            formData.append('direccion_formateada', this._currentLocationDetails.direccion_formateada);
            formData.append('municipio', this._currentLocationDetails.municipio);
            formData.append('provincia', this._currentLocationDetails.provincia);
            formData.append('codigo_postal', this._currentLocationDetails.codigo_postal);
            formData.append('pais', this._currentLocationDetails.pais);
            formData.append('ubicacion_descripcion', "Ubicación confirmada por el usuario");

            // Añadimos foto
            const fotoFile = this.querySelector('#avistamiento-foto').files[0];
            if (fotoFile) {
                formData.append('fotos', fotoFile);
                console.log("Archivo adjuntado:", fotoFile.name);
            }

            try {
                // Llamamos a la API pasando el FormData directamente
                await API.crearAvistamiento(this._petId, formData);
                showSuccess("¡Avistamiento registrado con éxito!");
                setTimeout(() => this.close(), 2000); // Se cierra automáticamente tras 2s
                
            } catch (error) {
                console.error("Error al enviar el avistamiento:", error);
                showHttpError(error, this);
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