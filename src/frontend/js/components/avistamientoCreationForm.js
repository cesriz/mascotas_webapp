import { API } from '../api.js';
import { PetMap } from './petMap.js';
import { showHttpError, showSuccess } from '../main.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        avistamiento-creation-form {
            display: none; /* Oculto por defecto hasta que se active */
        }

        avistamiento-creation-form.is-visible {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .avistamiento-creation {
            position: relative;
            width: min(600px, 90vw);
            max-height: 90vh;
            z-index: 1000;
            overflow: hidden;
            padding: 2rem;

            display: flex; 
            flex-direction: column;
            align-items: stretch;
            gap: 10px;

            background-color: var(--backgroundblue);
            border: 2px solid var(--primary);
            border-radius: var(--radius-md);
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);

        }
        
        .pet-contact-title {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: var(--text-md);
            gap: 5px;
            margin-bottom: 10px;
            transform: translate(-10px,0);
        }

        .pet-contact-title img {
            width: 24px;
            height: 24px;
        }

        #avistamiento-form {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 1.5rem;
            gap: 20px;
        }

        .pet-avistamiento-inputs {
            display: flex;
            flex-direction: column; 
            gap: 15px;
            width: 100%;
        }

        .pet-avistamiento-inputs > div {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        input, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--inputbackground);
            border-radius: var(--radius-sm);
            font-family: inherit;
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }

        .foto-div {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 10px;
            margin-top: -10px;

            padding: 20px;
            background-color: var(--inputbackground);
            border: 2px dashed var(--primary);
            border-radius: var(--radius-sm);
            
            transition: background 0.3s;
            cursor: pointer;
        }
            
        .foto-div:hover { background: rgba(0,0,0,0.05); }

        .foto-div img {
            width: 40px;
            height: 40px;
            opacity: 0.7;
        }

        #avistamiento-foto { 
            display: none; 
        }

        #preview-img {
            display:none; 
            width: 100%;
            min-height: 200px;
            max-height: 180px; 
            object-fit: contain; 
            margin-top: 10px;
            background-color: var(--inputbackground);
            border-radius: var(--radius-sm);
        }

        .avistamiento-buttons {
            width: auto;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding-top: 10px;
            margin-bottom: 10px;
            flex-shrink: 0;
            gap: 10px;
        }
        
        .avistamiento-buttons button {
            flex: 1;
            max-width: 150px;
            padding: 10px;
        }

        #avistamiento-search-btn{
            max-width: 150px;
            align-self: flex-end;
            margin-top: 5px;
        }

        .privacy-input {
            display: flex;
            margin-top: 10px;
            align-items: flex-start;
            gap: 10px;
            font-size: 0.9rem;
        }

        .privacy-input input {
            width: auto;
            margin-top: 4px;
        }

        .privacy-input a {
            color: var(--secondary500);
            text-decoration: underline;
        }

        .avistamiento-form-date {
            display: flex;
            gap: 10px;
        }

        /* --------Tablets y móviles--------- */
        @media (max-width: 600px) {
            .avistamiento-buttons {
                flex-direction: column;
            }
            .avistamiento-buttons button {
                max-width: 100%;
            }
            .avistamiento-creation {
                padding: 1.5rem;
            }
        }
    </style>

    <div class="panel-overlay" id="a-panel-overlay"></div>
    <div class="avistamiento-creation">
        <div class="pet-contact-title">
            <img src="../assets/icons/material-symbols--mail-outline.png">
            <h3>Registra un avistamiento</h3>
        </div>

        <http-cat style="display: none;"></http-cat>
        <div id="success-div"></div>

        <form id="avistamiento-form">
            <div class="pet-avistamiento-inputs">
                <div>            
                    <label for="avistamiento-form-email">Email</label>
                    <input type="email" id="avistamiento-form-email">
                </div>
                <div>            
                    <label for="avistamiento-form-telefono">Teléfono*</label>
                    <input type="text" id="avistamiento-form-telefono" required>
                </div>

                <div class="avistamiento-form-location">            
                    <label for="avistamiento-form-loc">¿Dónde has visto a la mascota por última vez?*</label>
                    <input type="" id="avistamiento-form-loc" placeholder="Escribe una dirección">
                    <button class="button-primary" type="button" id="avistamiento-search-btn">Buscar en mapa</button>
                </div>
                <div>
                    <pet-map id="avistamiento-form-map"></pet-map>
                </div>
                <input type="hidden" name="latitud" id="lat-input" required>
                <input type="hidden" name="longitud" id="lng-input" required>

                <div>            
                    <label for="avistamiento-form-date">¿Cuándo has visto a la mascota por última vez?*</label>
                    <div class="avistamiento-form-date">
                        <input type="date" id="avistamiento-form-date" required>
                        <input type="time" id="avistamiento-form-time" required>
                    </div>
                </div>

                <div>            
                    <label for="contact-desc">Descripción</label>
                    <textarea id="avistamiento-dsc" placeholder="Cualquier detalle puede marcar la diferencia..." required></textarea>
                </div>

                <label for="avistamiento-foto">Sube una foto</label>
                <div class="foto-div">            
                    <img src="../assets/icons/proicons--photo.png" alt="Subir foto" id="upload-icon">
                    <span id="file-name-label">Haz clic para seleccionar o arrastra una imagen</span>
                    <input type="file" id="avistamiento-foto" accept="image/*">
                    <img id="preview-img">
                </div>
            </div>

            <label class="privacy-input">
                <input type="checkbox" id="privacy-check" required>
                <span>Mediante el envío de mis datos confirmo que he leído y acepto la <a href="privacidad.html" target="_blank">política de privacidad</a>.</span>
            </label>

            <div class="avistamiento-buttons">
                <button type="button" class="button-secondary" id="avistamiento-btn-reset">Limpiar</button>
                <button type="submit" class="button-primary" id="avistamiento-btn-send">Enviar</button> 
            </div>
        </form>
    </div>
`;

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

        // Si el usuario el usuario mueve el marcador, obtenemos coordenadas
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
    }

    // Método para cerrar el formulario
    close() {
        this.classList.remove('is-visible');
        document.body.style.overflow = 'auto';
        this.querySelector('#avistamiento-form').reset();
    }
}

customElements.define('avistamiento-creation-form', AvistamientoCreationForm);