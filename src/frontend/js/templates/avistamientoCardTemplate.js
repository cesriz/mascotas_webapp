export const avistamientoCardHTML = `
    <div class="avistamiento-card">
        <img src="" id="card-avistamiento-img" alt="Foto del avistamiento">

        <div class="badge" id="avistamiento-badge">
            <p id="badge-text"></p>
        </div>

        <div class="avistamiento-card-title">
            <h3>Avistamiento de <span id="card-avistamiento-pet-name"></span></h3>
        </div>

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

    #card-pet-name {
        text-align: center;
        color: var(--secondary500);
        font-size: var(--text-lg)
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


    
    /* Overlay con degradado - Menú */
    .card-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        
        
        background: linear-gradient(180deg, rgba(255,107,0,0.0) 0%, var(--primary) 60%, var(--secondary) 100%);
        
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding: 20px;
        gap: 10px;
        box-sizing: border-box;
        
        /* Oculto por defecto */
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        z-index: 10;
    }

    /* Solo si la tarjeta tiene la clase 'is-owner', 
    permitimos que el hover active el overlay */
    .pet-card.is-owner:hover .card-overlay {
        opacity: 1;
        visibility: visible;
    }

    /* Estilo para visitantes */
    .pet-card:not(.is-owner) {
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .pet-card:not(.is-owner):hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-sharp)
    }


    /* ------- Tablet y móvil ---------- */
    @media (max-width: 768px) {

        .pet-card {
            max-width: 100%;
            padding: 20px;
        }

        .pet-card > img:first-child {
            max-height: 200px;
        }

        .pet-card-info {
            width: 80%;
        }

        .pet-card-info > div {
            justify-content: flex-start;
        }
    }

    @media (max-width: 480px) {

        .pet-card {
            padding: 12px;
            gap: 8px;
        }

        .pet-card > img:first-child {
            max-height: 150px;
        }

        .pet-card h3,
        #card-pet-name {
            font-size: var(--text-md);
        }

        .pet-card-info p {
            font-size: var(--text-xs);
        }

        .pet-card-info img {
            width: 16px;
            height: 16px;
        }

        .card-overlay {
            padding: 10px;
        }

        .card-overlay button {
            font-size: var(--text-sm);
            padding: 8px;
        }
    } 
`;