export const deleteConfirmHTML = `
    <div class="panel-overlay" id="a-panel-overlay"></div>
    <div class="delete-confirm">
        <div class="delete-confirm-title">
            <img src="../assets/icons/mingcute--alert-line.svg" alt="Icono alerta">
            <h3>¿Estás seguro?</h3>
        </div>
            <p>Esta acción no se puede deshacer</p>
            <div id="delete-confirm-actions">
                <button class="button-secondary" id="btn-c-cancel">No, volver</button>
                <button class="button-danger" id="btn-c-delete">Sí, estoy seguro</button>
            </div>
        </div>
    </div>
`;

export const deleteConfirmCSS = `
    delete-confirm {
        display: none; /* Oculto por defecto hasta que se active */
    }

    delete-confirm.is-visible {
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

    .delete-confirm {
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
    .delete-confirm-title {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--text-md);
        gap: 5px;
        margin-bottom: 10px;
        transform: translate(-10px,0);
    }

    .delete-confirm-title img {
        width: 24px;
        height: 24px;
    } 

    #delete-confirm-actions {
        display: flex;
        gap: 1rem;
    }

    /* --------Tablets y móviles--------- */
    @media (max-width: 768px) {

        .delete-confirm {
            padding: 1.5rem;
        }

        #delete-confirm-actions {
            gap: 0.75rem;
        }

        #delete-confirm-actions button {
            width: 100%;
        }
    }

    @media (max-width: 480px) {

        .delete-confirm {
            width: calc(100vw - 1rem);
            padding: 1.25rem;
        }

        #delete-confirm-actions {
            flex-direction: column;
            gap: 1rem;
        }

        #delete-confirm-actions button {
            width: 100%;
        }

        .delete-confirm-title {
            align-items: flex-start;
        }

        .delete-confirm-title h3 {
            font-size: var(--text-md);
        }
            
        .delete-confirm p {
            font-size: var(--text-sm);
        }
`;