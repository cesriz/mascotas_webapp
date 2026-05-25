import { API } from '../api.js';
import { createTemplate } from "../ui-utils.js";
import { petFiltersHTML, petFiltersCSS } from "../templates/petFiltersTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(petFiltersHTML, petFiltersCSS);


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

        // Obtenemos elementos del HTML
        const panel = this.querySelector('#more-pet-filters');
        const bg = this.querySelector('#panel-bg');
        const btnMore = this.querySelector('#btn-more');
        const btnApplyMain = this.querySelector('#btn-apply-main');
        const btnApplyMore = this.querySelector('#btn-apply-more');
        const btnResetMain = this.querySelector('#btn-reset-main');
        const btnReset = this.querySelector(`#btn-reset`);

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

        // Lógica para los botones de reset
        const resetFilters = () => {
            // Seleccionamos todos los selects e inputs
            const selects = this.querySelectorAll('select');
            const inputs = this.querySelectorAll('input');

            // Limpiamos visualmente
            selects.forEach(s => s.value = "");
            inputs.forEach(i => i.value = "");

            console.log("Filtros reseteados visualmente");

            // Aplicamos filtros
            dispatchFilter();
        };

        // Aplicamos la lógica a los botones
        btnApplyMain.onclick = dispatchFilter;
        btnApplyMore.onclick = dispatchFilter;
        btnResetMain.onclick = resetFilters;
        btnReset.onclick = resetFilters;

    }        
}


customElements.define('pet-filters', PetFilters);