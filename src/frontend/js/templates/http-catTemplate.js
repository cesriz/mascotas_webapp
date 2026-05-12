export const httpCatHTML = `
    <div class="http-cat">
        <h3>¡OH NO, HA OCURRIDO UN ERROR!</h3>
        <img id="cat-img">
        <div id="messages"></div>
    </div> 
`;

export const httpCatCSS = `
    .http-cat { 
        display: block; 
        text-align: center;
        width: 100%;
    }

    img {
        width: 100%;
        max-width: 450px;
        border-radius: var(--radius-xs);
        object-fit: contain;
        height: auto;
    }

    .error-msg {
        margin-top: 1.5rem;
        font-size: var(--text-md);
        color: black;
        font-weight: bold;
    }

    /* -------- Tablet y móvil -------- */
    @media (max-width: 768px) {
        img {
            max-width: 350px;
        }

        .error-msg {
            font-size: var(--text-sm);
        }
    }

    @media (max-width: 480px) {
        .http-cat {
            padding: 5px;
        }

        img {
            max-width: 280px;
        }

        .error-msg {
            font-size: var(--text-xs);
            margin-top: 1rem;
        }  
`;