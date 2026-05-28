export const qrHTML = `
    <div class="panel-overlay" id="q-panel-overlay"></div>
    <div id="qr-div">
        <p>¡Escanea para compartir o ver la ficha!</p>
        <div id="qrcode"></div>
    </div>
`;

export const qrCSS = `
    qr-code {
        display: none; /* Oculto por defecto hasta que se active */
    }

    qr-code.is-visible {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        display: flex !important;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    #qr-div{
        position: relative;
        width: min(500px, 70vw);
        max-height: 90vh;
        z-index: 1000;
        overflow: hidden;
        padding: 2rem;

        display: flex; 
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        background-color: var(--backgroundblue);
        border: 2px solid var(--primary);
        border-radius: var(--radius-md);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }

    #qrcode {
        width: 80%;
        max-width: 300px;
        padding: 2.5rem;
        border: 2px dashed var(--primary);
        border-radius: var(--radius-sm);
    }

   
    /* --------Tablets y móviles--------- */

        @media (max-width: 768px) {
            #qr-div {
                width: min(420px, 85vw);
                padding: 1.5rem;
            }

            #qrcode {
                width: 75%;
            }
        }
    

    @media (max-width: 480px) {
        #qr-div {
                width: 92vw;
                padding: 1.25rem;
                gap: 0.75rem;
                border-radius: 12px;
            }

        #qrcode {
            width: 70%;
            max-width: 240px;
        }

        qr-code.is-visible {
            padding: 0.75rem;
        }
    }
`;
  
