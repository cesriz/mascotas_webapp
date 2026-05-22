export const petDetailsHTML = `
    <delete-confirm id="delete-confirm"></delete-confirm>
    <recover-confirm id="recover-confirm"></recover-confirm>
    <qr-code id="qr"></qr-code>

    <div class="pet-details-title"></div>

    <div class="pet-det-container">
        <div class="pet-det-images">
            <button class="carrousel-btn btn-prev" id="prev-btn">&#10094;</button>
            <div class="carrousel" id="carrousel"></div>
            <button class="carrousel-btn btn-next" id="next-btn">&#10095;</button>
            <div class="carrousel-dots" id="carrousel-dots"></div>
        </div>

        <div class="pet-det-event" id="pet-det-event">
            <div>
                <img src="../assets/icons/tdesign--location.svg" alt="Icono ubicación">
                <p id="pet-det-loc"></p>
            </div>
            <div>
                <img src="../assets/icons/solar--calendar-linear.svg" alt="Icono fecha">
                <p id="pet-det-date"></p>
            </div>
            <div class = "pet-det-reward-div">
                <img src="../assets/icons/tabler--tax-euro.svg" alt="Icono recompensa">
                <p id="pet-det-reward">¡Ofrecemos recompensa!</p>
            </div>
        </div>

        <div class="pet-det-description" id="pet-det-description"></div>

        <div class="social-media">
            <p>Un solo click puede traerlo de vuelta, ¡Ayúdanos compartiendo este anuncio!</p>
            <div class="social-media-div">
                <img src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000" alt="Facebook icon" id="facebook">
                <img src="https://img.icons8.com/?size=100&id=32323&format=png&color=000000" alt="X icon" id="twitter">
                <img src="https://img.icons8.com/?size=100&id=cMRBi0rI3iwb&format=png&color=000000" alt="Instagram icon" id="instagram">
                <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" alt="Whatsapp icon" id="whastapp">
                <img src="https://img.icons8.com/?size=100&id=63306&format=png&color=000000" alt="Telegram icon" id="telegram">        
            </div>
        </div>
        
        <div class="pet-det-data">
            <div class="pet-det-data-title">
                <img src="../assets/icons/streamline-plump--pet-paw.svg" alt="icon">
                <h3 id="pet-name">Datos de la mascota</h3>
            </div>

            <div class="pet-det-data-info">
                <ul class="pet-det-list" id="pet-det-list">
                </ul>
            </div>

            <div class="pet-det-buttons">
                <button class="button-primary" id="btn-contact">CONTACTAR</button>
                <button class="button-primary" id="btn-avistamiento">REGISTRAR AVISTAMIENTO</button>
                <button class="button-primary" id="btn-qr">GENERAR QR</button>
                <button class="button-secondary" id="btn-report">REPORTAR ANUNCIO</button>
                <button class="button-secondary hidden" id="btn-edit">EDITAR</button>
                <button class="button-success hidden" id="btn-recover">RECUPERADA</button>
                <button class="button-danger hidden" id="btn-delete">ELIMINAR</button>
            </div>
        </div>

        <pet-contact-form id="contact-modal"></pet-contact-form>
        <avistamiento-creation-form id="avistamiento-modal"></avistamiento-creation-form>
        <report-form id="report-modal"></report-form>
    </div> 
`;

export const petDetailsCSS = `
    :host  {
            display: block;
        }

        .pet-details-title {
            width: 100%;
            padding: 2rem;
            text-align: center;
            color: black;
            font-size: 3rem;
            font-weight: 900;
        }

        #pet-details-name {
            color: var(--primary);
        }
        
        .pet-det-container {
            display: grid;
            grid-template-columns: 1.2fr 0.9fr;
            grid-template-rows: auto auto auto auto; 
            gap: 30px;
            padding: 2rem;
            align-items: start;
            background-color: var(--background);
        }

        .pet-det-data {
            grid-column: 2;
            grid-row: 1 / 4;
            display: flex; 
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            padding: 2rem 4rem;
            background-color: var(--backgroundblue);
            border-radius: var(--radius-md);
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            box-sizing: border-box;
        }

        /* Carrousel de imágenes*/
        .pet-det-images {
            grid-column: 1;
            grid-row: 1;
            border-radius: var(--radius-lg);
            position: relative; /* Para posicionar los botones sobre la imagen */
            width: 100%;
            aspect-ratio: 16 / 9;
            background-color: var(--backgroundblue);
            border-radius: var(--radius-lg);
            overflow: hidden;
            display: flex;
            align-items: center;
        }

        .carrousel {
            display: flex;
            transition: transform 0.4s ease-in-out;
            width: 100%;
            height: 100%;
        }

        .carrousel img {
            min-width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .carrousel-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            padding: 15px 10px;
            cursor: pointer;
            font-size: 1.5rem;
            z-index: 10;
            border-radius: 4px;
            transition: background 0.3s;
        }

        .carrousel-btn:hover { background: rgba(0, 0, 0, 0.8); }
        .btn-prev { left: 10px; }
        .btn-next { right: 10px; }

        .carrousel-dots {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
        }

        .dot {
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            cursor: pointer;
        }

        .dot.active { background: white; }

        /* Detalles del anuncio */
        .pet-det-event {
            grid-column: 1;
            grid-row: 2;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 2rem;
            background-color: var(--backgroundblue);
            border-radius: var(--radius-md);
        }

        .pet-det-event div {
            display: flex;
            gap: 5px;
            justify-content: start;
            align-items: center;
        }

        .pet-det-event img {
            min-width: 15px;
            max-width: 20px;
            min-height: 15px;
            max-height: 20px;
        }

        .pet-det-event p{
            font-weight: 500;
        }

        .pet-det-reward-div {
            display: none;
        }

        /* Descripción */
        .pet-det-description {
            grid-column: 1;
            grid-row: 3;
            padding: 2rem;
            background-color: var(--backgroundblue);
            border-radius: var(--radius-md);
            font-size: var(--text-md);
        }

        /* Div de redes sociales */
        .social-media {
            grid-column: 1;
            grid-row: 4;
            padding: 2rem;
            display: flex; 
            flex-direction: column;
            gap: 10px;
            background-color: var(--backgroundblue);
            border-radius: var(--radius-md);
        }

        .social-media-div { display: flex; gap: 10px; }

        .social-media-div img { 
            width: 32px; 
            height: 32px; 
            cursor: pointer;
            transition: transform 0.2s; 
        }
        .social-media-div img:hover { 
            transform: scale(1.1); 
        }

        /* Detalles de la mascota */
        .pet-det-data-title {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;
            font-size: var(--text-lg);
        }

        .pet-det-data-title img {
            width: 24px;
            height: 24px;
        }

        .pet-det-list {
            list-style: none;
            padding: 1.2rem;
            margin: 0;
            font-size: var(--text-2md);
        }

        .pet-det-list li { margin-bottom: 8px; }

        .pet-det-buttons {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

     /* -------- Tablets y móviles --------- */
    @media (max-width: 768px) {
        .pet-det-container {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            padding: 1.5rem;
            gap: 20px;
        }

        .pet-det-data {
            grid-column: 1;
            grid-row: auto;
        }

        .pet-det-images {
            grid-column: 1;
            grid-row: auto;
        }

        .pet-det-event {
            grid-column: 1;
            grid-row: auto;
            font-size: var(--text-md);
        }

        .pet-det-description {
            grid-column: 1;
            grid-row: auto;
            padding: 1.5rem;
        }

        .social-media {
            grid-column: 1;
            grid-row: 5;
            padding: 1.5rem;
            font-size: var(--text-md);
        }
    }

    @media (max-width: 480px) {
        .pet-det-container {
            padding: 2rem;
            gap: 15px;
        }

        .pet-det-data,
        .pet-det-description,
        .social-media {
            padding: 1.7rem;
        }

        .pet-det-data-title {
            font-size: var(--text-lg);
        }

        .pet-det-list {
            font-size: var(--text-md);
            padding: 1rem;
        }

        .carrousel-btn {
            padding: 10px 8px;
            font-size: 1.2rem;
        }

        .social-media-div img {
            width: 28px;
            height: 28px;
        }
    }      
`;