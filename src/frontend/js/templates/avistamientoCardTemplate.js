export const avistamientoCardHTML = `
    <delete-confirm id="delete-confirm"></delete-confirm>
    <div class="avistamiento-card">
        <img src="" id="card-avistamiento-img" alt="Foto del avistamiento">

        <div class="badge" id="avistamiento-badge">
            <p id="badge-text"></p>
        </div>

        <div class="avistamiento-card-title">
            <h3>Avistamiento de <span id="card-avistamiento-pet-name"></span></h3>
        </div>

        <div class="avistamiento-card-body">
            <div class="avistamiento-card-info">
                <div>
                    <img src="../assets/icons/tdesign--location.svg" alt="Icono ubicación">
                    <p id="card-avistamiento-loc"></p>
                </div>
                <div>
                    <img src="../assets/icons/solar--calendar-linear.svg" alt="Fecha">
                    <p id="card-avistamiento-date"></p>
                </div>
                <div class="avistamiento-desc">
                    <p id="card-avistamiento-desc"></p>
                </div>
            </div>

            <div class="avistamiento-card-actions">
                <button class="button-danger" id="btn-delete">Eliminar</button>
            </div>
        </div>
    </div>
`;

export const avistamientoCardCSS = `
    .avistamiento-card {
        position: relative;
        background-color: var(--inputbackground);
        border-radius: var(--radius-sm);
        overflow: hidden;
        box-shadow: var(--shadow-soft);
        transition: box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        padding: 20px 10px;
        width: 100%;
        box-sizing: border-box;
        min-width: 300px;
        max-width: 350px;
        margin: 0;
        cursor: pointer;
    }

    /* Imagen de la mascota */
    .avistamiento-card > img:first-child {
        width: 95%;
        height: auto;
        max-height: 200px;
        border-radius: var(--radius-sm);
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    /* Contenido de la tarjeta (Nombres y Datos) */
    .avistamiento-card h3 {
        text-align: center;
        font-size: var(--text-lg);
        align-items: center;
        color: black;
        margin-top: 1rem;
    }


    /* Contenido de la tarjeta */
    .avistamiento-card-body {
        width: 60%;
        display: grid;
        grid-template-areas: "stack";
        align-items: start;
        min-height: 100px;
    }
    
    /* Colocamos ambos divs superpuestos */
    .avistamiento-card-info, .avistamiento-card-actions {
        grid-area: stack;
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out, visibility 0.3s;    
    }

    /* Sección de Detalles (Raza, Ubicación, Fecha) */
    .avistamiento-card-info {
        padding: 0 1rem;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
        /* Filas de iconos y texto */
        .avistamiento-card-info > div {
            display: flex;
            align-items: start;
            
            gap: 8px;
            font-weight: none;
        }

        .avistamiento-card-info img {
            width: 18px;
            height: 18px;
        }

        .avistamiento-card-info p {
            margin: 0;
            font-size: var(--text-sm);
        }

        .avistamiento-desc {
            padding: 1rem;
            text-align: start;
            font-size: var(--text-sm);
            font-style: italic;
        }

        /* Botones de acción */
        .avistamiento-card-actions {
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            padding: 0.5rem;

            /* Estado inicial */
            opacity: 0;
            visibility: hidden;
            pointer-events: none; /* No clickable mientras está oculto */
        }

        .avistamiento-card-actions button {
            padding: 5px;
        }

        /* EFECTO DEL HOVER (si el usuario logeado es el dueño) */
        .avistamiento-card.is-owner:hover .avistamiento-card-info {
            
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px)
        }

        .avistamiento-card.is-owner:hover .avistamiento-card-actions {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

    /* Badges */
    .badge {
        padding: 5px 20px;
        border-radius: var(--radius-xs);
        box-shadow: var(--shadow-button);
        font-size: var(--text-sm);
        color: white;
        text-shadow: 2px 2px 5px rgba(0,0,0,0.4);
        font-weight: bold;
        text-transform: uppercase;
        position: absolute;
        top: 200px;
        z-index: 5;
    }

    .badge-perdido { background-color: var(--danger); }
    .badge-encontrado { background-color: var(--warning); }
    .badge-recuperado {background-color: var(--success); }


    /* ------- Tablet y móvil ---------- */
    @media (max-width: 768px) {

        .avistamiento-card {
            max-width: 100%;
            padding: 20px;
        }

        .avistamiento-card > img:first-child {
            max-height: 200px;
        }

        .avistamiento-card-info {
            width: 80%;
        }

        .avistamiento-card-info > div {
            justify-content: flex-start;
        }
    }

    @media (max-width: 480px) {

        .avistamiento-card {
            padding: 12px;
            gap: 8px;
        }

        .avistamiento-card > img:first-child {
            max-height: 150px;
        }

        .avistamiento-card h3,
        #card-pet-name {
            font-size: var(--text-md);
        }

        .avistamiento-card-info p {
            font-size: var(--text-xs);
        }

        .avistamiento-card-info img {
            width: 16px;
            height: 16px;
        }

    } 
`;