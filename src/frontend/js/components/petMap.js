import { API } from "../api.js";
import { Auth } from "../auth.js";

import { createTemplate } from "../ui-utils.js";
import { petMapHTML, petMapCSS } from "../templates/petMapTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(petMapHTML, petMapCSS);


export class PetMap extends HTMLElement {
    constructor() {
        super();
        // Reseteamos datos
        this._petData = null;
        this._avistamientos = [];
        this.map = null;   
        this.markers = L.layerGroup(); // Pin de avistamientos
    }

    async connectedCallback() {
        this.initMap();
        this.markers.addTo(this.map);

        // Verificar si estamos en una página de detalles
        const petId = new URLSearchParams(window.location.search).get('id');
        
        // Verificar si el componente tiene un atributo "mode" (<pet-map mode="select">)
        const mode = this.getAttribute('mode');

        if (petId && mode !== 'select') {
            // PetDetail: cargamos avistamientos
            await this.setData(petId);
        } else if (mode === 'select') {
            // avistamientoCreationForm: activamos el marcador para formularios
            this.initRegistrationMode();
        }
    }

    // Seleccionamos la plantilla y le adjuntamos el mapa de Leaflet
    initMap() {
        this.appendChild(template.content.cloneNode(true));

        const mapContainer = this.querySelector('#map-container');

        // Inicializamos el mapa centrando la ubicación en España por defecto
        this.map = L.map(mapContainer).setView([40.4167, -3.7037], 6);

        // Añadimos al mapa la imagen que proporciona OpenStreetView
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
    }

    // Setter para añadir los datos de la mascota y sus avistamientos
    async setData(id) {
        try {
            // Obtenemos los datos de la mascota (ubicación del anuncio)
            this._petData = await API.getMascotaById(id);
            // Obtenemos los datos de los avistamientos
            this._avistamientos = await API.getAvistamientosMascota(id);
            this.renderMarkers(); // Mostramos marcadores en el mapa
        } catch (error) {
            console.error("Error al cargar datos del mapa:", error);
            showHttpError(error);
        }
    }

    // Método para mostrar los marcadores en el mapa
    renderMarkers() {
        if (!this.map || !this._petData) return;

        // Limpiamos marcas anteriores
        this.markers.clearLayers();
        const bounds = [];
        if (!Array.isArray(this._avistamientos)) return;

        // Marcador con ubicación original del anuncio (color naranja)
        if (this._petData && this._petData.latitud && this._petData.longitud) {
            const posAnuncio = [this._petData.latitud, this._petData.longitud];

            // Creamos tarjeta popup
            // Pasamos true para que muestre los datos del anuncio de la mascota
            const popupContent = this._createPopupCard(this._petData, true);
            const markerAnuncio = L.marker(posAnuncio, { icon: this.getIcon('orange') })
                .bindPopup(popupContent)
                .addTo(this.markers);
            bounds.push(posAnuncio);
        }

        // Marcadores con ubicación de los avistamientos (amarillo y rojo)
        this._avistamientos.forEach((av, index) => {
            const isLast = index === 0; // El último registrado
            const color = isLast ? 'red' : 'yellow';
            
            const pos = [av.latitud, av.longitud];

            // Creamos las tarjetas popup pasando los datos del avistamiento
            const popupContent = this._createPopupCard(av);
            L.marker(pos, { icon: this.getIcon(color) })
                .bindPopup(popupContent)
                .addTo(this.markers); // Añadimos la tarjeta al array de marcadores
            
            bounds.push(pos);
        });

        // Ajustar el zoom automáticamente
        if (bounds.length > 0) {
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    // --- Popups personalizados ---
    // Función para crear la tarjeta (Leaflet no permite utilizar templates directamente)
    _createPopupCard(data, isPet = false) {
        // Imagen
        let finalUrl = './assets/placeholder.png'; // Imagen por defecto

        if (isPet) {
            // Para la mascota, miramos en el array 'fotos'
            if (data.fotos && data.fotos.length > 0) {
                const fotoPath = data.fotos[0].url; // Cogemos la primera foto
                finalUrl = API.resolveMediaUrl(fotoPath, './assets/placeholder.png');
            }
        } else {
            // Para avistamientos (ajusta según si el avistamiento devuelve 'foto_url' o similar)
            if (data.fotos && data.fotos.length > 0) {
                const fotoPath = data.fotos[0].url; // Cogemos la primera foto
                finalUrl = API.resolveMediaUrl(fotoPath, './assets/placeholder.png');
            }
        }

        // Fecha
        let date = ''; // Si no se muestra avistamiento, no aparece nada (el endpoint GET /api/mascotas/{id} no devuelve fechas)

        if (!isPet) {
            // Para avistamientos usamos fecha_avistamiento
            const rawDate = data.fecha_hora
            if (rawDate) date = new Date(rawDate).toLocaleDateString();
        }


        // Lógica de Seguridad. Comprobamos si quien está viendo el mapa es el dueño del anuncio
        const currentUser = Auth.getUserData();
        // El ID del dueño está en this._petData.dueno.id (siempre es el mismo para todos los pines de esa mascota)
        const isOwner = currentUser && this._petData && (this._petData.usuario_id === currentUser.id || (this._petData.dueno && this._petData.dueno.id === currentUser.id));
        // Creamos el contenedor principal
        const popupCard = document.createElement('div');
        popupCard.className = 'map-popup-card';
        
        // Añadimos el contenido de la tarjeta
        // Si el usuario es dueño o el popup es el del anuncio de la mascota, no se muestras el botón "Contactar"
        popupCard.innerHTML = `
            <img src="${finalUrl}" alt="Foto del avistamiento">
            <div class="map-popup-info">
                <p id="map-popup-info-date">${date}</p>
                <p style="font-weight:600; margin-top:5px;">${isPet ? 'Nombre: ' + data.nombre : 'Descripción: '}</p>
                <p>${data.descripcion || 'Sin descripción adicional.'}</p>
            </div>

            ${(!isPet && isOwner) ? '<button class="button-primary" id="map-popup-button">Contactar testigo</button>' : ''}

            <div class="map-popup-contact">
                <p> <img src="../../assets/icons/material-symbols--mail-outline-rounded-orange.svg" alt="Icono mail"> ${data.correo || 'No disponible'}</p>
                <p> <img src="../../assets/icons/mingcute--phone-line.svg" alt="Icono teléfono"> ${data.telefono || 'No disponible'}</p>
            </div>
        `;

        // Lógica del botón (Toggle de contacto)
        const popupBtn = popupCard.querySelector('#map-popup-button');
        const contactDiv = popupCard.querySelector('.map-popup-contact');

        if (popupBtn) {
            popupBtn.onclick = (e) => {
                e.preventDefault();

                // Verificamos el estado actual
                const isOpen = contactDiv.classList.contains('open');
                
                // Según estado, mostramos u ocultamos
                if (isOpen) {
                    contactDiv.classList.remove('open');
                    popupBtn.textContent = 'Contactar testigo';
                } else {
                    contactDiv.classList.add('open');
                    popupBtn.textContent = 'Cerrar';
                }
            };
        }
        
        return popupCard;
    }

    // Método para para obtener iconos de colores de los marcadores (usamos https://github.com/pointhi/leaflet-color-markers)
    getIcon(color) {
        return new L.Icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }  

    // Método para colocar un marcador basado en una dirección específica. 
    // Utilizamos el buscador de OpenStreetMap (Nominatim)
    async searchAddress(address) {
        if (!address) return;
        try {
            // Consultamos a Nominatim (OpenStreetMap Geocoding)
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(address)}&countrycodes=es`);
            const data = await response.json();

            if (data.length > 0) {
                // Guardamos resultado de petición a Nominata en variables
                const { lat, lon, display_name, address } = data[0];
                const coords = [parseFloat(lat), parseFloat(lon)];

                // Centramos el mapa
                this.map.setView(coords, 16); // Zoom cercano

                // Colocamos o movemos el marcador de registro
                if (this.registrationMarker) {
                    this.registrationMarker.setLatLng(coords);
                } else {
                    this.registrationMarker = L.marker(coords, { 
                        draggable: true,
                        icon: this.getIcon('red') // Usamos rojo para el nuevo avistamiento
                    }).addTo(this.map);
                }

                this.registrationMarker.bindPopup(`<b>Ubicación encontrada:</b><br>${display_name}`).openPopup();

                // Guardamos los detalles para que el formulario avistamientoCreationForm pueda pedirlos
                this._lastAddressDetails = address;
                this._lastDisplayName = display_name;

                return { lat, lon, displayName: display_name, details: address };
            } else {
                alert("No se ha encontrado la ubicación. Intenta ser más específico.");
                return null;
            }
        } catch (error) {
            console.error("Error en el geocoding:", error);
            return null;
        }
    }

    // Método para habilitar el modo "selección" en el formulario
    initRegistrationMode() {
        if (!this.map) return;

        // Si no existe el marcador de registro, lo creamos en el centro del mapa
        if (!this.registrationMarker) {
            const center = this.map.getCenter();
            this.registrationMarker = L.marker(center, {
                draggable: true,
                icon: this.getIcon('red')
            }).addTo(this.map);

            // Evento cuando se termina de arrastrar el marcador
            this.registrationMarker.on('dragend', () => {
                const position = this.registrationMarker.getLatLng();
                this.dispatchLocationEvent(position.lat, position.lng);
            });

            // También permitimos hacer click en el mapa para mover el marcador
            this.map.on('click', (e) => {
                this.registrationMarker.setLatLng(e.latlng);
                this.dispatchLocationEvent(e.latlng.lat, e.latlng.lng);
            });
        }
    }

    // Lanza un evento que el formulario podrá escuchar
    dispatchLocationEvent(lat, lng) {
        this.dispatchEvent(new CustomEvent('location-selected', {
            detail: { lat, lng },
            bubbles: true,
            composed: true
        }));
    }

    // Marcar una única posición (se utiliza en petCreationForm y petEditForm)
    setMarker(lat, lng) {
        if (!this.map) return;
        const coords = [lat, lng];
        this.map.setView(coords, 16); // Centra el mapa en la mascota

        if (this.registrationMarker) {
            this.registrationMarker.setLatLng(coords);
        } else {
            // Si no existe el marcador, lo crea
            this.registrationMarker = L.marker(coords, {
                draggable: true,
                icon: this.getIcon('red')
            }).addTo(this.map);
        }
    }

}

customElements.define('pet-map', PetMap);
