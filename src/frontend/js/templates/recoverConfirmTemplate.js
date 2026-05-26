export const recoverConfirmHTML = `
    <div class="panel-overlay" id="a-panel-overlay"></div>
    <div class="recover-confirm">
        <div id="success-div"></div>

        <div class="recover-confirm-title">
            <img src="../assets/icons/mingcute--happy-line.svg" alt="Icono emoji feliz">
            <h3>¿Estás seguro?</h3>
        </div>
        <p>Esta acción no se puede deshacer</p>
        <div id="recover-confirm-actions">
            <button class="button-secondary" id="btn-r-cancel">Cancelar</button>
            <button class="button-success" id="btn-r-recover">Sí, ¡Ha vuelto a casa!</button>
        </div>

        <div id="recover-edit-actions" class="hidden">
            <p>Si quieres, puedes actualizar tu anuncio pulsando en el siguiente botón: </p>
            <div>
                <button class="button-secondary" id="btn-r-reload">No, volver</button>
                <button class="button-primary" id="btn-r-edit">Editar anuncio</button>
            </div>

            <http-cat style="display: none;"></http-cat>
        </div>
    </div>
`;

export const recoverConfirmCSS = `
    recover-confirm {
        display: none; /* Oculto por defecto hasta que se active */
    }

    recover-confirm.is-visible {
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

    .recover-confirm {
        position: relative;
        width: min(500px, 70vw);
        max-height: 90vh;
        z-index: 1000;
        overflow: hidden;
        padding: 2rem;

        display: flex; 
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        background-color: var(--backgroundblue);
        border: 2px solid var(--primary);
        border-radius: var(--radius-md);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }

    /* Título */
    .recover-confirm-title {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--text-md);
        gap: 5px;
        margin-bottom: 10px;
        transform: translate(-10px,0);
    }

    .recover-confirm-title img {
        width: 24px;
        height: 24px;
    }

    #recover-confirm-actions {
        display: flex;
        gap: 1rem;
        padding-bottom: 1rem;

    }

    #recover-edit-actions {
        width: 100%;
        padding: 1rem;
        border-top: 1px solid var(--secondary500);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        text-align: center;
    }

    /* --------Tablets y móviles--------- */

        @media (max-width: 768px) {

        .recover-confirm {
            padding: 1.5rem;
        }

        #recover-confirm-actions {
            gap: 0.75rem;
        }
    }

    @media (max-width: 480px) {

        .recover-confirm {
            width: calc(100vw - 1rem);
            padding: 1.25rem;

        }

        .recover-confirm-title {
            align-items: flex-start;
        }

        .recover-confirm-title h3 {
            font-size: 1.1rem;
        }

        #recover-confirm-actions {
            flex-direction: column;
        }

        #recover-confirm-actions button {
            width: 100%;
        }

        #recover-edit-actions {
            padding-top: 1rem;
        }

        #recover-edit-actions button {
            max-width: 100%;
        }
    }
  
`;