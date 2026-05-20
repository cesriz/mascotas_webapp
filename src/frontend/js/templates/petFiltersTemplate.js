export const petFiltersHTML = `
    <div class= "pet-filters"> 
        <div class="panel-overlay" id="panel-bg"></div>

        <div class="pet-filters-panel">
            <div class="filters-title">
                <img src="../assets/icons/ic--outline-search.svg" alt="Icono lupa">
                <h3>Buscador de mascotas</h3>
            </div>

            <div class="filter-group">
                <div id="situacion-div">            
                    <label for="situacion-select">Situación</label>
                    <select id="situacion-select"></select>
                </div>

                <div>
                    <label for="especie-select">Especie</label>
                    <select id="especie-select"></select>
                </div>

                <div>
                    <label for="prov-select">Provincia</label>
                    <select id="prov-select"></select>
                </div>

                <div>
                    <label for="mun-select">Municipio</label>
                    <select id="mun-select"></select>
                </div>

                <div class="filter-dates">
                    <div class="date-group">
                        <label for="date-from" id="date-from-label">Desde</label>
                        <input type="date" id="date-from">
                    </div>

                    <div class="date-group">
                        <label for="date-to" id="date-to-label">Hasta</label>
                        <input type="date" id="date-to">
                    </div>
                </div>
            </div>

            <div class="filter-buttons">
                <button class="button-secondary" id="btn-reset-main">Limpiar filtros</button>
                <button class="button-secondary" id="btn-more">Más filtros</button>
                <button class="button-primary" id="btn-apply-main">Aplicar filtros</button>
            </div>       
        </div>
        <div class="results-counter">
            <p>Se han encontrado <span id="pet-count">0</span> mascotas</p>
        </div>


        <div class="pet-filters-panel" id="more-pet-filters">
            <div class="filters-title">
                <img src="../assets/icons/ic--outline-search.svg">
                <h3>Buscador de mascotas</h3>
            </div>

            <div class="more-filter-group">
                <div>            
                    <label for="raza-select">Raza</label>
                    <select id="raza-select"></select>
                </div>

                <div>
                    <label for="sexo-select">Sexo</label>
                    <select id="sexo-select"></select>
                </div>

                <div>
                    <label for="tamano-select">Tamaño</label>
                    <select id="tamano-select"></select>
                </div>

                <div>
                    <label for="color-select">Color</label>
                    <select id="color-select"></select>
                </div>            

                <div>
                    <label for="chip-select">¿Tiene chip?</label>
                    <select id="chip-select"></select>
                </div>
                
                <div>
                    <label for="foto-select">Solo con fotos</label>
                    <select id="foto-select"></select>
                </div>

                <div>
                    <label for="orden-select">Ordenar por</label>
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

export const petFiltersCSS = `
    /* Panel principal*/
    .pet-filters-panel {
        width: 100%;
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
        margin-top: 10px;
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

    /* Contador de resultados*/
    .results-counter {
        display: none;
        margin: 2rem 0;
        font-size: 1.1rem;
    }

    .is-visible {
        display: block;
    }

    #pet-count {
        font-weight: bold;
        color: var(--primary);
        background-color: white;
        border-radius: 12px;
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
            align-content: center;
            flex-wrap: wrap;
            margin-top: 10px;
        }

        .filter-buttons button {
            max-width: 200px;
        }

        #btn-apply-main {
            max-width: 410px;
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
            width: 80%;
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

        #btn-apply-main {
            max-width: 200px;
        }
    }      
`;