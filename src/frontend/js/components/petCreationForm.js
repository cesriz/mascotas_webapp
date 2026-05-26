import { API } from "../api.js";
import { PetMap } from "./petMap.js";

import { showSuccess, showHttpError } from "../main.js";
import { showInputError, clearInputErrors } from '../ui-utils.js';

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

        // Cargamos las opciones de los selects primero
        await this.loadSelectOptions();

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
            const initialState = this.getAttribute('data-initial-state');

            if (initialState) {
                this.applyInitialState(initialState);
            }
        }

        // Inicializamos el resto de utilidades
        setTimeout(() => {
            this.initAutocomplete();
            this.setupEventListeners();
        }, 0);
    }



    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));
    }



    // Lógica para establecer un estado inicial al formulario (para los botones de heroSection)
    applyInitialState(estado) {
        // Seleccionamos elementos del DOM
        const checkbox = this.querySelector('#pet-create-estado');
        if (!checkbox) return;
        console.log('ESTado', estado);
        // Marcamos el switch según el estado que le pasemos
        if (estado === 'encontrada' || estado === 'ENCONTRADA') {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }

        // Actualizamos interfaz
        this.updateUIByState();
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

            // Incluimos datos en los select con el método de ui-utils.js
            this.fillSelect('#pet-cform-especie', especies);
            this.fillSelect('#pet-create-pcolor', colores);
            this.fillSelect('#pet-create-scolor', colores);
            this.fillSelect('#pet-create-tcolor', colores);
            this.fillSelect('#pet-cform-sexo', sexos);
            this.fillSelect('#pet-cform-tamano', tamano);
            this.fillSelect('#pet-cform-chip', chip);
        } catch (error) {
            showHttpError(error, this);
            httpCat?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }



    // Lógica para rellenar los select en los formularios
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
                option.value = item.id || "";
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

        this.fillSelect('#pet-cform-raza', razasFiltered);
    }
    


    // Lógica para el autocompletado de direcciones (Usamos la API Nominatim con el método de ui-utils.js)
    initAutocomplete() {
        const inputLoc = this.querySelector('#pet-cform-loc');
        const resultsContainer = this.querySelector('#loc-autocomplete');
        const mapComponent = this.querySelector('pet-map');

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




    // Lógica para sincronizar la interfaz con el estado del switch
    updateUIByState() {
        const stateSwitch = this.querySelector('#pet-create-estado');
        const switchText = this.querySelector('#switch-text');
        if (!stateSwitch) return;

        const isEncontrada = stateSwitch.checked;

        // Actualizamos el texto del switch
        if (switchText) {
            switchText.textContent = isEncontrada ? 'He encontrado una mascota' : 'He perdido a mi mascota';
        }

        // Bloqueamos/Desbloqueamos Nombre y Fecha de nacimiento
        const nameInput = this.querySelector('#pet-cform-name');
        const birthInput = this.querySelector('#pet-cform-birth');
        
        if (isEncontrada) {
            if (nameInput) { nameInput.value = 'Desconocido'; nameInput.disabled = true; }
            if (birthInput) { birthInput.value = ''; birthInput.disabled = true; }
        } else {
            if (nameInput) nameInput.disabled = false;
            if (birthInput) birthInput.disabled = false;
        }

        // Cambiamos labels (Fotos, Fecha suceso, Dirección suceso)
        const fotosLabel = this.querySelector('label[for="pet-create-fotos"]');
        const dateLabel = this.querySelector('label[for="pet-cform-date"]');
        const locLabel = this.querySelector('label[for="pet-cform-loc"]');

        if (fotosLabel) fotosLabel.textContent = isEncontrada ? "Sube fotos de la mascota para que su dueño pueda reconocerla" : "Sube las mejores fotos de tu mascota para que sea más fácil reconocerla";
        if (dateLabel) dateLabel.textContent = isEncontrada ? "¿Cuándo la has encontrado a la mascota?" : "¿Cuándo has visto a tu mascota por última vez?";
        if (locLabel) locLabel.textContent = isEncontrada ? "¿Dónde la has encontrado a la mascota?" : "¿Dónde has visto a tu mascota por última vez?";

        // Ocultamos sección de Recompensa
        const rewardLabel = this.querySelector('.reward-input');
        const rewardPriceDiv = this.querySelector('.reward-price-input');
        const rewardCheck = this.querySelector('#reward-check');

        if (isEncontrada) {
            if (rewardLabel) rewardLabel.style.display = 'none';
            if (rewardPriceDiv) rewardPriceDiv.style.display = 'none';
            if (rewardCheck) rewardCheck.checked = false;
        } else {
            if (rewardLabel) rewardLabel.style.display = 'flex';
            if (rewardPriceDiv) rewardPriceDiv.style.display = rewardCheck.checked ? 'block' : 'none';
        }
    }




    // Lógica para la interacción con el formulario
    setupEventListeners() {
        const form = this.querySelector('#pet-create-form');

        // Lógica para cambiar el select de razas según la especie seleccionada
        const especieSelect = this.querySelector('#pet-cform-especie');
        especieSelect.onchange = (e) => this.updateRazaOptions(e.target.value);

        // Lógica para el botón de estado (utilizamos método creado arriba)
        const stateSwitch = this.querySelector('#pet-create-estado');
        stateSwitch.onchange = () => this.updateUIByState();

        // Lógica para registrar fotografías y previsualizarlas
        const fotoDiv = this.querySelector('.foto-div');
        const fotoInput = this.querySelector('#pet-create-fotos');
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
                    fileNameLabel.textContent = "Haz clic para seleccionar o arrastra una imagen";
                }
            };
        }

        // Lógica para regisrar ubicaciones en el formulario (petMap)
        const mapComponentForm = this.querySelector('pet-map');
        const latInput = this.querySelector('#pet-create-lat-input');
        const lngInput = this.querySelector('#pet-create-lng-input');
        const addressInput = this.querySelector('#pet-cform-loc');
        const searchBtn = this.querySelector('#pet-create-search-btn');

        // Activamos el modo registro cuando cargue el mapa (usamos función de petMap.js)
        mapComponentForm.map.whenReady(() => {
            mapComponentForm.initRegistrationMode();
        });

        mapComponentForm.addEventListener('location-selected', (e) => {
            this._currentLocationDetails = {
                latitud: e.detail.lat,
                longitud: e.detail.lng,
                direccion_formateada: e.detail.direccion_formateada,
                municipio: e.detail.municipio,
                provincia: e.detail.provincia,
                codigo_postal: e.detail.codigo_postal,
                pais: e.detail.pais
            };

            console.log ('Location-selected:', this._currentLocationDetails);

            // Actualizamos los inputs del formulario
            if (latInput) latInput.value = e.detail.lat;
            if (lngInput) lngInput.value = e.detail.lng;
            if (addressInput) addressInput.value = e.detail.direccion_formateada;
        });

        // Buscador por dirección (declarado en petMap.js)
        searchBtn.addEventListener('click', async () => {
            const result = await mapComponentForm.searchAddress(addressInput.value);

            if (result) { 
                this._currentLocationDetails = result;
                console.log ('Location-direccion:', this._currentLocationDetails);

                // Actualizamos los inputs ocultos
                if (latInput) latInput.value = result.latitud;
                if (lngInput) lngInput.value = result.longitud;

                this._currentLocationDetails.descripcion = "Ubicación encontrada por búsqueda";

                mapComponentForm.setMarker(result.latitud, result.longitud);
            }
        });

        // Mostramos input de recompensa cuando se marca el check
        const rewardCheck = this.querySelector('#reward-check');
        const rewardPrice = this.querySelector('.reward-price-input');

        if (rewardCheck && rewardPrice) {
            // Leemos el estado inicial del checkbox
            rewardPrice.style.display = rewardCheck.checked ? 'block' : 'none';

            // Cambiamos estado
            rewardCheck.addEventListener('change', () => {
                rewardPrice.style.display = rewardCheck.checked ? 'block' : 'none';
            });
        } else {
            console.warn("No se encontró el checkbox o el contenedor de recompensa en el DOM.");
        }      

        // Eventos de formulario
        // Limpiar campos
        const btnReset = this.querySelector('#pet-create-btn-reset');
        btnReset.onclick = () => {
            form.reset();
            this._currentLocationDetails = null;

            const httpCat = this.querySelector('http-cat');
            if (httpCat) {
                httpCat.style.display = 'none';
            }

            // Fotos
            const previewContainer = this.querySelector('#preview-container');
            if (previewContainer) previewContainer.innerHTML = '';
            const icon = this.querySelector('#upload-icon');
            if (icon) icon.style.display = 'block';
            const fileNameLabel = this.querySelector('#file-name-label');
            if (fileNameLabel) fileNameLabel.textContent = "Haz clic para seleccionar o arrastra una imagen";
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



    // Método para generar JSON estructurado para guardar los datos en la API
    getPetPayload() {
        // El estado dependerá del botón switch del formulario
        const state = this.querySelector('#pet-create-estado').checked ? 'ENCONTRADA' : 'PERDIDA';        

        const eventDate = this.querySelector('#pet-cform-date').value;
    
        // Colores
        const colores = [
            this.querySelector('#pet-create-pcolor').value,
            this.querySelector('#pet-create-scolor').value,
            this.querySelector('#pet-create-tcolor').value
        ].filter(v => v !== "").map(v => parseInt(v));

        // Resto de campos
        const payload = {
            nombre: this.querySelector('#pet-cform-name').value || 'Desconocido',
            raza_id: parseInt(this.querySelector('#pet-cform-raza').value),
            sexo: this.querySelector('#pet-cform-sexo').value,
            tiene_chip: this.querySelector('#pet-cform-chip').value === "1",
            tamano: this.querySelector('#pet-cform-tamano').value,
            peso: parseFloat(this.querySelector('#pet-cform-peso').value) || 0,
            fecha_nacimiento: this.querySelector('#pet-cform-birth').value || null,
            descripcion: this.querySelector('#pet-cform-descripcion').value,
            estado: this._isEditMode ? this._petStatus : state, 
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
        else if (chosenState === 'RECUPERADA') payload.fecha_recuperada = eventDate;

        return payload;
    }



    // Método para validar inputs del formulario
    validatePetForm() {
        clearInputErrors(this);
        let isValid = true;
        const today = new Date(); // Guardamos la fecha de "hoy" para validaciones

        // Datos Básicos
        const name = this.querySelector('#pet-cform-name').value;
        const especie = this.querySelector('#pet-cform-especie').value;
        const raza = this.querySelector('#pet-cform-raza').value;
        const sexo = this.querySelector('#pet-cform-sexo').value;
        const tamano = this.querySelector('#pet-cform-tamano').value;

        if (!name.trim()) {
            showInputError(this, 'pet-cform-name', 'El nombre es obligatorio');
            isValid = false;
        } else if (name.length > 50) {
            showInputError(this, 'pet-cform-name', 'Máximo 50 caracteres');
            isValid = false;
        }

        if (!especie) {
            showInputError(this, 'pet-cform-especie', 'Selecciona una especie');
            isValid = false;
        }

        if (!raza) {
            showInputError(this, 'pet-cform-raza', 'Selecciona una raza');
            isValid = false;
        }

        if (!sexo) {
            showInputError(this, 'pet-cform-sexo', 'Indica el sexo');
            isValid = false;
        }

        // Fecha de nacimiento
        const birthDate = this.querySelector('#pet-cform-birth').value;
        const selectedBirthDate = new Date (birthDate);
        if (selectedBirthDate > today) {
            showInputError(this, 'pet-cform-birth', 'La fecha de nacimiento no puede ser posterior al momento actual.');
            return;
        }

        if (!tamano) {
            showInputError(this, 'pet-cform-tamano', 'Selecciona el tamaño');
            isValid = false;
        }

        // Color (Principal obligatorio)
        const pColor = this.querySelector('#pet-create-pcolor').value;
        if (!pColor) {
            showInputError(this, 'pet-create-pcolor', 'Debes elegir al menos el color principal');
            isValid = false;
        }

        // Fotos (Al menos una obligatoria al crear)
        const fotos = this.querySelector('#pet-create-fotos');
        if (!this._isEditMode && fotos.files.length === 0) {
            showInputError(this, 'pet-create-fotos', 'Sube al menos una foto de la mascota');
            isValid = false;
        }

        // Detalles del suceso
        const date = this.querySelector('#pet-cform-date').value;
        const loc = this.querySelector('#pet-cform-loc').value;
        const lat = this.querySelector('#pet-create-lat-input').value;
        const desc = this.querySelector('#pet-cform-descripcion').value;

        if (!date) {
            showInputError(this, 'pet-cform-date', 'La fecha es obligatoria');
            isValid = false;
        }
        const selectedEventDate = new Date (date);
        if (selectedEventDate > today) {
            showInputError(this, 'pet-cform-date', 'La fecha del evento no puede ser posterior al momento actual.');
            return;
        }

        if (!loc.trim() || !lat) {
            showInputError(this, 'pet-cform-loc', 'Debes buscar una dirección y marcarla en el mapa');
            isValid = false;
        }

        if (!desc.trim()) {
            showInputError(this, 'pet-cform-descripcion', 'La descripción es obligatoria');
            isValid = false;
        } else if (desc.length > 1000) {
            showInputError(this, 'pet-cform-descripcion', 'La descripción es demasiado larga (máx. 1000)');
            isValid = false;
        }

        // Recompensa (Si el check está activo, el precio debe ser > 0)
        const hasReward = this.querySelector('#reward-check').checked;
        const rewardPrice = this.querySelector('#reward-price').value;
        if (hasReward && (!rewardPrice || parseFloat(rewardPrice) <= 0)) {
            showInputError(this, 'reward-price', 'Indica un valor válido para la recompensa');
            isValid = false;
        }

        return isValid;
    }



    // Lógica para guardar los datos del formulario en la base de datos
    async createPet() {        
        // Validamos campos
        if (!this.validatePetForm()) {
            // Hacemos scroll al primer error para que el usuario lo vea
            this.querySelector('.error-text.active')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return; 
        }

        const httpCat = this.querySelector('http-cat');
        if (httpCat) httpCat.style.display = 'none';

        const submitBtn = this.querySelector('#pet-create-btn-send');

        try {
            // Iniciamos estado de espera (botón)
            submitBtn.disabled = true;
            submitBtn.textContent = "PUBLICANDO ANUNCIO...";

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
            this.querySelector('#pet-create-form').reset();
            this._currentLocationDetails = null;
            this.querySelector('#preview-container').innerHTML = '';
            if (this.querySelector('#upload-icon')) this.querySelector('#upload-icon').style.display = 'block';
            
        } catch (error) {
            console.error("Error al crear mascota:", error);
            showHttpError(error, this);
            httpCat?.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } finally {
            // Restauramos el botón
            submitBtn.disabled = false;
            submitBtn.textContent = "PUBLICAR ANUNCIO";
        }
    }



    // Lógica para guardar fotos en la base de datos
    async uploadPhotos(id) {
        // Comprobamos que el id sea válido
        if (!id) return;

        // Validamos campos
        if (!this.validatePetForm()) {
            // Hacemos scroll al primer error para que el usuario lo vea
            this.querySelector('.error-text.active')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return; 
        }

        const input = this.querySelector('#pet-create-fotos');
        // Validamos que el input tiene archivos
        if (!input || input.files.length === 0) return;

        const formData = new FormData();
        const files = Array.from(input.files);

        // Validamos el tamaño de los archivos. Si superan los 5MB avisamos al usuario
        const MAX_SIZE_MB = 5;
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
        
        // Comprobamos si alguna foto supera el límite
        const highSizeFiles = files.filter(file => file.size > MAX_SIZE_BYTES);

        if (highSizeFiles.length > 0) {
            const names = highSizeFiles.map(f => f.name).join(", ");
            showHttpError({
                code: 413,
                message: "Imágenes demasiado pesadas",
                validationErrors: [`Las siguientes imágenes superan los ${MAX_SIZE_MB}MB: ${names}`]
            }, this);

            input.value = ""; 
            return;

        }

        files.forEach(file => {
            formData.append('fotos[]', file); 
        });

        try {
            return await API.subirFotosMascota(id, formData);
            
        } catch (error) {
            console.error("Error al subir las fotos:", error);
            // OPCIONAL: MOSTRAR ERROR AL USUARIO
            // showHttpError(error, this);
        }
    }



// ----ACTUALIZAR MASCOTA---
// Lógica para mostrar los datos de una mascota existente en el formulario.
    async loadPetDataForEdit(id) {
        try {
            // Hacemos llamada a la API
            const response = await API.getMascotaById(id);         
            const pet = response.data || response;
            
            if (pet) {
                // Un pequeño delay asegura que el navegador haya renderizado las opciones de los selects
                setTimeout(() => {
                    this.setPetData(pet); // Usamos método definido abajo
                }, 100)
            }
        } catch (error) {
            console.error("Error al obtener los datos de la mascota:", error);
        }
    }

    // Cargamos los datos
    async setPetData(pet) {
        this._petId = pet.id;
        this._isEditMode = true;
        this._petStatus = pet.estado;

        // Ocultamos el switch de estado
        const stateSwitch = this.querySelector('.switch-div');
        if (stateSwitch) stateSwitch.style.display = 'none';

        // Cambiamos el texto del botón "submit"
        const submitBtn = this.querySelector('#pet-create-btn-send');
        if (submitBtn) submitBtn.textContent = "ACTUALIZAR ANUNCIO";

        // Rellenamos los campos
        this.querySelector('#pet-cform-name').value = pet.nombre || '';
        this.querySelector('#pet-cform-especie').value = pet.especie_id || '';
        
        // Cargamos razas de la especie de la mascota y seleccionamos la correcta
        this.updateRazaOptions(pet.especie_id);
        this.querySelector('#pet-cform-raza').value = pet.raza_id || '';
        
        this.querySelector('#pet-cform-sexo').value = pet.sexo || '';
        this.querySelector('#pet-cform-birth').value = pet.fecha_nacimiento || '';
        this.querySelector('#pet-cform-tamano').value = pet.tamano || '';
        this.querySelector('#pet-cform-peso').value = pet.peso || '';
        this.querySelector('#pet-cform-chip').value = pet.tiene_chip ? "1" : "0";
        this.querySelector('#pet-cform-descripcion').value = pet.descripcion || '';;

        // Fecha
        const eventDate = pet.fecha_perdida || pet.fecha_encontrada || pet.fecha_recuperada || '';
        this.querySelector('#pet-cform-date').value = eventDate;  

        // Colores
        if(pet.colores && pet.colores.length > 0) {
            this.querySelector('#pet-create-pcolor').value = pet.colores[0]?.id || '';
            this.querySelector('#pet-create-scolor').value = pet.colores[1]?.id || '';
            this.querySelector('#pet-create-tcolor').value = pet.colores[2]?.id || '';
        }

        // Recompensa
        if (pet.recompensa > 0) {
            this.querySelector('#reward-check').checked = true;
            this.querySelector('.reward-price-input').style.display = 'flex';
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
        
        // Barra de direcciones
        const locInput = this.querySelector('#pet-cform-loc');
        if (locInput) locInput.value = pet.direccion_formateada || '';
        
        this.querySelector('#pet-create-lat-input').value = pet.latitud;
        this.querySelector('#pet-create-lng-input').value = pet.longitud;

        // Mapa
        const mapComponent = this.querySelector('pet-map');
        if (mapComponent && pet.latitud && pet.longitud) {
            setTimeout(() => {
                mapComponent.setMarker(pet.latitud, pet.longitud);
            }, 200);
        }

        // Imágenes
        const previewContainer = this.querySelector('#preview-container');
        const fileNameLabel = this.querySelector('#file-name-label');
        const icon = this.querySelector('#upload-icon');

        if (previewContainer && pet.fotos) {
            previewContainer.innerHTML = '';
            // Array para rastrear qué fotos del servidor queremos borrar
            this._fotosParaEliminar = []; 

            pet.fotos.forEach(foto => {
                const container = document.createElement('div');
                container.className = 'foto-preview-item';
                container.style.position = 'relative';

                const img = document.createElement('img');
                img.src = foto.url || foto;

                // Botón de eliminar (X)
                const btnDel = document.createElement('button');
                btnDel.innerHTML = 'x';
                btnDel.className = 'button-danger btn-delete-photo';
                btnDel.type = 'button';
                
                btnDel.onclick = (e) => {
                    e.stopPropagation(); // Evitamos que se abra el selector de archivos
                    this._fotosParaEliminar.push(foto.id); // Guardamos el ID para avisar a la API
                    container.remove();
                    if (previewContainer.children.length === 0 && icon) icon.style.display = 'block';
                };

                container.appendChild(img);
                container.appendChild(btnDel);
                previewContainer.appendChild(container);
            });

            if (pet.fotos.length > 0) {
                if (icon) icon.style.display = 'none';
                if (fileNameLabel) fileNameLabel.textContent = "Fotos guardadas";
            }
        }
    }



    // Lógica para actualizar los datos del formulario en la base de datos
    async updatePet() {

        const httpCat = this.querySelector('http-cat');
        if (httpCat) httpCat.style.display = 'none';

        const submitBtn = this.querySelector('#pet-create-btn-send');

        try {
            // Iniciamos estado de espera
            submitBtn.disabled = true;
            submitBtn.textContent = "ACTUALIZANDO...";

            // Eliminamos fotos individuales marcadas
            if (this._fotosParaEliminar && this._fotosParaEliminar.length > 0) {
                for (const fotoId of this._fotosParaEliminar) {
                    await API.deleteFotoMascota(fotoId); 
                }
                this._fotosParaEliminar = []; // Limpiamos el array tras el éxito
            }

            // Actualizamos datos básicos
            const payload = this.getPetPayload();
            if (!payload) return;
            await API.updateMascota(this._petId, payload);

            // Subimos fotos nuevas si el usuario seleccionó archivos
            const fotoInput = this.querySelector('#pet-create-fotos');
            if (fotoInput && fotoInput.files.length > 0) {
                try {
                    await this.uploadPhotos(this._petId);
                } catch (fotoError) {
                    showHttpError(error, this);
                    httpCat?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    return; 
                }
            }

            showSuccess("¡Anuncio actualizado con éxito!");

        } catch (error) {
            console.error("Error al actualizar mascota:", error);
            showHttpError(error, this);
            httpCat?.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } finally {
            // Restauramos el botón
            submitBtn.disabled = false;
            submitBtn.textContent = "ACTUALIZAR ANUNCIO";
        }
    }
}

customElements.define('pet-creation-form', PetCreationForm);