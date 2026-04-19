import { API } from '../api.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        .pet-filters-panel {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 3rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-default);
            background-color: var(--backgroundblue);
            gap: 10px;
        }
        
        .filters-title {
            display: flex;
            font-size: var(--text-md);
            gap: 2px;
        }

        .filters-title img {
            width: 20px;
            height: 20px;
        }

        .filter-group {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            gap: 30px;
        }

        .filter-buttons {
            display:flex;
            align-self: flex-end;
            gap: 10px;
        }

        .filter-dates {
            display: flex;
            gap: 10px;
        }

        .date-group {
            display: flex;
            flex-direction: column;
        }

        /* Panel para aplicar más filtros*/
        #more-pet-filters {
            display: none; /* Oculto por defecto */
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 500px;
            z-index: 1000;
            max-height: 90vh;
            overflow-y: auto;
            background-color: var(--backgroundblue);
            border: 2px solid var(--primary);
        }

        #more-pet-filters.is-visible {
            display: flex;
        }

        /* Fondo oscuro detrás del panel */
        .panel-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        }

        .panel-overlay.is-visible {
            display: block;
        }

        .more-filter-group {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap:10px;
            width: 60%;
        }

        .more-filter-group > div {
            width: 100%;
        }

        #more-filter-buttons {
            align-self: center;
        }

        /* --------Tablets y móviles--------- */
        @media (max-width: 768px) {

            .pet-filters-panel {
                padding: 1rem;
            }

            .filter-group {
                flex-direction: column;
                gap: 15px;
            }

            .filter-group div {
                width: 80%;
            }

            .filter-buttons {
                width: 100%;
                justify-content: center;
                align-self: center;
                flex-wrap: wrap;
                margin-top: 10px;
            }

            .filter-buttons button {
                max-width: 150px;
            }


            .filters-title {
                justify-content: center;
                text-align: center;
            }
        }

        @media (max-width: 480px) {
            .pet-filters-panel {
                padding: 0.8rem;
            }

            .filter-group {
                gap: 10px;
                width: 100%;
            }

            .filter-dates {
                flex-direction: column;
                width: 100%;
            }

            .filter-dates input[type="date"] {
                max-width: 100%;
                min-width: 100px;
                width: 100%;
            }

            .more-filter-group {
                width: 100%;
            }

            .more-filter-group > div > input,
            .more-filter-group > div > select {
                max-width: 100%;
                width: 100%;
                flex-wrap: wrap;
            }

            .date-group > input {
                flex-wrap: wrap;
            }

            #more-pet-filters {
                width: 95%;
                max-width: none;
            }            

            .filter-buttons {
                width: 100%;
                flex-direction: column;
                justify-content: center;
                align-content: center;
                flex-wrap: wrap;
                margin-top: 10px;
            }

            .filter-buttons button {
                max-width: 200px;
            }
        }
    </style>

    <div class= "pet-filters"> 
        <div class="panel-overlay" id="panel-bg"></div>

        <div class="pet-filters-panel">
            <div class="filters-title">
                <img src="../assets/icons/material-symbols--search.png">
                <h3>Buscador de mascotas</h3>
            </div>

            <div class="filter-group">
                <div>            
                    <label>Situación</label>
                    <select id="situacion-select"></select>
                </div>

                <div>
                    <label>Especie</label>
                    <select id="especie-select"></select>
                </div>

                <div>
                    <label>Provincia</label>
                    <select id="prov-select"></select>
                </div>

                <div>
                    <label>Municipio</label>
                    <select id="mun-select"></select>
                </div>

                <div class="filter-dates">
                    <div class="date-group">
                        <label id="date-from-label">Desde</label>
                        <input type="date" id="date-from">
                    </div>

                    <div class="date-group">
                        <label id="date-to-label">Hasta</label>
                        <input type="date" id="date-to">
                    </div>
                </div>
            </div>

            <div class="filter-buttons">
                <button class="button-secondary" id="btn-more">Más filtros</button>
                <button class="button-primary" id="btn-apply-main">Aplicar filtros</button>
            </div>       
        </div>


        <div class="pet-filters-panel" id="more-pet-filters">
            <div class="filters-title">
                <img src="../assets/icons/material-symbols--search.png">
                <h3>Buscador de mascotas</h3>
            </div>

            <div class="more-filter-group">
                <div>            
                    <label>Raza</label>
                    <select id="raza-select"></select>
                </div>

                <div>
                    <label>Sexo</label>
                    <select id="sexo-select"></select>
                </div>

                <div>
                    <label>Tamaño</label>
                    <select id="tamano-select"></select>
                </div>

                <div>
                    <label>Color</label>
                    <select id="color-select"></select>
                </div>            

                <div>
                    <label>¿Tiene chip?</label>
                    <select id="chip-select"></select>
                </div>
                
                <div>
                    <label>Solo con fotos</label>
                    <select id="foto-select"></select>
                </div>

                <div>
                    <label>Ordenar por</label>
                    <select id="orden-select"></select>
                </div>
            </div>
        
            <div class="filter-buttons" id="more-filter-buttons">
                <button class="button-secondary" id="btn-reset">Limpiar filtros</button>
                <button class="button-primary" id="btn-apply-more">Aplicar filtros</button>
            </div>
        </div>
    </div>
`;

export class PetFilters extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.style.display = 'block';
        this.render();
        // Cargamos los datos de los selects después de renderizar el esqueleto
        await this.loadSelectOptions();
    }

    async loadSelectOptions() {
        try {

            // Extraemos datos de la BD utilizando api.js
            const [razas, especies, colores, provincias] = await Promise.all([
                API.getRazas(),
                API.getEspecies(),
                API.getColores(),
                API.getProvincias(),
            ]);
            
            // Guardamos la lista completa de razas
            this._allRazas = razas; 

            // Creamos variables estáticas para los select
            const estados = [
                { id: 'PERDIDA', nombre: 'Perdida' },
                { id: 'ENCONTRADA', nombre: 'Encontrada' },
                { id: 'RECUPERADA', nombre: 'Recuperada' }
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

            const fotos = [
                { id: '1', nombre: 'Sí' }, 
                { id: '0', nombre: 'No' }
            ]

            const orden = [
                { id: 'recientes', nombre: 'Más recientes' },
                { id: 'antiguos', nombre: 'Más antiguos' },
                { id: 'nombre_asc', nombre: 'Nombre - ascendente' },
                { id: 'nombre_desc', nombre: 'Nombre - descendiente' }
            ];

            const provinciasList = provincias.data || provincias;

            // Incluimos datos en los select con los métodos creados abajo
            this.fillSelect('#situacion-select', estados);
            this.fillSelect('#especie-select', especies);
            this.updateRazaOptions();
            this.fillSelect('#prov-select', provinciasList);
            this.fillSelect('#mun-select', []);
            this.fillSelect('#color-select', colores);
            this.fillSelect('#sexo-select', sexos);
            this.fillSelect('#tamano-select', tamano);
            this.fillSelect('#chip-select', chip);
            this.fillSelect('#foto-select', fotos);
            this.fillSelect('#orden-select', orden);

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
            // Si el item es un string (provincias), lo usamos directamente. 
            // Si es un objeto (razas), usamos id y nombre.
            if (typeof item === 'object' && item !== null) {
                        // Si es un objeto (Razas, Especies)
                        option.value = item.id || item.nombre || "";
                        option.textContent = item.nombre || "";
                    } else {
                        // Si es un string (Municipios, Provincias)
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

        this.fillSelect('#raza-select', razasFiltered);
    }

    // Método para actualizar el select de municipios según la provincia
    async updateMunicipioOptions(provName = "") {
        const municipioSelect = this.querySelector('#mun-select');
        
        // Si no se le pasa el nombre de una provincia, se bloquea el select
        if (!provName) {
            this.fillSelect('#mun-select', []);
            return;
        }

        try {
            // Se obtienen los municipios y se rellena el select
            const municipios = await API.getMunicipios(provName);

            this.fillSelect('#mun-select', municipios);
            
        } catch (error) {
            console.error("Error cargando municipios:", error);
        }
    }

    render() {
        this.innerHTML = '';

        // Añadimos el div de fondo antes del contenido
        const overlay = document.createElement('div');
        overlay.className = 'panel-overlay';
        overlay.id = 'panel-bg';
        this.appendChild(overlay);

        // Clonamos plantilla
        this.appendChild(template.content.cloneNode(true));

        // Lógica para actualizar las opciones del select razas según la especie
        const especieSelect = this.querySelector('#especie-select');
        // Cada vez que cambie la especie, actualizamos las razas
        especieSelect.onchange = (e) => {
            const especieSeleccionada = e.target.value;
            this.updateRazaOptions(especieSeleccionada);
        };

        
        //Lógica para pasar el id de la provincia al select del municipio
        const provSelect = this.querySelector('#prov-select');
        if (provSelect) {
        provSelect.onchange = async (e) => {
            const provSeleccionada = e.target.value;
            console.log("Cambio detectado en provincia:", provSeleccionada);
            await this.updateMunicipioOptions(provSeleccionada);
        }
    }

        // Creamos variables del HTML
        const panel = this.querySelector('#more-pet-filters');
        const bg = this.querySelector('#panel-bg');
        const btnMore = this.querySelector('#btn-more');
        const btnApplyMain = this.querySelector('#btn-apply-main');
        const btnApplyMore = this.querySelector('#btn-apply-more');
        const btnReset = this.querySelector(`#btn-reset`);


        // Lógica para abrir/cerrar el panel de más filtros
        const togglePanel = (e) => {
            if (e) e.preventDefault();
            panel.classList.toggle('is-visible');
            bg.classList.toggle('is-visible');
        };

        // Añadimos funcionalidad al botón para abrir/cerrar el panel de filtros
        btnMore.onclick = togglePanel;
        bg.onclick = togglePanel;


        // Lógica para aplicar filtros
        const getFilters = () => {
            return {
                estado: this.querySelector('#situacion-select').value,
                especie_id: this.querySelector('#especie-select').value,
                provincia: this.querySelector('#prov-select').value,
                municipio: this.querySelector('#mun-select').value,
                raza_id: this.querySelector('#raza-select').value,
                sexo: this.querySelector('#sexo-select').value,
                tamano: this.querySelector('#tamano-select').value,
                fecha_desde: this.querySelector('#date-from').value,
                fecha_hasta: this.querySelector('#date-to').value,
                color_ids: this.querySelector('#color-select').value,
                tiene_chip: this.querySelector('#chip-select').value,
                con_fotos: this.querySelector('#foto-select').value,
                orden: this.querySelector('#orden-select').value
            };
        };

        // Creamos un evento personalizado que será utilizado en main.js
        const dispatchFilter = () => {
            const filters = getFilters();
            if (panel.classList.contains('is-visible')) togglePanel();

            this.dispatchEvent(new CustomEvent('filter-apply', {
                detail: filters,
                bubbles: true,
                composed: true
            }));
        };

        // Aplicamos la lógica a los botones
        btnApplyMain.onclick = dispatchFilter;
        btnApplyMore.onclick = dispatchFilter;

        // Lógica para el botón reset
        if (btnReset) {
            btnReset.onclick = () => {
                this.querySelectorAll('select').forEach(s => s.value = "");
                this.querySelectorAll('input').forEach(i => i.value = "");
            };
        }
    }        
}


customElements.define('pet-filters', PetFilters);