export const petMapHTML = `
    <div id="map-container"></div>
`;

export const petMapCSS = `
    :host { display: block; width: 100%; }
    /* Mapa */
    #map-container { 
        height: 100%;
        width: 100%; 
        min-height: 600px;
        border-radius: var(--radius-sm);
        box-shadow: var(--shadow-default);
        z-index: 1;
    }

    /* Card del avistamiento */
    .map-popup-card {
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
        cursor: pointer;
    }

    /* Imagen del avistamiento */
    .map-popup-card > img:first-child {
        width: 95%;
        height: auto;
        max-height: 200px;
        border-radius: var(--radius-sm);
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    /* Datos del avistamiento */
    .map-popup-info {
        padding: 10px 10px;
        width: 90%;
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 5px;
    }

        .map-popup-info p {
            margin: 0;
            font-size: var(--text-sm);
        }

        #map-popup-info-date {
            align-self: center;
        }

    .map-popup-contact {
        width: 90%;
        display: flex;
        flex-direction: column;
        align-items: start;

        gap: 0p;

        max-height: 0;
        opacity: 0;
        overflow: hidden;

        transition: max-height 0.3s ease, opacity 0.3s ease;
    }

        .map-popup-contact p {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .map-popup-contact img {
            width: 18px;
            height: 18px;
        }
        
        .map-popup-contact.open {
            max-height: 100px;
            opacity: 1;
        }

    /* -------- Tablet y móvil -------- */
    @media (max-width: 768px) {

        #map-container {
            min-height: 400px;
        }

        .map-popup-card {
            max-width: 100%;
            padding: 15px;
        }

        .map-popup-card > img:first-child {
            max-height: 180px; /* 🔧 más compacta */
        }

        .map-popup-info,
        .map-popup-contact {
            width: 100%;
        }
    }


    @media (max-width: 480px) {
        #map-container {
            min-height: 300px;
        }

        .map-popup-card {
            padding: 12px;
            gap: 8px;
        }

        .map-popup-card > img:first-child {
            max-height: 150px;
        }

        .map-popup-info p {
            font-size: var(--text-xs); /* 🔧 texto más compacto */
        }

        .map-popup-contact div {
            flex-wrap: wrap;
        }

        .map-popup-contact img {
            width: 16px;
            height: 16px;
        }   
`;