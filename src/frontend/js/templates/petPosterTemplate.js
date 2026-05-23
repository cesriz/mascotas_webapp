export const petPosterHTML = `
    <div class="poster-export-stage" aria-hidden="true">
        <article class="social-poster-export" id="social-poster-export">
            <header class="poster-header">
                <div class="poster-brand">
                    <img src="../assets/Logo.png" alt="MascotasPerdidas" class="poster-logo">
                    <span><strong>Mascotas</strong>Perdidas</span>
                </div>
            </header>

            <section class="poster-hero">
                <div class="poster-title-block">
                    <h2 id="poster-title"></h2>
                </div>
                <img src="../assets/placeholder.png" alt="Foto de la mascota" class="poster-photo" id="poster-photo">
            </section>

            <section class="poster-info" id="poster-info">
                <div class="poster-main-data">
                    <h3 id="poster-pet-name"></h3>

                    <div id="poster-pet-summary">
                        <p>Especie: <strong id="poster-species"></strong></p>
                        <p>Raza: <strong id="poster-breed"></strong></p>
                        <p>Colores: <strong id="poster-colors"></strong></p>
                    </div>

                    <p id="poster-pet-description"></p>
                </div>

                <div class="poster-event-data">
                    <div class="poster-data-row">
                        <span>Lugar</span>
                        <strong id="poster-location"></strong>
                    </div>
                    <div class="poster-data-row">
                        <span>Fecha</span>
                        <strong id="poster-date"></strong>
                    </div>
                    <div class="poster-data-row poster-reward-row" id="poster-reward-row">
                        <span>Recompensa</span>
                        <strong>Disponible</strong>
                    </div>
                </div>
            </section>

            <footer class="poster-footer">
                <div>
                    <p class="poster-call">Si tienes informacion, abre el anuncio y contacta desde la web.</p>
                </div>
                <div class="poster-qr-placeholder">
                    <img src="../assets/placeholder.png" alt="QR del anuncio" id="poster-qr-img">
                </div>
            </footer>
        </article>
    </div>
`;

export const petPosterCSS = `
    :host {
        display: block;
    }

    .poster-export-stage {
        position: fixed;
        left: -12000px;
        top: 0;
        width: 1080px;
        height: 1350px;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    }

    .social-poster-export {
        width: 1080px;
        height: 1350px;
        box-sizing: border-box;
        display: grid;
        grid-template-rows: 58px 528px 360px 232px;
        gap: 24px;
        padding: 50px;
        background: var(--background);
        color: black;
        font-family: "DM Sans", Arial, sans-serif;
    }

    .poster-header {
        display: flex;
        align-items: center;
    }

    .poster-brand {
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 30px;
        font-weight: 700;
    }

    .poster-brand strong {
        color: black;
    }

    .poster-logo {
        width: 58px;
        height: 58px;
        object-fit: contain;
    }

    .poster-hero {
        display: grid;
        grid-template-columns: 1fr 1fr;
        min-height: 0;
        height: 528px;
        overflow: hidden;
        border-radius: var(--radius-lg);
        background-color: var(--backgroundblue);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }

    .poster-title-block {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 44px;
        background-color: var(--primary);
        color: white;
    }

    #poster-title {
        margin: 0;
        font-size: 58px;
        line-height: 1.05;
        font-weight: 900;
        overflow-wrap: normal;
        word-break: normal;
    }

    .poster-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-color: var(--backgroundblue);
    }

    .poster-info {
        display: grid;
        grid-template-columns: 1.05fr 0.95fr;
        gap: 24px;
        min-height: 0;
        height: 360px;
    }

    .poster-main-data,
    .poster-event-data,
    .poster-footer {
        border-radius: var(--radius-md);
        background-color: var(--backgroundblue);
        box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    }

    .poster-main-data {
        padding: 38px;
        overflow: hidden;
    }

    #poster-pet-name {
        margin: 0 0 22px;
        color: var(--primary);
        font-size: 58px;
        line-height: 1;
        font-weight: 900;
        overflow-wrap: anywhere;
    }

    #poster-pet-summary {
        margin-bottom: 24px;
    }

    #poster-pet-summary p {
        margin: 0 0 12px;
        font-size: 24px;
        line-height: 1.12;
    }

    #poster-pet-summary p:last-child {
        margin-bottom: 0;
    }

    #poster-pet-description {
        margin: 0;
        display: -webkit-box;
        overflow: hidden;
        font-size: 27px;
        line-height: 1.25;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
    }

    .poster-event-data {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 34px;
        overflow: hidden;
    }

    .poster-data-row {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-bottom: 18px;
        border-bottom: 2px solid rgba(0,0,0,0.08);
    }

    .poster-data-row:last-child {
        border-bottom: 0;
        padding-bottom: 0;
    }

    .poster-data-row span {
        color: var(--primary);
        font-size: 24px;
        font-weight: 900;
        text-transform: uppercase;
    }

    .poster-data-row strong {
        display: -webkit-box;
        overflow: hidden;
        font-size: 28px;
        line-height: 1.18;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }

    .poster-footer {
        display: grid;
        grid-template-columns: 1fr 205px;
        gap: 24px;
        align-items: center;
        min-height: 0;
        padding: 24px 28px;
        box-sizing: border-box;
        overflow: hidden;
    }

    .poster-call {
        margin: 0 0 12px;
        font-size: 30px;
        font-weight: 900;
    }

    .poster-url {
        margin: 0;
        color: var(--primary);
        font-size: 23px;
        font-weight: 700;
        overflow-wrap: anywhere;
    }

    .poster-qr-placeholder {
        width: 185px;
        height: 185px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
        box-sizing: border-box;
        padding: 6px;
        border: 2px solid var(--primary);
        border-radius: var(--radius-sm);
        background-color: white;
        text-align: center;
    }

    #poster-qr-img {
        width: 155px;
        height: 155px;
        object-fit: contain;
    }

`;
