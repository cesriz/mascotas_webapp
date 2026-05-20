export const appAsideHTML = `
    <aside id="aside">
        <button class="aside-btn" id="aside-btn">
            <img src="../assets/icons/material-symbols--arrow-back-2-outline.svg" alt="Botón para esconder aside">
        </button>
            <div class="aside-links">
                <div class="aside-title">
                    <h3>ÁREA PERSONAL</h3>
                </div>
                <a class="aside-a" data-panel="mascotas"><img src="../assets/icons/streamline-plump--pet-paw-black.svg"> Mis mascotas</a>
                <a class="aside-a" data-panel="avistamientos"><img src="../assets/icons/iconamoon--eye-black.svg"> Mis avistamientos</a>
                <a class="aside-a" data-panel="notificaciones"><img src="../assets/icons/mi--notification-black.svg"> Notificaciones</a>
                <a class="aside-a" data-panel="miperfil"><img src="../assets/icons/mdi--user-outline-black.svg"> Mi perfil</a>
                <a class="aside-a" data-panel="publicar" id="aside-publish"></a>
            </div>

            <div class="aside-links" id="admin-links">
                <div class="aside-title">
                    <h3>PANEL DE CONTROL</h3>
                </div>
                <a class="aside-a" data-panel="admin-anuncios"><img src="../assets/icons/iconoir--post-black.svg" alt="Icono anuncios"> Moderación de anuncios</a>
                <a class="aside-a" data-panel="admin-usuarios"><img src="../assets/icons/cuida--users-outline-black.svg" alt="Icono usuarios"> Gestión de usuarios</a>
                <a class="aside-a" data-panel="admin-reportes"><img src="../assets/icons/mingcute--alert-line-black.svg" alt="Icono reportes"> Reportes</a>
                <a class="aside-a" data-panel="admin-soporte"><img src="../assets/icons/material-symbols--help-outline-black.svg" alt="Icono soporte"> Soporte</a>
            </div>

            <a class="aside-a" data-panel="logout" id="a-logout"><img src="../assets/icons/humbleicons--logout.svg" alt="Icono anuncios">CERRAR SESIÓN</a>
    </aside>
`;

export const appAsideCSS = `
        
    /* Contenedor principal*/
    #aside {
        background-color: var(--backgroundblue);
        width: 350px;
        height: 100%;
        box-shadow: var(--shadow-sharp);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
        border-radius: 0 0 var(--radius-md) 0;
        overflow: hidden;
        transition: width 0.3s ease, padding 0.3s ease;
    }

    /* Botón */
    .aside-btn {
        background-color: var(--primary);
        color: white;
        font-size: var(--text-lg);
        border-radius: 50%;
        border: none;
        width: 42px;
        height: 42px;
        align-self: start;
        margin-left: 1rem;

        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;

    }

    .aside-btn img {
        width: 18px;
        height: 18px;
    }

    .aside-btn:hover {
        box-shadow: var(--shadow-button);
    }

    /* Títulos*/
    .aside-title {
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 5px;
        font-size: var(--text-md);
        padding: 1rem
    }

    /* Links */
    .aside-links {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap:0.5rem;
        border-bottom: 1px solid var(--secondary500);
        padding-bottom: 1rem;
    }

    .aside-a img {
        width: 20px;
    }

    .aside-a {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 1rem;
        width: 90%;
        margin-left: 1rem;
        font-size: var(--text-2md);
        text-decoration: none;
        text-wrap: wrap;
        border-radius: var(--radius-sm);
        cursor:pointer;
        transition: all 0.2s ease;
    }

    .aside-a:hover {
        cursor: pointer;
        background-color: var(--backgroundorange);
    }

    .aside-a-active {
        font-weight: 600;
        background-color: var(--backgroundorange);
    }


    /* Clase para colapsar el aside */
    .aside-collapsed {
        width: 120px !important;
    }

    /* Ocultar elementos cuando está colapsado */
    .aside-collapsed .aside-links,
    .aside-collapsed .aside-title,
    .aside-collapsed .aside-links a,
    .aside-collapsed #a-logout{
        display: none !important;
        border-bottom: none;
    }

    /* Ajuste del botón para que se centre al colapsar */
    .aside-collapsed .aside-btn {
        
    }


    /* --------Tablets y móviles--------- */
    @media (max-width: 768px) {
        #aside {
            width: 100%;
            max-width: 100%;
            min-width: 100%;
            height: auto;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 1.5rem;
            border-radius: 0;
        }

        .aside-a {
            font-size: var(--text-md);
            padding: 0.8rem;
            width: 100%;
            margin-left: 0;
        }

        .aside-title {
            font-size: var(--text-md);
            padding: 0.5rem 0;
        }

        .aside-btn {
            order: -1;
            margin-left: 0;
            align-self: center;
        }
    }

    @media (max-width: 480px) {

        #aside {
            width: 100%;
            height: auto;
            flex-direction: column;
            padding: 1rem;
            gap: 1rem;
            border-radius: 0;
        }

        .aside-links {
            width: 100%;
            align-items: stretch;
        }

        .aside-title {
            justify-content: center;
            text-align: center;
            font-size: var(--text-md);
        }

        .aside-a {
            font-size: var(--text-md);
            padding: 1rem;
            width: 100%;
            margin-left: 0;
            justify-content: flex-start;
        }

    }
`;