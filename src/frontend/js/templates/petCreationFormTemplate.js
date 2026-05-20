export const petCreationHTML = `
    <div id="success-div"></div>
    <form class="pet-create-data" id="pet-create-data-form">
            <div class="switch-div">
                <label class="switch">
                <input type="checkbox" id="pet-create-estado">
                <span class="slider"></span>
                </label><span id="switch-text">He perdido a mi mascota</span>
            </div>

            <div class="pet-create-data-section">
                <div class="pet-create-title">
                    <img src="../assets/icons/streamline-plump--pet-paw.svg" alt="Icono mascota">
                    <h3>Datos de la mascota</h3>
                </div>

                <div class="pet-create-data-inputs first">
                    <div>            
                        <label for="pet-create-data-form-name">Nombre</label>
                        <input type="text" id="pet-create-data-form-name" required>
                    </div>

                    <div>            
                        <label for="pet-create-data-form-especie">Especie</label>
                        <select id="pet-create-data-form-especie" required></select>
                    </div>

                    <div>            
                        <label for="pet-create-data-form-raza">Raza</label>
                        <select id="pet-create-data-form-raza" required></select>
                    </div>

                    <div>
                        <label for="pet-create-data-form-sexo">Sexo</label>
                        <select id="pet-create-data-form-sexo" required></select>
                    </div>

                    <div>            
                        <label for="pet-create-data-form-birth">Fecha de nacimiento</label>
                        <input type="date" id="pet-create-data-form-birth">
                    </div>

                    <div>           
                        <label for="pet-create-data-form-tamano">Tamaño</label>
                        <select id="pet-create-data-form-tamano" required></select>
                    </div>

                    <div>            
                        <label for="pet-create-data-form-peso">Peso</label>
                        <input type="number" id="pet-create-data-form-peso">
                    </div>

                    <div>           
                        <label for="pet-create-data-form-color">Colores (elige al menos uno)</label>
                        <div id="pet-create-data-form-color">
                            <select id="pet-create-data-pcolor" required></select>
                            <select id="pet-create-data-scolor"></select>
                            <select id="pet-create-data-tcolor"></select>
                        </div>
                    </div>
                        
                    <div>            
                        <label for="pet-create-data-form-chip">¿Tiene chip?</label>
                        <select id="pet-create-data-form-chip"></select>
                    </div>
                </div>
            </div>

            <div class="pet-create-data-section">
                <div class="pet-create-title">
                    <img src="../assets/icons/solar--camera-linear.svg" alt="Icono cámara">
                    <h3>Fotos de la mascota</h3>
                </div>

                <label for="pet-create-data-foto">Sube las mejores fotos de tu mascota para que sea más fácil reconocerla</label>
                <div class="pet-create-foto-div">            
                    <img src="../assets/icons/proicons--photo.svg" alt="Subir foto" id="create-form-upload-icon">
                    <span id="pet-create-filename-label">Haz clic para seleccionar o arrastra una imagen</span>
                    <input type="file" id="pet-create-data-foto" accept="image/*" multiple>
                    <div id="pet-create-preview-div"></div>
                </div>
            </div>

            <div class="pet-create-data-section">
                <div class="pet-create-title">
                    <img src="../assets/icons/iconoir--post.svg" alt="Icono anuncio">
                    <h3>Detalles del suceso</h3>
                </div>

                <div class="pet-create-data-inputs">
                    <div>            
                        <label for="pet-create-data-form-date">¿Cuándo has visto a tu mascota por última vez?</label>
                        <input type="date" id="pet-create-data-form-date" required>
                    </div>

                    <div class="pet-create-data-location">            
                        <label for="pet-create-data-form-loc">¿Dónde has visto a tu mascota por última vez?</label>
                        <div style="position:relative">
                            <input type="" id="pet-create-data-form-loc" placeholder="Escribe una dirección">
                            <div id="loc-autocomplete" class="loc-autocomplete"></div>
                        </div>
                        <button class="button-primary" type="button" id="pet-create-data-search-btn">Buscar</button>
                    </div>
                    <div><pet-map id="pet-create-data-map"></pet-map></div>
                    <input type="hidden" name="latitud" id="pet-create-data-lat-input" required>
                    <input type="hidden" name="longitud" id="pet-create-data-lng-input" required>

                    <div>            
                        <label for="pet-create-data-form-descripcion">Descripción</label>
                        <textarea id="pet-create-data-form-descripcion" required> </textarea>
                    </div>
                    
                    <label class="reward-input">
                        <input type="checkbox" id="reward-check">
                        Ofrecer recompensa por recuperación
                    </label>
                    <div class="reward-price-input">
                        <label for="reward-price">¿Cuánto ofreces?</label>
                        <input type="number" id="reward-price">
                    </div>
                </div>
            </div>


            <div class="pet-create-data-buttons">
                <button type="reset" class="button-secondary" id="pet-create-data-btn-reset">Limpiar</button>
                <button type="submit" class="button-primary" id="pet-create-data-btn-send">PUBLICAR ANUNCIO</button> 
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
    .pet-create-data {
        width: min(900px, 92vw);
        margin: 0 auto;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .pet-create-data-section {
        background-color: var(--backgroundblue);
        border: 2px solid var(--primary);
        border-radius: var(--radius-md);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        padding: 2rem;
    }

    .pet-create-data-location {
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
    
    .pet-create-data-inputs {
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

    #pet-create-data-form-color {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        flex-wrap: wrap;
        
    }

    .reward-input {
        display: flex;
        align-items: flex-start;
        gap: 5px;
    }

    .reward-price-input {
        max-width: 200px;
        margin-left: 20px;
        gap: 10px;
    }

    .reward-price-input input {
        width: 100%;
        margin-left: 10px;
        gap: 10px;
    }


    /* Fotografías */
    .pet-create-foto-div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 10px;
        margin-top: -10px;
        margin-top:10px;
        padding: 20px;
        background-color: var(--inputbackground);
        border: 2px dashed var(--primary);
        border-radius: var(--radius-sm);
        
        transition: background 0.3s;
        cursor: pointer;
    }
        
    .pet-create-foto-div:hover { background: rgba(0,0,0,0.05); }

    #create-form-upload-icon {
        width: 40px;
        height: 40px;
        opacity: 0.7;
    }

    #pet-create-preview-div { 
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .pet-create-preview-img {
        display:block; 
        max-width: 120px;
        max-height: 120px;
        object-fit: cover; 
        margin-top: 10px;
        background-color: var(--inputbackground);
        border-radius: var(--radius-sm);
    }

    #pet-create-data-foto {
        display:none;
    }

    /* Botones */
    .pet-create-data-buttons {
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


    #pet-create-data-search-btn{
        max-width: 150px;
        margin-top: 10px;
        align-self: flex-end;
    }


    .pet-create-data-buttons button {
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

        .pet-create-data {
            width: 95vw;
            padding: 1.5rem;
        }

        .pet-create-data-section {
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

        #pet-create-data-form-color {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
        }

        #pet-create-data-form-color select {
            min-width: 150px;
            flex: 1;
        }

        .pet-create-data-buttons {
            gap: 15px;
        }

        .foto-div {
            padding: 15px;
        }

        #preview-img {
            max-height: 300px;
        }
    }
    
    @media (max-width: 480px) {

        .pet-create-data {
            width: 100%;
            padding: 1rem;
        }

        .pet-create-data-section {
            padding: 1rem;
        }

        .pet-create-title {
            gap: 8px;
            margin-bottom: 15px;
        }

        .pet-create-data-inputs {
            gap: 14px;
        }

        #pet-create-data-form-color {
            flex-direction: column;
        }

        .reward-input {
            flex-direction: row;
            align-items: center;
            font-size: 0.85rem;
        }

        .reward-price-input {
            max-width: 100%;
        }

        .pet-create-data-buttons {
            flex-direction: column;
            width: 100%;
        }

        .pet-create-data-buttons button {
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

        #preview-img {
            max-height: 220px;
        }
    }        
`;