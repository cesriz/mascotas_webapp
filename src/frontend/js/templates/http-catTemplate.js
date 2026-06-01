export const httpCatHTML = `
    <div class="http-cat">
        <button id="close-cat" class="close-cat-btn">×</button>
        <h3>¡OH NO, HA OCURRIDO UN ERROR!</h3>
        <img id="cat-img">
        <div id="messages"></div>
        <button class= "button-primary" id="retry-btn" class="retry-btn">ENTENDIDO, VOLVER A INTENTAR</button>
    </div> 
`;

export const httpCatCSS = `

    http-cat {
        display: block;
        justify-self: center;
        max-width: 800px;
        margin-bottom: 1rem;
    }

    .http-cat { 
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%,
        margin: 1rem 0;
        padding: 2rem;

        position: relative;
        background-color: inherit; 
        border-radius: var(--radius-md);
        border: 1px dotted var(--secondary500);

    }

    #cat-img {
        width: 50%;
        max-height: 70%;
        margin-top: 1rem;
        border-radius: var(--radius-xs);
        object-fit: contain;
        border-radius: var(--radius-sm);
    }

    #messages {
        width: 100%;
        max-width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
        
        padding: 0 10px;
        box-sizing: border-box;
    }

    .error-msg {
        margin: 1rem;
        font-size: clamp(0.8rem, 2vw, 1rem);
        color: black;
        max-width: 100%;
        line-height: 1.4;
        
    }

    /* Botones */
    /* Botón de la X en la esquina */
    .close-cat-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        border: none;
        background-color: var(--danger);
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        font-size: 20px;
    }

    /* Botón de reintento abajo */
    .retry-btn {
        margin: 2rem;
    }

    /* -------- Tablet y móvil -------- */
    @media (max-width: 768px) {
        .error-msg {
            font-size: var(--text-sm);
        }
    }

    @media (max-width: 480px) {
        .http-cat {
            padding: 5px;
        }

        .error-msg {
            font-size: var(--text-xs);
            margin-top: 0.5rem;
        }  
`;