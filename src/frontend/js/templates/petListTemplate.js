export const petListHTML = `
    <http-cat style="display: none;"></http-cat>

    <div id="grid-container"></div>

    <div id="empty-msg" class="empty-state">
        <p>No se encontraron mascotas.</p>
        <img src="../assets/Gemini_Generated_Image_12vyw712vyw712vy.png" alt="Gato cuenco vacío" id="list-img">
    </div>
`;

export const petListCSS = `
    :host{
        width: 100%;
    }
    
    #grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        width: 100%;
    }

    .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
        display: none;
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

        .empty-state {
            padding: 2rem;
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

        .empty-state {
            padding: 1.5rem;
            font-size: 0.95rem;
        }

        #hamster-img {
            max-width: 160px;
        }
    }
`;