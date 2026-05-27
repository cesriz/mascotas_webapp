export const navBarHTML = `
    <div class="header">
        <div class="row-top">
            <a href="index.html" class="logo">
                <img src="../assets/Logo.png" alt="Icono MascotasPerdidas" class="logo-img">
                <div class="logo-text">
                    <span class="text-black">Mascotas</span><span class="text-orange">Perdidas</span>
                </div>
            </a>

            <div class="nav-btn" id="desktop-btn">
                <button class="button-secondary" id="btn-auth"></button>
                <button class="button-primary" id="btn-publish"> PUBLICAR ANUNCIO </button>
            </div>

            <!-- Botón hamburguesa -->
            <button class="hamburger-btn" id="hamburger-btn" type="button" aria-label="Abrir menu de navegacion" aria-controls="navbar" aria-expanded="false">
                <img src="../assets/icons/material-symbols--menu-rounded.svg" alt="" aria-hidden="true">
            </button>
        </div>
        <nav class="navbar" id="navbar">
            <a href="index.html">Inicio</a>
            <a href="tablon">Tablón de anuncios</a>
            <a href="felices">Finales felices</a>
            <a href="faq">FaQ</a>

            <div class="nav-btn" id="mobile-btn">
                <button class="button-secondary" id="mobile-btn-auth"></button>
                <button class="button-primary" id="mobile-btn-publicar"> PUBLICAR ANUNCIO </button>
            </div>
        </nav>
    </div>

    <button class="btn-accesibilidad" id="btn-contraste" type="button" aria-pressed="false" aria-label="Activar modo de alto contraste" title="Activar modo de alto contraste">
        <img src="../assets/icons/Accessibility_logo.svg" alt="" aria-hidden="true">
    </button>
`;

export const navBarCSS = `
    .header {
        position: sticky;
        top: 0;
        z-index: 998;
        display: grid;
        grid-template-rows: auto auto ;
        width: 100%;
        background-color: var(--background);
        box-shadow: var(--shadow-soft);
        padding: 1rem 0.5rem;
        border-bottom: 1px solid white;
    }

        .row-top {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 0.75rem 2rem;
            border-bottom: 1px solid #f0f0f0;
            gap: 1rem;
        }

        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            gap: 6px;
            flex: 0 0 auto;
            min-width: max-content;
        }

            .logo-img {
                height: 40px;
                width: auto;
                transition: all 0.2s ease;
            }

            .logo-text {
                font-size: var(--text-lg);
                font-weight: 800;
                transition: all 0.2s ease;
            }

            .text-black { color: black }
            .text-orange { 
                color: var(--primary);
                transition: all 0.2s ease;
            }

            .logo:hover .logo-img {
                transform: rotate(15deg);
            }

            .logo:hover .logo-text {
                color: var(--secondary);
                font-size: 1.3rem;
            }

            .logo:hover .text-orange {
                color: var(--secondary);
            }

        .nav-btn {
            display:flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        #desktop-btn {
            flex: 1 1 280px;
        }

        .nav-btn button {
            white-space: nowrap;
        }

        body.alto-contraste .row-top {
            gap: 1rem 1.25rem;
        }

        .hamburger-btn {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
        }

        .hamburger-btn img {
            width: 28px;
            height: 28px;
        }

        .navbar {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2.5rem;
            background-color: var(--background);
            height: 50px;
        }

            .navbar a {
                text-decoration: none;
                font-weight: 600;
                color: black;
                transition: all 0.2s ease;
            }

            .navbar a:hover:not(.active) {
                color: var(--secondary500);
                transform: translateX(-2px) translateY(-2px);
            }

            .navbar a.active {
                color: var(--primary);
                font-weight: bold;
                border-bottom: 2px solid var(--primary);
                transition: all 0.5s ease;
            }

            .navbar a.active:hover {
                color: var(--secondary500);
                transform: translateX(-2px) translateY(-2px);
                border-bottom: 2px solid var(--secondary);
            }

            #mobile-btn {
                display: none;
            }


        .badge {
            background: red;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 0.7rem;
            position: absolute;
            top: 0;
        }

    /* -------- Tablet y móvil -------- */
    @media (max-width: 768px) {
        .navbar {
            flex-direction: column;
            height: auto;
            max-height: 0;
            overflow: hidden;
            gap: 1rem;
            padding: 0;
            opacity: 0;
            transform: translateY(-8px);
            pointer-events: none;
            transition:
                max-height 0.35s ease,
                opacity 0.25s ease,
                transform 0.25s ease,
                padding 0.25s ease;
        }

        .navbar.active {
            max-height: 420px;
            padding: 1rem 0;
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        .row-top {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            position: relative;
        }

        .nav-btn {
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
        }

        .nav-btn button {
            width: 100%;
            max-width:200px;
        }

        #desktop-btn {
            display:none;
        }

        .hamburger-btn {
            display: block;
            position: absolute;
            top: 1rem;
            left: 1rem;
            transform: none;
        }

        .logo {
            align-self: center;
            transform: none;
        }

        #mobile-btn {
            display: flex;
        }
    }

    @media (max-width: 480px) {
        .nav-btn {
            flex-direction: column;
            width: 100%;
        }

        .navbar {
            gap: 0.8rem;
        }

        .hamburger-btn {
            display: block;
            position: absolute;
            top: 1rem;
            left: 0.75rem;
            transform: none;
        }
    }      
`;
