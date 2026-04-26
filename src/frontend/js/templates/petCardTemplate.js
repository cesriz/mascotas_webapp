export const petCardHTML = `
    <div class="pet-card">
        <div class="card-overlay">
            <button class="button-primary" id="btn-ver">Ver detalles</button>
            <button class="button-primary" id="btn-edit">Editar anuncio</button>
            <button class="button-primary button-success" id="btn-recuperar">¡Recuperada!</button>
            <button class="button-primary button-danger" id="btn-delete">Eliminar</button>
        </div>

        <img src="" id="card-pet-img" alt="">

        <div class="badge" id="pet-badge">
            <p id="badge-text"></p>
        </div>

        <div class="pet-card-title"></div>

        <div class="pet-card-info">
            <div>
                <img src="../assets/icons/streamline-plump--pet-paw.png" alt="Icono raza">
                <p id="card-pet-raza"></p>
            </div>
            <div>
                <img src="../assets/icons/mdi--location.png" alt="Icono ubicación">
                <p id="card-pet-loc"></p>
            </div>
            <div>
                <img src="../assets/icons/solar--calendar-linear.png" alt="Icono fecha">
                <p id="card-pet-date"></p>
            </div>
        </div>
    </div> 
`;

export const petCardCSS = `
    .pet-card {
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
        max-width: 300px;
        margin: 0 auto; 
        cursor: pointer;
    }

    /* Imagen de la mascota */
    .pet-card > img:first-child {
        width: 95%;
        height: auto;
        max-height: 200px;
        border-radius: var(--radius-sm);
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    /* Contenido de la tarjeta (Nombres y Datos) */
    .pet-card h3 {
        text-align: center;
        font-size: var(--text-lg);
        align-items: center;
        color: black;
    }

    #card-pet-name {
        text-align: center;
        color: var(--secondary500);
        font-size: var(--text-lg)
    }

    /* Sección de Detalles (Raza, Ubicación, Fecha) */
    .pet-card-info {
        padding: 10px 0px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
        /* Filas de iconos y texto */
        .pet-card-info > div {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .pet-card-info img {
            width: 18px;
            height: 18px;
        }

        .pet-card-info p {
            margin: 0;
            font-size: var(--text-sm);
        }

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

    /* Badges */
    .badge {
        padding: 5px 15px;
        border-style: solid black;
        border-radius: var(--radius-xs);
        box-shadow: var(--shadow-button);
        font-size: var(--text-xs);
        color: white;
        text-transform: uppercase;
    }

    .badge-perdido { background-color: var(--danger); }
    .badge-encontrado { background-color: var(--warning); }
    .badge-recuperado {background-color: var(--success);}

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
            max-height: 150px; /*
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
