export const petQrModalHTML = `
    <div class="qr-modal-backdrop hidden" id="qr-backdrop">
        <div class="qr-modal">

            <h3 id="qr-title">QR del anuncio</h3>
            <img src="../assets/placeholder.png" alt="QR del anuncio" id="qr-image">
  
            <button class="button-primary" id="qr-download" type="button">DESCARGAR QR</button>
        </div>
    </div>
`;

export const petQrModalCSS = `
    :host {
        display: block;
    }

    .qr-modal-backdrop {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        background-color: rgba(0,0,0,0.45);
        z-index: 1000;
    }

    .qr-modal-backdrop.hidden {
        display: none;
    }

    .qr-modal {
        position: relative;
        width: min(420px, 100%);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 18px;
        padding: 2rem;
        border: 2px solid var(--primary);
        border-radius: var(--radius-sm);
        background-color: var(--backgroundblue);
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        text-align: center;
    }

    #qr-title {
        margin: 0;
        color: var(--primary);
        font-size: var(--text-lg);
        font-weight: 900;
    }

    #qr-image {
        width: 260px;
        height: 260px;
        padding: 14px;
        border-radius: var(--radius-sm);
        background-color: white;
        object-fit: contain;
    }

    #qr-url {
        max-width: 100%;
        margin: 0;
        color: black;
        font-size: var(--text-sm);
        font-weight: 600;
        overflow-wrap: anywhere;
    }
`;
