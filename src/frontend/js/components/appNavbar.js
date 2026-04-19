import { Auth } from '../auth.js';
import { API } from '../api.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        .header {
            position: sticky;
            top: 0;
            z-index: 1000;
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
                justify-content: space-between;
                padding: 0.75rem 2rem;
                border-bottom: 1px solid #f0f0f0;
                gap: 1rem;
            }

            .logo {
                display: flex;
                align-items: center;
                text-decoration: none;
                gap: 2px;
            }

                .logo-img {
                    height: 40px;
                    width: auto;
                }

                .logo-text {
                    font-size: var(--text-lg);
                    font-weight: 800;
                }

                .text-black { color: black }
                .text-orange { color: var(--primary) }

            .nav-btn {
                display:flex;
                gap: 0.5rem;
                flex-wrap: wrap;
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
                }

                .navbar a:hover {
                    color: var(--secondary500);
                }

                #mobile-btn {
                    display: none;
                }

        /* -------- Tablet y móvil -------- */
        @media (max-width: 768px) {
            .navbar {
                flex-direction: column;
                height: 0;
                overflow: hidden;
                transition: all 0.5s ease;
                gap: 1rem;
            }
            .navbar.active {
                height: auto;
                padding: 1rem 0;
            }

            .row-top {
                flex-direction: column;
                gap: 1rem;
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
                transform: translate(0px, 5px);
            }

            .logo {
                transform: translate(30px, 0px);
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
    </style>


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
                <button class="button-primary" id="btn-publicar"> Publicar anuncio </button>
            </div>

            <!-- Botón hamburguesa -->
            <button class="hamburger-btn" id="hamburger-btn">
                <img src="../assets/icons/material-symbols--menu.png" alt="Menu burger">
            </button>
        </div>
        <nav class="navbar" id="navbar">
            <a href="index.html">Inicio</a>
            <a href="Tablon.html">Tablón de anuncios</a>
            <a href="FinalesFelices.html">Finales felices</a>
            <a href="FaQ.html">FaQ</a>

            <div class="nav-btn" id="mobile-btn">
                <button class="button-secondary" id="mobile-btn-auth"></button>
                <button class="button-primary" id="mobile-btn-publicar"> Publicar anuncio </button>
            </div>
        </nav>
    </div>
`;

export class AppNavbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    async handleLogout() {
        try {
            await API.logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
        Auth.clearSession();
        window.location.href = 'index.html';
    }

    render() {
        const isLoggedIn = Auth.isLoggedIn();
        const user = Auth.getUserData();

        // Limpiamos el contenido previo y clonamos el template
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        // Configuramos los botones de autenticación dinámicamente (desktop y tablet/móvil)
        // Utilizamos la función de abajo
        const authBtn = this.querySelector('#btn-auth');
        this.setupAuthButton(authBtn);

        const mobileBtnAuth = this.querySelector('#mobile-btn-auth');
        this.setupAuthButton(mobileBtnAuth);       


        // Lógica para el botón publicar
        const publicarBtn = this.querySelector('#btn-publicar');
        publicarBtn.addEventListener('click', () => {
            if (isLoggedIn) {
                window.location.href = 'Usuario.html'; //MODIFICAR ESTO PARA QUE APAREZCA EN LA VENTANA DE PUBLICARR
            } else {
                window.location.href = 'Auth.html';
            }
        });

        // Lógica para el menú de hamburguesa en tablet/móvil
        const burgerBtn = this.querySelector('#hamburger-btn');
        const navbar = this.querySelector('#navbar');
        const navBtn = this.querySelector('.nav-btn');

        if (burgerBtn && navbar) {
            burgerBtn.addEventListener("click", () => {
                navbar.classList.toggle("active");
                navBtn.classList.toggle("active");
            });
        }
    }

    // Función para cambiar el contenido y la funcionalidad de un botón según autenticación de usuario
    setupAuthButton(btn, isLoggedIn) {
        if (!btn) return;                
            btn.textContent = isLoggedIn ? 'Mi Perfil' : 'Iniciar sesión';

            btn.onclick = () => {
                window.location.href = isLoggedIn ? 'Usuario.html' : 'Auth.html';
            };
        }
}

customElements.define('app-navbar', AppNavbar);