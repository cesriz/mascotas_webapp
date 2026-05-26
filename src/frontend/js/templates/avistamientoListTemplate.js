export const avistamientoListHTML = `
    <h2 class="dashboard-wrapper-title">MIS AVISTAMIENTOS REPORTADOS</h2>
    
    <http-cat style="display: none;"></http-cat>

    <div id="avistamientos-grid"></div>
    <div id="empty-state"></div>
`;

export const avistamientoListCSS = `
    :host{
        width: 100%;
    }
    
    #avistamientos-grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        width: 100%;
    }

    #empty-state {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 3rem;
        gap: 1rem;
    }

    #list-img {
        width: 100%;
        max-width: 300px;
        height: auto;
        margin-top: 1rem;
        object-fit: cover;
        border-radius: var(--radius-xl);
        transition: transform 0.4s ease;
    }

    #list-img:hover {
        animation: shake 0.6s ease-in-out;
    }

    @keyframes shake {
        0%   { transform: rotate(0deg); }
        25%  { transform: rotate(10deg); }
        50%  { transform: rotate(-10deg); }
        75%  { transform: rotate(8deg); }
        100% { transform: rotate(0deg); }
    }

/* --------Tablets y móviles--------- */
    @media (max-width: 768px) {
        #grid-container {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 0.8rem;
        }
    }

    @media (max-width: 480px) {

        :host {
            padding: 0.5rem;
            box-sizing: border-box;
        }

        #grid-container {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

    }
`;