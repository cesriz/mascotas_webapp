export const avistamientoListHTML = `
    <h2 class="dashboard-wrapper-title">MIS AVISTAMIENTOS REPORTADOS</h2>
    
    <http-cat style="display: none;"></http-cat>

    <div id="avistamientos-grid"></div>
    
    <div id="empty-msg" class="empty-state">
        <p>No se encontraron mascotas en esta categoría.</p>
    </div>
`;

export const avistamientoListCSS = `
    :host{
        width: 100%;
    }
    
    #avistamientos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        width: 100%;
    }

    .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
        display: none;
    }

    .loading-text, .no-data-text, .error-text {
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px;
        font-size: var(--text-md, 1.1rem);
        color: var(--text-color-muted, #757575);
    }

    .error-text {
        color: var(--danger, #dc3545);
    }

/* --------Tablets y móviles--------- */
    @media (max-width: 768px) {
        #grid-container {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 0.8rem;
        }
    }

    @media (max-width: 480px) {

        :host {
            padding: 0.5rem;
            box-sizing: border-box;
        }

        #grid-container {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

    }
`;