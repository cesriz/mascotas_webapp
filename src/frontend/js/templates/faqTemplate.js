export const faqHTML = `
    <div class="faq-container">
        <h1 class="dashboard-wrapper-title">PREGUNTAS FRECUENTES</h1>
        <div id="faq-list" class="faq-list"></div>
    </div>
`;

export const faqCSS = `
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

/* -------- Tablet y móvil -------- */
    @media (max-width: 768px) {
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
    }

    @media (max-width: 480px) {
        .faq-container {
            padding: 0 0.5rem;
        }

        .faq-question {
            padding: 0.9rem;
            font-size: 0.95rem;
            align-items: flex-start;
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
    }
`;