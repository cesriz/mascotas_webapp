export const faqHTML = `
    <support-form id="support-form"></support-form>

    <div class="faq-container">
        <h1 class="dashboard-wrapper-title">PREGUNTAS FRECUENTES</h1>
        <div id="faq-list" class="faq-list"></div>
    </div>

    <div id="faq-not-found-box">
        <h3>¿No encontraste la respuesta que buscabas?</h3>

        <div id= "faq-not-found-content">
            <img src="../assets/Gemini_Generated_Image_6tgopc6tgopc6tgo.png" alt="Lagarto que se cuestiona">
            
            <div id="faq-not-found-info">
                <h4><img src="../assets/icons/mdi--clock-fast.svg" alt="Lagarto que se cuestiona">¡Te leemos rápido!</h4>
                <p> Nos comprometemos a responder a tu ticket en menos de <strong>24 horas laborables</strong>.</p>
                <button type="button" id="btn-show-support" class="button-primary">Contacta con nosotros</button>
            </div>
        </div>
    </div>
`;

export const faqCSS = `
    /* Contenedores */
    faq-view {
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
    }

    .faq-container {
        max-width: 800px;
        margin: auto;
    }

    .faq-item {
        background: var(--inputbackground);
        border-radius: var(--radius-sm);
        margin-bottom: 1rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        overflow: hidden;
        transition: all 0.3s ease;
    }

    /* Títulos - preguntas */
    .faq-question {
        padding: 1.2rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        background: none;
        border: none;
        font-weight: 600;
        font-size: var(--text-2md);
        text-align: left;
    }

    .faq-question:hover {
        background-color: var(--backgroundblue);
        color: var(--secondary500);
    }

    /* Respuestas */
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease;
        padding: 0 1.2rem;
        line-height: 1.6;
    }

    /* Estado Activo */
    .faq-item.active .faq-answer {
        max-height: 600px;
        padding-bottom: 1.2rem;
        padding-top: 1rem;
        font-size: var(--text-2md);

    }
    .faq-item.active .arrow {
        transform: rotate(180deg);
    }
    .arrow {
        transition: transform 0.3s ease;
        width: 20px;
    }


    /* Contenedor de soporte */
    #faq-not-found-box {
        width: 50%;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        border: 2px dashed var(--primary);
        border-radius: var(--radius-sm);
        
    }

    #faq-not-found-box h3 {
        font-size: var(--text-lg);
        color: var(--secondary500);
        font-weight: 500;
    }

    #faq-not-found-content {
        display:flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        padding: 1rem;
    }

    /* Imagen decorativa */
    #faq-not-found-content img {
        width: 100%;
        max-width: 200px;
        height: auto;
        object-fit: cover;
        border-radius: var(--radius-xl);
        transition: transform 0.4s ease;
    }

    #faq-not-found-content img:hover {
        animation: shake 0.6s ease-in-out;
    }

    @keyframes shake {
        0%   { transform: rotate(0deg); }
        25%  { transform: rotate(10deg); }
        50%  { transform: rotate(-10deg); }
        75%  { transform: rotate(8deg); }
        100% { transform: rotate(0deg); }
    }

    /* Información y botón de llamada a support-form */
    #faq-not-found-info {
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
        font-size: var(--text-md);
    }

    #faq-not-found-info h4 {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }

    #faq-not-found-info img {
        width: 20px;
        height: 20px;
    }

    #faq-not-found-info button {
       
        align-self: center;
    }


/* -------- Tablet y móvil -------- */
    @media (max-width: 768px) {

        faq-view {
            padding: 1rem 0.75rem;
        }

        .faq-container {
            width: 100%;
        }

        .faq-question {
            padding: 1rem;
            font-size: 1rem;
        }

        .faq-answer {
            padding: 0 1rem;
        }

        .faq-item.active .faq-answer {
            font-size: 0.95rem;
        }

        .arrow {
            width: 18px;
        }

        #faq-not-found-box {
            padding: 1rem;
        }

        #faq-not-found-content {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
        }

        #faq-not-found-info {
            align-items: center;
            text-align: center;
            padding: 0;
        }

        #faq-not-found-info button {
            align-self: center;
            width: 100%;
            max-width: 280px;
        }

        #faq-not-found-content img {
            max-width: 180px;
        }
    }


    @media (max-width: 480px) {
        faq-view {
            gap: 1.5rem;
            padding: 0.75rem 0.5rem;
        }

        .dashboard-wrapper-title {
            text-align: center;
            font-size: 1.5rem;
        }

        .faq-container {
            padding: 0;
        }

        .faq-question {
            padding: 0.9rem;
            font-size: 0.95rem;
            align-items: flex-start;
            line-height: 1.4;
        }

        .faq-answer {
            padding: 0 0.9rem;
            line-height: 1.5;
        }

        .faq-item.active .faq-answer {
            padding-top: 0.8rem;
            padding-bottom: 1rem;
            font-size: 0.9rem;
        }

        .arrow {
            width: 16px;
            margin-top: 3px;
        }

        #faq-not-found-box {
            padding: 1rem 0.75rem;
        }

        #faq-not-found-box h3 {
            font-size: 1.1rem;
            line-height: 1.4;
        }

        #faq-not-found-content {
            padding: 0.5rem;
            gap: 1rem;
        }

        #faq-not-found-content img {
            max-width: 150px;
        }

        #faq-not-found-info {
            font-size: 0.95rem;
            gap: 0.8rem;
        }

        #faq-not-found-info h4 {
            justify-content: center;
            text-align: center;
        }

        #faq-not-found-info button {
            width: 100%;
        }
    }
`;