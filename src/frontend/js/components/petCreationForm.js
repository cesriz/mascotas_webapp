import { API } from "../api.js";
import { PetMap } from "./petMap.js";
import { showSuccess, showHttpError } from "../main.js";

import { createTemplate } from "../ui-utils.js";
import { petCreationHTML, petCreationCSS } from "../templates/petCreationFormTemplate.js";
import { addressAutocomplete } from "../ui-utils.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(petCreationHTML, petCreationCSS);

export class PetCreationForm extends HTMLElement {
    constructor() {
        super();
        this._allRazas = null;
        this._currentLocationDetails = null;
        this._petStatus = null;

        // Propiedades para definir si el formulario está en modo edición
        this._petId = null; // Si el id es null, estamos creando una mascota. Si tiene valor, la estamos editando.
        this._isEditMode = false;
    }

    async connectedCallback() {
    this.render();
console.log('cRender');
        // Cargamos las opciones de los selects primero
        await this.loadSelectOptions();
console.log('clogseloop');

        // Revisamos si hay un ID en la URL para entrar en modo edición
        const params = new URLSearchParams(window.location.search);
        const editId = params.get('editar');

        if (editId) {
            console.log("Modo edición detectado para ID:", editId);
            setTimeout(async () => {
                await this.loadPetDataForEdit(editId);
            }, 100); 
    
    } else {
        // Si no hay edición, comprobamos si hay un estado inicial (perdida/encontrada)
        const estadoInicial = this.getAttribute('data-initial-state');

        if (estadoInicial) {
            this.applyInitialState(estadoInicial);
        }
    }

    // 3. Inicializamos el resto de utilidades
    setTimeout(() => {
        this.initAutocomplete();
        this.setupEventListeners();
    }, 0);
    }

// Lógica para establecer un estado inicial al formulario (para los botones de heroSection)
    applyInitialState(estado) {
        // Seleccionamos elementos del DOM
        const checkbox = this.querySelector('#pet-create-estado');
        const textLabel = this.querySelector('#switch-text');
        console.log(estado);
        if (!checkbox) return;

        // Marcamos el switch según el estado que le pasemos
        if (estado === 'encontrada' || estado === 'ENCONTRADA') {
            checkbox.checked = true;
            if (textLabel) textLabel.textContent = 'He encontrado una mascota';
        } else {
            checkbox.checked = false;
            if (textLabel) textLabel.textContent = 'He perdido a mi mascota';
        }
    }

// Lógica de los campos select del formulario
    async loadSelectOptions() {
        try {
            // Extraemos datos de la BD utilizando api.js
            const [razas, especies, colores] = await Promise.all([
                API.getRazas(),
                API.getEspecies(),
                API.getColores(),
            ]);
            
            // Guardamos la lista completa de razas
            this._allRazas = razas; 

            // Creamos variables estáticas para los select
            const estados = [
                { id: 'PERDIDA', nombre: 'Perdida' },
                { id: 'ENCONTRADA', nombre: 'Encontrada' },
            ];

            const sexos = [
                { id: 'MACHO', nombre: 'Macho' },
                { id: 'HEMBRA', nombre: 'Hembra' },
                { id: 'DESCONOCIDO', nombre: 'Desconocido' }
            ];

            const tamano = [
                { id: 'PEQUENO', nombre: 'Pequeño' },
                { id: 'MEDIANO', nombre: 'Mediano' },
                { id: 'GRANDE', nombre: 'Grande' },
                { id: 'DESCONOCIDO', nombre: 'Desconocido' }
            ]

            const chip = [
                { id: '1', nombre: 'Sí' }, 
                { id: '0', nombre: 'No' }
            ]

            // Incluimos datos en los select con los métodos creados abajo
            this.fillSelect('#pet-create-data-form-especie', especies);
            this.fillSelect('#pet-create-data-pcolor', colores);
            this.fillSelect('#pet-create-data-scolor', colores);
            this.fillSelect('#pet-create-data-tcolor', colores);
            this.fillSelect('#pet-create-data-form-sexo', sexos);
            this.fillSelect('#pet-create-data-form-tamano', tamano);
            this.fillSelect('#pet-create-data-form-chip', chip);
        } catch (error) {
            console.error("Error cargando filtros:", error);
        }
    }

    // Método para rellenar los select
    fillSelect(selector, data) {
        const select = this.querySelector(selector);
        if (!select || !data) return;
        select.innerHTML = '';

        // Añadir opción por defecto
        const defaultOpt = document.createElement('option');
        defaultOpt.value = "";
        defaultOpt.textContent = "Cualquiera / Todos";
        select.appendChild(defaultOpt);

        data.forEach(item => {
            const option = document.createElement('option');
            // Si el item es un string, lo usamos directamente. 
            // Si es un objeto (razas), usamos id y nombre.
            if (typeof item === 'object' && item !== null) {
                        // Si es un objeto (Razas, Especies)
                        option.value = item.id || item.nombre || "";
                        option.textContent = item.nombre || "";
                    } else {
                        // Si es un string
                        option.value = item;
                        option.textContent = item;
                    }
            select.appendChild(option);
        });
    }


    // Método para actualizar el select de razas según la especie
    updateRazaOptions(especieId = "") {
        let razasFiltered = this._allRazas;

        if (especieId) {
            // Filtrado según especie_id
            razasFiltered = this._allRazas.filter(raza => raza.especies_id == especieId);
        }

        this.fillSelect('#pet-create-data-form-raza', razasFiltered);
    }
    
// Lógica para el autocompletado de direcciones (Usamos la API Nominatim con el método de ui-utils.js)
initAutocomplete() {
    const inputLoc = this.querySelector('#pet-create-data-form-loc');
    const resultsContainer = this.querySelector('#loc-autocomplete');
    const mapComponent = this.querySelector('pet-create-data-map');

    if (!inputLoc || !resultsContainer) {
        console.warn("No se encontraron los elementos para el autocompletado");
        return;
    }

    // Invocamos la utilidad de ui-utils.js
    addressAutocomplete(inputLoc, resultsContainer, (data) => {
        // Guardamos los detalles para el envío posterior
        this._currentLocationDetails = data; 
        
        // Actualizamos el mapa si existe
        if (mapComponent && mapComponent.map) {
            const latlng = [data.lat, data.lon];
            mapComponent.map.setView(latlng, 16);
            if (mapComponent.marker) {
                mapComponent.marker.setLatLng(latlng);
            }
        }
        inputLoc.value = data.address;
        resultsContainer.innerHTML = ''; // Limpiamos sugerencias
    });
}

// ACTUALIZAR MASCOTA: Método para mostrar los datos de una mascota existente en el formulario.
// Nuevo método para obtener los datos de la API
async loadPetDataForEdit(id) {
    try {
        // Asegúrate de que API.getMascota existe en tu servicio api.js
        const response = await API.getMascotaById(id); 
        console.log(response);
        
        // Dependiendo de cómo responda tu API, puede ser response o response.data
        const pet = response.data || response;
        
        if (pet) {
            // Un pequeño delay asegura que el navegador haya renderizado las opciones de los selects
            setTimeout(() => {
                this.setPetData(pet);
            }, 100)
        }
    } catch (error) {
        console.error("Error al obtener los datos de la mascota:", error);
        showHttpError(error, this);
    }
}

    async setPetData(pet) {
        this._petId = pet.id;
        this._isEditMode = true;
        this._petStatus = pet.estado;

        console.log("Rellenando formulario con:", pet);

        // Ocultamos el switch de estado
        const stateSwitch = this.querySelector('.switch-div');
        if (stateSwitch) stateSwitch.style.display = 'none';

        // Cambiamos el texto del botón "submit"
        const submitBtn = this.querySelector('#pet-create-data-btn-send');
        if (submitBtn) submitBtn.textContent = "ACTUALIZAR ANUNCIO";

        // Rellenamos los campos
        this.querySelector('#pet-create-data-form-name').value = pet.nombre || '';
        this.querySelector('#pet-create-data-form-especie').value = pet.especie_id || '';
        
        // Cargamos razas de la especie de la mascota y seleccionamos la correcta
        this.updateRazaOptions(pet.especie_id);
        this.querySelector('#pet-create-data-form-raza').value = pet.raza_id || '';
        
        this.querySelector('#pet-create-data-form-sexo').value = pet.sexo || '';
        this.querySelector('#pet-create-data-form-birth').value = pet.fecha_nacimiento || '';
        this.querySelector('#pet-create-data-form-tamano').value = pet.tamano || '';
        this.querySelector('#pet-create-data-form-peso').value = pet.peso || '';
        this.querySelector('#pet-create-data-form-chip').value = pet.tiene_chip ? "1" : "0";
        this.querySelector('#pet-create-data-form-descripcion').value = pet.descripcion || '';

        // Fecha
        const eventDate = pet.fecha_perdida || pet.fecha_encontrada || pet.fecha_recuperada || '';
        this.querySelector('#pet-create-data-form-date').value = eventDate;  

        // Colores
        if(pet.colores && pet.colores.length > 0) {
            this.querySelector('#pet-create-data-pcolor').value = pet.colores[0]?.id || '';
            this.querySelector('#pet-create-data-scolor').value = pet.colores[1]?.id || '';
            this.querySelector('#pet-create-data-tcolor').value = pet.colores[2]?.id || '';
        }

        // Recompensa
        if (pet.recompensa > 0) {
            this.querySelector('#reward-check').checked = true;
            //this.querySelector('#reward-price-container').style.display = '';
            this.querySelector('#reward-price').value = pet.recompensa;
        }

        // Ubicación y Mapa
        this._currentLocationDetails = {
            latitud: pet.latitud,
            longitud: pet.longitud,
            direccion_formateada: pet.direccion_formateada,
            municipio: pet.municipio,
            provincia: pet.provincia,
            codigo_postal: pet.codigo_postal,
            pais: pet.pais
        };
        this.querySelector('#pet-create-data-form-loc').value = pet.direccion_formateada || '';
        this.querySelector('#pet-create-data-lat-input').value = pet.latitud;
        this.querySelector('#pet-create-data-lng-input').value = pet.longitud;

        // Centrar mapa si ya está listo
        // Dentro de setPetData, busca la parte del mapa al final:
        const mapComponent = this.querySelector('#pet-create-data-map');
        if (mapComponent && mapComponent.map) {
            // Si el mapa ya está listo, renderizamos
            mapComponent.renderMarkers(pet.latitud, pet.longitud);
        } else if (mapComponent) {
            // Si no está listo, esperamos al evento 'ready' o usamos un pequeño delay
            mapComponent.addEventListener('map-ready', () => {
                mapComponent.renderMarkers(pet.latitud, pet.longitud);
            }, { once: true });
        }
    }

// Método para generar JSON estructurado para la API
    getPetPayload() {
        // El estado dependerá del botón switch del formulario
        const state = this.querySelector('#pet-create-estado').checked ? 'ENCONTRADA' : 'PERDIDA';
        const eventDate = this.querySelector('#pet-create-data-form-date').value;

        // Colores
        const colores = [
            this.querySelector('#pet-create-data-pcolor').value,
            this.querySelector('#pet-create-data-scolor').value,
            this.querySelector('#pet-create-data-tcolor').value
        ].filter(v => v !== "").map(v => parseInt(v));

        const payload = {
            nombre: this.querySelector('#pet-create-data-form-name').value,
            raza_id: parseInt(this.querySelector('#pet-create-data-form-raza').value),
            sexo: this.querySelector('#pet-create-data-form-sexo').value,
            tiene_chip: this.querySelector('#pet-create-data-form-chip').value === "1",
            tamano: this.querySelector('#pet-create-data-form-tamano').value,
            peso: parseFloat(this.querySelector('#pet-create-data-form-peso').value) || 0,
            fecha_nacimiento: this.querySelector('#pet-create-data-form-birth').value || null,
            descripcion: this.querySelector('#pet-create-data-form-descripcion').value,
            estado: this._isEditMode ? this._petStatus : state, // Si estamos en modo "editar", enviamos el estado que ya venía definido
            recompensa: this.querySelector('#reward-check').checked ? parseFloat(this.querySelector('#reward-price').value) : 0,
            colores: colores,
            ubicacion: {
                latitud: parseFloat(this._currentLocationDetails.latitud),
                longitud: parseFloat(this._currentLocationDetails.longitud),
                direccion_formateada: this._currentLocationDetails.direccion_formateada,
                municipio: this._currentLocationDetails.municipio || "",
                provincia: this._currentLocationDetails.provincia || "",
                codigo_postal: this._currentLocationDetails.codigo_postal || "",
                pais: this._currentLocationDetails.pais || "España",
                descripcion: "Ubicación manual"
            }
        };

        // Fecha dinámica según estado
        const chosenState = this._isEditMode ? this._petStatus : state;
        if (chosenState === 'PERDIDA') payload.fecha_perdida = eventDate;
        else if (chosenState === 'ENCONTRADA') payload.fecha_encontrada = eventDate;

        return payload;
    }

    // Lógica para la interacción con el formulario
    setupEventListeners() {
        const form = this.querySelector('#pet-create-data-form');

        // Lógica para cambiar el select de razas según la especie seleccionada
        const especieSelect = this.querySelector('#pet-create-data-form-especie');
        especieSelect.onchange = (e) => this.updateRazaOptions(e.target.value);

        // Lógica para el botón de estado
        const stateSwitch = this.querySelector('#pet-create-estado');
        const switchText = this.querySelector('#switch-text');
        const state = stateSwitch.checked ? 'ENCONTRADA' : 'PERDIDA';

            // Cambiamos el texto del switch según el estado elegido
            stateSwitch.onchange = () => {
                switchText.textContent = stateSwitch.checked ? 'He encontrado una mascota' : 'He perdido a mi mascota';
            };

        // Lógica para gestión de fotografías
        const fotoDiv = this.querySelector('.pet-create-foto-div');
        const uploadIcon = this.querySelector('#create-form-upload-icon');
        const fileNameLabel = this.querySelector('#pet-create-filename-label');
        const fotoInput = this.querySelector('#pet-create-data-foto');
        //Contenedor para previews
        const previewContainer = this.querySelector('#pet-create-preview-div');

        // Hacer click en el div activa el input
        fotoDiv.onclick = () => fotoInput.click();
        fotoInput.onclick = (e) => e.stopPropagation();

        // Ver preview de fotografías
        fotoInput.onchange = () => {
            previewContainer.innerHTML = '';
            Array.from(fotoInput.files).forEach(file => {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.className = 'pet-create-preview-img';
                previewContainer.appendChild(img);
            });
        };


        // Lógica para regisrar ubicaciones en el formulario (petMap)
        const mapComponentForm = this.querySelector('#pet-create-data-map');
        const latInput = this.querySelector('#pet-create-data-lat-input');
        const lngInput = this.querySelector('#pet-create-data-lng-input');
        const addressInput = this.querySelector('#pet-create-data-form-loc');
        const searchBtn = this.querySelector('#pet-create-data-search-btn');

        // Activamos el modo registro cuando cargue el mapa
        // Utilizamos una función propia de Leaflet
        mapComponentForm.map.whenReady(() => {
            mapComponentForm.initRegistrationMode();
        });

        // Si el usuario mueve el marcador, obtenemos coordenadas
        mapComponentForm.addEventListener('location-selected', (e) => {
            latInput.value = e.detail.lat;
            lngInput.value = e.detail.lng;
            // Si el usuario mueve el marcador manualmente, actualizamos el objeto
            this._currentLocationDetails = {
                latitud: e.detail.lat,
                longitud: e.detail.lng,
                direccion_formateada: "Seleccionado manualmente en el mapa"
            };
            console.log("Coordenadas capturadas:", e.detail);
        });

        // Uso del buscador por dirección (declarado en petMap.js)
        searchBtn.addEventListener('click', async () => {
            const result = await mapComponentForm.searchAddress(addressInput.value);
            console.log(result);
            if (result) {
                    this._currentLocationDetails = {
                        latitud: parseFloat(result.lat),
                        longitud: parseFloat(result.lon),
                        direccion_formateada: result.display_name || result.displayName || addressInput.value,
                        municipio: result.address?.city || result.address?.town || result.address?.village || "",
                        provincia: result.address?.province || result.address?.state || "",
                        codigo_postal: result.address?.postcode || "",
                        pais: result.address?.country || "España"
                };
                
                // Actualizamos los inputs ocultos por seguridad
                this.querySelector('#pet-create-data-lat-input').value = result.lat;
                this.querySelector('#pet-create-data-lng-input').value = result.lon;

                mapComponentForm.setMarker(result.lat, result.lon);
            }
        });

        // Mostramos input de recompensa cuando se marca el check
        const rewardCheck = this.querySelector('#reward-check');
        const rewardPrice = this.querySelector('.reward-price-input');

        rewardPrice.style.display = 'none';

        rewardCheck.addEventListener('change', () => {
            if (rewardCheck.checked) {
                rewardPrice.style.display = 'flex';
            } else {
                rewardPrice.style.display = 'none';
            }
        });        

        // Eventos de formulario
        // Limpiar campos
        const btnReset = this.querySelector('#pet-create-data-btn-reset');
        btnReset.onclick = () => {
                form.reset();
                this._currentLocationDetails = null;
        };

    
        // Envío del formulario
        form.onsubmit = async (e) => {
            e.preventDefault();

            // Si estamos en "modo edición" actualizamos datos, sino creamos mascota.
            // Usamos método implementado abajo
            if (this._isEditMode) {
                await this.updatePet();
            } else {
                await this.createPet(); 
            }
        };
    }

    // Lógica para guardar los datos del formulario en la base de datos
    async createPet() {        
        // Validamos ubicación
        if (!this._currentLocationDetails) {
            alert("Por favor, selecciona una ubicación en el mapa.");
            return;
        }

        try {
            // Obtenemos los datos del formulario (método creado arriba)
            const payload = this.getPetPayload();
            // Creamos mascota sin fotos
            const response = await API.crearMascota(payload);
            // Recuperamos id de la mascota para subir las fotos después
            const petId = response.id || response.data?.id;
            // Subimos las fotos
            await this.uploadPhotos(petId);

            // Mostramos mensaje si todo va bien y reseteamos formulario
            showSuccess("¡Anuncio publicado con éxito!");
            this.querySelector('#pet-create-data-form').reset();
            this._currentLocationDetails = null;
            this.querySelector('#pet-create-preview-div').innerHTML = '';
            
        } catch (error) {
            console.error("Error al crear mascota:", error);
            showHttpError(error, this);
        }
    }

    // Lógica para actualizar los datos del formulario en la base de datos
    async updatePet() {
        try {
            // Obtenemos los datos del formulario (método creado arriba)
            const payload = this.getPetPayload();
            // Actualizamos mascota sin fotos
            const response = await API.updateMascota(this._petId, payload);
            // Subimos las fotos
            await this.uploadPhotos(this._petId);
            showSuccess("¡Anuncio actualizado con éxito!");

        } catch (error) {
            console.error("Error al actualizar mascota:", error);
            showHttpError(error, this);
        }
    }

    // Lógica para guardar fotos en la base de datos
    async uploadPhotos(id) {
        const input = this.querySelector('#pet-create-data-foto');
        if (input.files.length > 0) {
            const fd = new FormData();
            Array.from(input.files).forEach(f => fd.append('fotos', f));
            await API.subirFotosMascota(id, fd);
        }
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('pet-creation-form', PetCreationForm);