export const reportFormHTML = `
    <div class="panel-overlay" id="panel-overlay"></div>
    <div class="report-form">
        <div class="report-title">
            <img src="../assets/icons/mingcute--alert-line.svg">
            <h3>Reportar anuncio</h3>
        </div>

        <http-cat style="display: none;"></http-cat>
        <div id="success-div"></div>

        <form id="form-report">
            <div class="report-form-inputs">
                <div>            
                    <label for="report-subject">Asunto</label>
                    <input type="text" id="report-subject" required>
                </div>
                <div>            
                    <label for="report-msg">Mensaje</label>
                    <textarea id="report-msg" placeholder="Escribe aquí tu mensaje..." required></textarea>
                </div>
                <div>            
                    <label for="report-name">Nombre</label>
                    <input type="text" id="report-name" required>
                </div>
                <div>            
                    <label for="report-email">Email</label>
                    <input type="email" id="report-correo" required>
                </div>
                <div>            
                    <label for="report-phone">Teléfono</label>
                    <input type="text" id="report-phone">
                </div>

            </div>

            <label class="privacy-input">
                <input type="checkbox" id="privacy-check" required>
                <span>Mediante el envío de mis datos confirmo que he leído y acepto la <a href="privacidad.html" target="_blank">política de privacidad</a>.</span>
            </label>

            <div class="report-buttons">
                <button type="button" class="button-secondary" id="report-btn-reset">Limpiar</button>
                <button type="submit" class="button-primary" id="report-btn-send">Enviar</button> 
            </div>
        </form>
    </div> 
`;

export const reportFormCSS = `
    report-form {
        display: none !important; /* Oculto por defecto hasta que se active */
    }

    report-form.is-visible {
        display: block !important;
    }

    .report-form {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(600px, 90vw);
        z-index: 1000;
        max-height: 90vh;
        padding: 2rem;
        overflow-y: auto;
        display: flex; 
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
        background-color: var(--backgroundblue);
        border: 2px solid var(--primary);
        border-radius: var(--radius-md);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    
    .report-title {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--text-md);
        gap: 5px;
        margin-bottom: 10px;
        transform: translate(-10px,0);
    }

    .report-title img {
        width: 24px;
        height: 24px;
    }

    .report-form-inputs {
        display: flex;
        flex-direction: column; 
        gap: 15px;
        width: 100%;
    }

    .report-form-inputs > div {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    input, textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: var(--radius-sm);
        font-family: inherit;
    }

    textarea {
        min-height: 100px;
        resize: vertical;
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

    .report-buttons {
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    } 

    .report-buttons button {
        flex: 1;
        max-width: 150px;
        padding: 10px;
        cursor: pointer;
    }

    /* --------Tablets y móviles--------- */
    @media (max-width: 600px) {
        .report-buttons {
            flex-direction: column;
        }
        .report-buttons button {
            max-width: 100%;
        }
        .report-form {
            padding: 1.5rem;
        }
    }      
`;

