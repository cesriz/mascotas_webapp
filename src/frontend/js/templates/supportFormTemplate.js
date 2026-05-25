export const supportFormHTML = `
    <div class="panel-overlay" id="panel-overlay"></div>
    <div class="support-form">
        <div class="support-title">
            <img src="../assets/icons/material-symbols--privacy-tip-outline-rounded.svg" src="Icono seguridad">
            <h3>Contactar con soporte técnico</h3>
        </div>

        <http-cat style="display: none;"></http-cat>
        <div id="success-div"></div>

        <form id="form-support">
            <div class="support-form-inputs">
                <div style="display: none">            
                    <input type="number" id="support-user-id">
                </div>
                <div>            
                    <label for="support-subject">Asunto</label>
                    <input type="text" id="support-subject">
                    <span class="error-text" id="error-support-subject"></span>
                </div>
                <div>            
                    <label for="support-category">Categoría</label>
                    <select id="support-category">
                        <!-- Opción por defecto vacía para forzar a elegir -->
                        <option value="" disabled selected>Selecciona una opción...</option>
                        
                        <!-- Categorías principales -->
                        <option value="tecnico">Problema técnico</option>
                        <option value="dudas">Dudas sobre la web</option>
                        <option value="sugerencia">Sugerencias e ideas de mejora</option>
                    </select>
                </div>
                <div>            
                    <label for="support-msg">Mensaje</label>
                    <textarea id="support-msg" placeholder="Escribe aquí tu mensaje..."></textarea>
                    <span class="error-text" id="error-support-msg"></span>
                </div>
                <div>            
                    <label for="support-name">Nombre</label>
                    <input type="text" id="support-name">
                    <span class="error-text" id="error-support-name"></span>
                </div>
                <div>            
                    <label for="support-email">Email</label>
                    <input type="email" id="support-correo">
                    <span class="error-text" id="error-support-correo"></span>
                </div>
                <div>            
                    <label for="support-phone">Teléfono</label>
                    <input type="text" id="support-phone">
                    <span class="error-text" id="error-support-phone"></span>
                </div>

            </div>

            <label class="privacy-input">
                <input type="checkbox" id="privacy-check" required>
                <span>Mediante el envío de mis datos confirmo que he leído y acepto la <a href="privacidad.html" target="_blank">política de privacidad</a>.</span>
            </label>

            <div class="support-buttons">
                <button type="button" class="button-secondary" id="support-btn-reset">Limpiar</button>
                <button type="submit" class="button-primary" id="support-btn-send">Enviar</button> 
            </div>
        </form>
    </div> 
`;

export const supportFormCSS = `
    /* Contenedor principal*/
    support-form {
        display: none !important; /* Oculto por defecto hasta que se active */
    }

    support-form.is-visible {
        display: block !important;
    }

    .support-form {
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

    /* Ocultamos barra de desplazamiento */
        ::-webkit-scrollbar {
            display: none;
        }

        /* Firefox */
        support-form {
            scrollbar-width: none;
        }

        /* IE y Edge antiguos */
        support-form {
            -ms-overflow-style: none;
        }

    /* Título */    
    .support-title {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--text-md);
        gap: 5px;
        margin-bottom: 10px;
        transform: translate(-10px,0);
    }

    .support-title img {
        width: 24px;
        height: 24px;
    }

    /* Formulario */
    .support-form-inputs {
        display: flex;
        flex-direction: column; 
        gap: 15px;
        width: 100%;
    }

    .support-form-inputs > div {
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

    /* Selector de términos y condiciones */
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

    /* Botones */
    .support-buttons {
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    } 

    .support-buttons button {
        flex: 1;
        max-width: 150px;
        padding: 10px;
        cursor: pointer;
    }

    /* --------Tablets y móviles--------- */
    @media (max-width: 600px) {
        .support-buttons {
            flex-direction: column;
        }
        .support-buttons button {
            max-width: 100%;
        }
        .support-form {
            padding: 1.5rem;
        }
    }      
`;

