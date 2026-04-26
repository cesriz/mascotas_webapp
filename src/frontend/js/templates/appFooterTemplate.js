export const appFooterHTML = `
    <footer class="footer">
        <div class="footer-brand">
            <img src="../assets/Logo.png" alt="Logo MascotasPerdidas" class="logo-img">
        </div>

        <p id="footer-der">&copy; 2026 MascotasPerdidas. Todos los derechos reservados.</p>
        <p id="footer-names">César Ruiz | Steeven Ordoñez | Vanesa Sánchez</p>    
            
        <div class="footer-links">
            <a href="Term.html">Términos de uso</a> - <a href="Privacidad.html">Política de privacidad</a>
        </div>
    </footer>
`;

export const appFooterCSS = `
    .footer {
        background-color: var(--background);
        border-top: 2px solid var(--secondary);
        padding: 1rem 0.5rem;
        margin-top: 3rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        text-align: center;
    }

    .footer-brand {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .footer-brand img {
        width: 30px;
        height: auto;
    }
        
    #footer-der {
        color: var(--primary);
    }

    #footer-names {
        color: var(--black);
        font-weight: 600;
    }

    .footer-links a {
        color: var(--secondary500);
        text-decoration: none;
    }

    /* -------- Tablet y móvil -------- */
    @media (max-width: 768px) {

        .footer {
            padding: 1.5rem 1rem;
        }

        #footer-der,
        #footer-names {
            font-size: var(--text-xs);
        }

        .footer-links {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
    }


    @media (max-width: 480px) {

        .footer {
            gap: 8px;
        }

        #footer-der,
        #footer-names {
            font-size: 0.75rem;
        }

        .footer-links {
            font-size: 0.8rem;
        }      
`;