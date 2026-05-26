export const petCreationHTML = `
    <http-cat style="display: none;"></http-cat>
    <form class="pet-create" id="pet-create-form">
            <div class="switch-div">
                <label class="switch">
                <input type="checkbox" id="pet-create-estado">
                <span class="slider"></span>
                </label><span id="switch-text">He perdido a mi mascota</span>
            </div>

            <div class="pet-create-section">
                <div class="pet-create-title">
                    <img src="../assets/icons/streamline-plump--pet-paw.svg" alt="Icono mascota">
                    <h3>Datos de la mascota</h3>
                </div>

                <div class="pet-create-inputs first">
                    <div>            
                        <label for="pet-cform-name">Nombre</label>
                        <input type="text" id="pet-cform-name">
                        <span class="error-text" id="error-pet-cform-name"></span>
                    </div>

                    <div>            
                        <label for="pet-cform-especie">Especie</label>
                        <select id="pet-cform-especie"></select>
                        <span class="error-text" id="error-pet-cform-especie"></span>
                    </div>

                    <div>            
                        <label for="pet-cform-raza">Raza</label>
                        <select id="pet-cform-raza"></select>
                        <span class="error-text" id="error-pet-cform-raza"></span>
                    </div>

                    <div>
                        <label for="pet-cform-sexo">Sexo</label>
                        <select id="pet-cform-sexo"></select>
                        <span class="error-text" id="error-pet-cform-sexo"></span>
                    </div>

                    <div>            
                        <label for="pet-cform-birth">Fecha de nacimiento</label>
                        <input type="date" id="pet-cform-birth">
                        <span class="error-text" id="error-pet-cform-birth"></span>
                    </div>

                    <div>           
                        <label for="pet-cform-tamano">Tamaño</label>
                        <select id="pet-cform-tamano"></select>
                        <span class="error-text" id="error-pet-cform-tamano"></span>
                    </div>

                    <div>            
                        <label for="pet-cform-peso">Peso</label>
                        <input type="number" id="pet-cform-peso" step="any" placeholder="Ej: 2.5">
                    </div>

                    <div>           
                        <label for="pet-cform-color">Colores (elige al menos uno)</label>
                        <div id="pet-cform-color">
                            <select id="pet-create-pcolor"></select>
                            <span class="error-text" id="error-pet-create-pcolor"></span>
                            <select id="pet-create-scolor"></select>
                            <select id="pet-create-tcolor"></select>
                        </div>
                    </div>
                        
                    <div>            
                        <label for="pet-cform-chip">¿Tiene chip?</label>
                        <select id="pet-cform-chip"></select>
                        <span class="error-text" id="error-pet-cform-chip"></span>
                    </div>
                </div>
            </div>

            <div class="pet-create-section">
                <div class="pet-create-title">
                    <img src="../assets/icons/solar--camera-linear.svg" alt="Icono cámara">
                    <h3>Fotos de la mascota</h3>
                </div>

                <label for="pet-create-fotos">Sube las mejores fotos de tu mascota para que sea más fácil reconocerla</label>
                <div class="foto-div">            
                    <img src="../assets/icons/proicons--photo.svg" alt="Icono subir foto" id="upload-icon">
                    <span id="file-name-label">Haz clic para seleccionar o arrastra una imagen</span>

                    <input type="file" id="pet-create-fotos" accept="image/*" multiple>
                    <span class="error-text" id="error-pet-create-fotos"></span>

                    <div id="preview-container"></div>
                </div>
            </div>

            <div class="pet-create-section">
                <div class="pet-create-title">
                    <img src="../assets/icons/iconoir--post.svg" alt="Icono anuncio">
                    <h3>Detalles del suceso</h3>
                </div>

                <div class="pet-create-inputs">
                    <div>            
                        <label for="pet-cform-date">Fecha de la pérdida o hallazgo de la mascota</label>
                        <input type="date" id="pet-cform-date">
                        <span class="error-text" id="error-pet-cform-date"></span>
                    </div>

                    <div class="pet-create-location">            
                        <label for="pet-cform-loc">Indica dónde se vio la mascota por última vez</label>
                        <div style="position:relative">
                            <input type="text" id="pet-cform-loc" placeholder="Escribe una dirección">
                            <span class="error-text" id="error-pet-cform-loc"></span>
                            <div id="loc-autocomplete" class="loc-autocomplete"></div>
                        </div>
                        <button class="button-primary" type="button" id="pet-create-search-btn">Buscar</button>
                    </div>
                    <div>
                        <pet-map></pet-map>
                    </div>
                    <input type="hidden" name="latitud" id="pet-create-lat-input" required>
                    <input type="hidden" name="longitud" id="pet-create-lng-input" required>

                    <div>            
                        <label for="pet-cform-descripcion">Descripción</label>
                        <textarea id="pet-cform-descripcion"> </textarea>
                        <span class="error-text" id="error-pet-cform-descripcion"></span>
                    </div>
                    
                    <div class="reward-input">
                        <label class="reward-input">
                            <input type="checkbox" id="reward-check"> Ofrecer recompensa por recuperación
                        </label>
                    </div>
                    <div class="reward-price-input">
                        <label for="reward-price">¿Cuánto ofreces?</label>
                        <input type="number" id="reward-price">
                    </div>

                </div>
            </div>


            <div class="pet-create-buttons">
                <button type="reset" class="button-secondary" id="pet-create-btn-reset">Limpiar</button>
                <button type="submit" class="button-primary" id="pet-create-btn-send">PUBLICAR ANUNCIO</button> 
            </div>
        </div>
    </form>
`;

export const petCreationCSS = `
/* Switch para seleccionar el estado */
    .switch-div {
        display:flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }
        
    .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
        }

        .switch input {
        opacity: 0;
        width: 0;
        height: 0;
        }

        /* Fondo */
        .slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background-color: var(--primary);
        border-radius: var(--radius-md);
        transition: 0.3s;
        }

        /* Bolita */
        .slider::before {
        content: "";
        position: absolute;
        height: 20px;
        width: 20px;
        left: 3px;
        top: 3px;
        background-color: white;
        border-radius: 50%;
        transition: 0.3s;
        }

        /* Estado activo */
        input:checked + .slider {
        background-color: var(--secondary500);
        }

        input:checked + .slider::before {
        transform: translateX(24px);
        }

    /* Contenedores */
    .pet-create {
        width: min(900px, 92vw);
        margin: 0 auto;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .pet-create-section {
        background-color: var(--backgroundblue);
        border: 2px solid var(--primary);
        border-radius: var(--radius-md);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        padding: 2rem;
    }

    .pet-create-location {
        display: flex;
        flex-direction: column;
    }

    /* Títulos */
    .pet-create-title {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--text-md);
        gap: 5px;
        margin-bottom: 10px;
        transform: translate(-10px,0);
    }

    .pet-create-title img {
        width: 24px;
        height: 24px;
    }

    /* Inputs */

    .pet-create-inputs {
        display: flex;
        flex-direction: column; 
        width: 100%;
        gap: 10px;
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

    #pet-cform-color {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        flex-wrap: wrap;
        
    }

    .reward-input {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }

    .reward-price-input {
        width: 100%;
        margin-left: 1rem;
        gap: 1rem;
    }


    #reward-price {
        max-width: 100px;
        margin-left: 1rem;
        gap: 1rem;
    }


    /* Input para las fotos*/
    .foto-div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 1rem;
        margin-top: 1rem;

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

    #pet-create-fotos { 
        display: none; 
    }

    #preview-container {
        width: 100%;
        min-height: 100px;
        max-height: auto; 
        margin-top: 1rem;
        padding: 0.5rem;
        gap: 0.3rem;
        background-color: var(--inputbackground);
        border-radius: var(--radius-sm);
        display: flex;
        justify-content: center;
        align-items: start;
        flex-wrap: wrap;
    }

    #preview-container img {
        max-width: 300px;
        min-width: 100px;
        height: auto;
        object-fit: cover;
        border-radius: var(--radius-xs);
        border: 1p solid var(--secondary500);
    }

    /* Visualizar fotos en el modo editar */
    .foto-preview-item {
        position: relative;
    }

    /* Botón para borrar fotos */
    .btn-delete-photo {
        position: absolute;
        top: 4px;
        right: 4px;
        max-width: 22px;
        max-height: 22px;
        padding: 0.5rem;
        z-index: 10;
    }


    /* Botones */
    .pet-create-buttons {
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

    #pet-create-search-btn{
        max-width: 150px;
        margin-top: 10px;
        align-self: flex-end;
    }

    .pet-create-buttons button {
        flex: 1;
        max-width: 250px;
        padding: 10px;
    }


    /* --------Tablets y móviles--------- */

    @media (min-width: 1024px) {
        .first {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px 30px;
        }

        .first > div {
            width: 100%;
        }
    }
    @media (max-width: 768px) {

        .pet-create {
            width: 95vw;
            padding: 1.5rem;
        }

        .pet-create-section {
            padding: 1.2rem;
        }

        .pet-create-title {
            font-size: 1rem;
            transform: none;
        }

        .pet-create-title img {
            width: 20px;
            height: 20px;
        }

        #pet-cform-color {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
        }

        #pet-cform-color select {
            min-width: 150px;
            flex: 1;
        }

        .pet-create-buttons {
            gap: 15px;
        }

        .foto-div {
            padding: 15px;
        }

        #preview-container {
            max-height: 300px;
        }
    }
    
    @media (max-width: 480px) {

        .pet-create {
            width: 100%;
            padding: 1rem;
        }

        .pet-create-section {
            padding: 1rem;
        }

        .pet-create-title {
            gap: 8px;
            margin-bottom: 15px;
        }

        .pet-create-inputs {
            gap: 14px;
        }

        #pet-cform-color {
            flex-direction: column;
        }

        .reward-input {
            width: 100%;
            flex-direction: row;
            align-items: center;
            font-size: 0.85rem;
        }

        .reward-price-input{
            width: 100%;
        }

        #reward-price {
            max-width: 100px;
        }

        .pet-create-buttons {
            flex-direction: column;
            width: 100%;
        }

        .pet-create-buttons button {
            width: 100%;
            max-width: none;
        }

        .switch-div {
            flex-wrap: wrap;
            text-align: center;
        }

        .foto-div {
            padding: 12px;
        }

        .foto-div img {
            width: 32px;
            height: 32px;
        }

        #preview-container {
            max-height: 220px;
        }

        .pet-create-buttons {
            gap: 1rem;
        }
    }        
`;