export const petListHTML = `
    <http-cat style="display: none;"></http-cat>

    <div id="grid-container"></div>

    <div id="empty-msg" class="empty-state">
        <p>No se encontraron mascotas en esta categoría.</p>
    </div>
`;

export const petListCSS = `
    :host{
        width: 100%;
    }
    
    #grid-container {
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

/* --------Tablets y móviles--------- */
    @media (max-width: 768px) {
        #grid-container {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 0.8rem;
        }

        .empty-state {
            padding: 2rem;
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

        .empty-state {
            padding: 1.5rem;
            font-size: 0.95rem;
        }
    }
`;