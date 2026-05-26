export const avisCreationFormHTML = `
    <div class="panel-overlay" id="a-panel-overlay"></div>
    <div class="avistamiento-creation">
        <div class="pet-contact-title">
            <img src="../assets/icons/material-symbols--mail-outline-rounded-orange.svg" alt="Icono email">
            <h3>Registra un avistamiento</h3>
        </div>

        <http-cat style="display: none;"></http-cat>
        <div id="success-div"></div>

        <form id="avistamiento-form">
            <div class="pet-avistamiento-inputs">
                <div>            
                    <label for="avistamiento-form-email">Email</label>
                    <input type="email" id="avistamiento-form-email">
                    <span class="error-text" id="error-avistamiento-form-email"></span>
                </div>
                <div>            
                    <label for="avistamiento-form-telefono">Teléfono</label>
                    <input type="text" id="avistamiento-form-telefono">
                    <span class="error-text" id="error-avistamiento-form-telefono"></span>
                </div>

                <div class="avistamiento-form-location">            
                    <label for="avistamiento-form-loc">¿Dónde has visto a la mascota por última vez?*</label>
                    <div style="position: relative;">
                        <input type="text" id="avistamiento-form-loc" placeholder="Escribe una dirección" autocomplete="off">
                        <span class="error-text" id="error-avistamiento-form-loc"></span>
                        <div id="loc-autocomplete" class="loc-autocomplete"></div>
                    </div>
                    <button class="button-primary" type="button" id="avistamiento-search-btn">Buscar</button>
                    
                </div>
                <div>
                    <pet-map id="avistamiento-form-map" mode="select"></pet-map>
                </div>
                <input type="hidden" name="latitud" id="lat-input" required>
                <input type="hidden" name="longitud" id="lng-input" required>

                <div>            
                    <label for="avistamiento-form-date">¿Cuándo has visto a la mascota por última vez?*</label>
                    <div class="avistamiento-form-date">
                        <input type="date" id="avistamiento-form-date">
                        <input type="time" id="avistamiento-form-time">
                    </div>
                    <span class="error-text" id="error-avistamiento-form-date"></span>
                </div>

                <div>            
                    <label for="contact-desc">Descripción</label>
                    <textarea id="avistamiento-dsc" placeholder="Cualquier detalle puede marcar la diferencia..."></textarea>
                    <span class="error-text" id="error-avistamiento-dsc"></span>
                </div>

                <label for="avistamiento-foto">Sube una foto</label>
                <div class="foto-div">            
                    <img src="../assets/icons/proicons--photo.svg" alt="Icono subir foto" id="upload-icon">
                    <span id="file-name-label">Haz clic para seleccionar o arrastra una imagen</span>
                    
                    <input type="file" id="avistamiento-fotos" accept="image/*" multiple>
                    
                    <div id="preview-container">
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

export const avisCreationFormCSS = `
    avistamiento-creation-form {
        display: none; /* Oculto por defecto hasta que se active */
    }

    avistamiento-creation-form.is-visible {
        display: block !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        display: flex !important;
        align-items: center;
        justify-content: center;
        z-index: 1001;
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

    /* Título */
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

    /* Formulario */
    #avistamiento-form {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 1.5rem;
        gap: 20px;
    }

    /* Barra de desplazamiento del formulario */
    #avistamiento-form::-webkit-scrollbar {
        width: 5px; /* Barra muy fina */
    }

    #avistamiento-form::-webkit-scrollbar-track {
        background: transparent; 
    }

    #avistamiento-form::-webkit-scrollbar-thumb {
        background: rgba(83, 83, 83, 0.24);
        border-radius: 10px;
    }

    #avistamiento-form::-webkit-scrollbar-thumb:hover {
        background-color: var(--secondary);
    }

    /* Inputs del formulario */
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

    /* Input para las fotos*/
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

    #avistamiento-fotos { 
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
        max-width: 100px;
        height: auto;
        object-fit: cover;
        border-radius: var(--radius-xs);
        border: 1p solid var(--secondary500);
    }

    /* Botones */
    .avistamiento-buttons {
        width: 100% !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center;
        justify-content: center;
        gap: 20px; /* Espacio entre botones */
        margin-top: 20px;
    }
    
    .avistamiento-buttons button {
        flex: 0 1 150px; 
        width: 150px;
        padding: 10px;
        white-space: nowrap;
    }

    #avistamiento-search-btn {
        max-width: 150px;
        align-self: flex-end;
        margin-top: 5px;
    }

    /* Marcador de privacidad */
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
`;