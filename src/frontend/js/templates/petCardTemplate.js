export const petCardHTML = `
    <delete-confirm id="delete-confirm"></delete-confirm>
    <recover-confirm id="recover-confirm"></recover-confirm>

    <div class="pet-card">
        <img src="" id="card-pet-img" alt="">

        <div class="badge" id="pet-badge">
            <p id="badge-text"></p>
        </div>

        <div class="pet-card-title"></div>

        <div class="pet-card-body">
            <div class="pet-card-info">
                <div class="info-item">
                    <img src="../assets/icons/streamline-plump--pet-paw.svg" alt="Icono raza">
                    <p id="card-pet-raza"></p>
                </div>
                <div class="info-item">
                    <img src="../assets/icons/tdesign--location.svg" alt="Icono ubicación">
                    <p id="card-pet-loc"></p>
                </div>
                <div class="info-item">
                    <img src="../assets/icons/solar--calendar-linear.svg" alt="Icono fecha">
                    <p id="card-pet-date"></p>
                </div>
            </div>
            
            <div class="pet-card-actions">
                <button class="button-secondary" id="btn-edit">Editar</button>
                <button class="button-success" id="btn-recover">Recuperada</button>
                <button class="button-danger" id="btn-delete">Eliminar</button>
            </div>
        </div>
    </div>
`;

export const petCardCSS = `
    .pet-card {
        overflow: hidden;
        position: relative;

        width: 100%;
        box-sizing: border-box;
        min-width: 300px;
        max-width: 350px;
        padding: 2rem 1rem 1rem 1rem;
        margin: 0;

        background-color: var(--inputbackground);
        border-radius: var(--radius-sm);
        box-shadow: var(--shadow-soft);
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.75rem;
        
        cursor: pointer;
        transition: box-shadow 0.2s ease, transform 0.2s ease;;
    }

    .pet-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-sharp)
    }
    
    /* Imagen de la mascota */
    #card-pet-img {
        width: 95%;
        max-height: 200px;
        border-radius: var(--radius-sm);
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    /* Título de la tarjeta */
    .pet-card h3 {
        text-align: center;
        font-size: var(--text-lg);
        align-items: center;
        color: black;
        margin-top: 10px;
    }

    #card-pet-name {
        text-align: center;
        color: var(--secondary500);
        font-size: var(--text-lg)
    }


    /* Contenido de la tarjeta */
    .pet-card-body {
        width: 60%;
        display: grid;
        grid-template-areas: "stack";
        align-items: start;
        min-height: 100px;
    }
    
    /* Colocamos ambos divs superpuestos */
    .pet-card-info, .pet-card-actions {
        grid-area: stack;
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out, visibility 0.3s;    }

    /* Sección de Detalles (Raza, Ubicación, Fecha) */
    .pet-card-info {
        display: flex;
        flex-direction: column;
        justify-content: start;
        gap: 1rem;
        padding: 0.5rem 0;

        /* Estado inicial */
        opacity: 1;
        visibility: visible;
        transform: translateY(0);

    }
        /* Filas de iconos y texto */
        .pet-card-info > div {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .pet-card-info > div img {
            width: 18px;
            height: 18px;
        }

        .pet-card-info > div p  {
            font-weight: none;
            margin: 0;
            font-size: var(--text-md);
            word-break: break-word;
        }


    /* Botones de acción */
    .pet-card-actions {
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

    .pet-card-actions button {
        padding: 5px;
    }

    /* EFECTO DEL HOVER (si el usuario logeado es el dueño) */
    .pet-card.is-owner:hover .pet-card-info {
        
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px)
    }

    .pet-card.is-owner:hover .pet-card-actions {
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

        .pet-card {
            max-width: 100%;
            padding: 18px;
        }

        #card-pet-img {
            max-height: 180px;
        }


        .badge {
            font-size: var(--text-xs);
            padding: 5px 14px;
            top: 180px;
        }
    }

    @media (max-width: 480px) {

        .pet-card {
            padding: 12px;
            gap: 8px;
            max-width: 100%;
        }

        #card-pet-img {
            max-height: 150px;
        }

        .pet-card h3,
        #card-pet-name {
            line-height: 1.2;
        }

        .badge {
            font-size: 0.65rem;
            padding: 4px 10px;
            top: 150px;
        }

        .card-overlay button {
            width: 100%;
            font-size: var(--text-xs);
            padding: 10px;
        }
    } 
`;
