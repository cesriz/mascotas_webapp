export const appAsideHTML = `
    <aside id="aside-admin">
        <button class="aside-btn" id="aside-btn">
            <img src="../assets/icons/material-symbols--arrow-back-2-outline.png" alt="Botón para esconder aside">
        </button>

        <div class="aside-title" id="aside-title">
            <img src="../assets/icons/lsicon--setting-outline.png" alt="Icono panel-control">
            <h3>Panel de control</h3>
        </div>

        <div class="aside-links" id="aside-links"></div>

        <button class="button-primary" id="aside-action-btn"></button>
    </aside>
`;

export const appAsideCSS = `

    /* Contenedor */
    aside {
        background-color: var(--backgroundblue);
        max-width: 500px;
        min-width: 200px;
        height: 100%;
        border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        box-shadow: var(--shadow-sharp);
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 30px;
    }

    /* Título */
    .aside-title {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 5px;
        width: 70%;
        font-size: var(--text-xl);
    }

    .aside-title img {
        width: 30px;
        height: 30px;
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

    /* Links */
    .aside-links {
        width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        gap: 10px;
    }

    a {
        color: var(--primary);
        font-size: var(--text-lg);
        text-decoration: none;
        text-wrap: wrap;
    }

    a:hover {
        font-weight: 700;
        cursor: pointer;
    }

    a.active {
        color: var(--secondary);
        cursor: pointer;
    }

    /* Clase para colapsar el aside */
    .aside-collapsed {
        min-width: 60px !important;
        width: 60px !important;
    }

    /* Ocultar elementos cuando está colapsado */
    .aside-collapsed .aside-admin-title,
    .aside-collapsed .aside-links a,
    .aside-collapsed #aside-action-btn {
        display: none !important;
    }

    /* Ajuste del botón para que se centre al colapsar */
    .aside-collapsed .aside-btn {
        margin-right: 0;
    }

    /* --------Tablets y móviles--------- */
    @media (max-width: 768px) {
        .aside-title {
            font-size: var(--text-lg);
            gap: 8px;
        }

          .aside-title img {
             width: 26px;
             height: 26px;
        }

        a {
            font-size: var(--text-lg);
        }
    }

    @media (max-width: 480px) {
        aside {
            width: 100%;
            max-height: fit-content;
            padding: 1rem;
            gap: 20px;
            border-radius: 0;
        }
        .aside-title {
            width: 100%;
            justify-content: center;
            text-align: center;
            font-size: var(--text-md);
            gap: 6px;
        }

        .aside-title img {
            width: 22px;
            height: 22px;
        }

        .aside-btn {
            width: 38px;
            height: 38px;
        }

        .aside-btn img {
            width: 16px;
            height: 16px;
        }

        .aside-links {
            justify-content: center;
            align-items: center;
        }

        a {
            font-size: var(--text-md);
        }
    }
`;