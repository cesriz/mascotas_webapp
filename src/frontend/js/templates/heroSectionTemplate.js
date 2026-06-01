export const heroSectionHTML = `
    <section class="hero">
        <div class="carousel-container" id="carousel">
            <img src="../assets/hero-1.webp" alt="Imagen 1" class="slide active">
            <img src="../assets/hero-2.webp" alt="Imagen 2" class="slide">
            <img src="../assets/hero-3.webp" class="slide">
        </div>
        <div class="hero-content">
            <h1>MASCOTAS PERDIDAS</h1>
            <h2>La red solidaria para reportar mascotas perdidas y encontradas en tu comunidad</h2>
            <h2>Juntos los traemos de vuelta a casa</h2>

            <div class="hero-buttons">
                <button class="button-primary" id="lost-btn">HE PERDIDO A MI MASCOTA</button>
                <button class="button-primary" id="found-btn">HE ENCONTRADO UNA MASCOTA</button>
            </div>
        </div>        
    </section>
`;

export const heroSectionCSS = `
    .hero {
        position: relative;
        width: 100%;
        height: 85vh;
        overflow: hidden;
    }

    .carousel-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        max-width: none !important;
        display:block;
        object-position: center;
        object-fit: cover;
        opacity: 0;
        transition: opacity 1s ease-in-out;
    }

    .slide.active {
        opacity: 1;
    }

    /* Capa de texto sobre las imágenes */
    .hero-content {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: white;
        background: rgba(0, 0, 0, 0.4);
        text-align: center;
    }

    .hero-content h1 {
        font-size: 5rem;
        font-weight: 900;
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7); /* Sombra para dar legibilidad */
        margin-bottom: 10px;
    }

    . hero-content h2 {
        font-size: 1.2rem;
        font-weight: 400;
        max-width: 600px;
        margin: 0 auto 30px auto;
        text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
    }

    .hero-buttons {
        margin-top: 25px;
        display: flex;
        gap: 20px;
        justify-content: center;
    }

    /* --------Tablets y móviles--------- */
    @media (max-width: 768px) {
        .hero {
            height: 70vh;
        }

        .hero-content {
            padding: 2rem;
        }

        .hero-content h1 {
            font-size: 3.5rem;
        }

        .hero-content h2 {
            font-size: 1rem;
            max-width: 90%;
        }

        .hero-buttons {
            flex-wrap: wrap;
            gap: 15px;
        }
    }

    @media (max-width: 480px) {
        .hero {
            height: 65vh;
        }

        .hero-content {
            padding: 1.5rem;
        }

        .hero-content h1 {
            font-size: 2.2rem;
            line-height: 1.1;
        }

        .hero-content h2 {
            font-size: 0.95rem;
            max-width: 100%;
            padding: 0 10px;
        }

        .hero-buttons {
            flex-direction: column;
            align-items: center;
            gap: 12px;
            width: 100%;
        }

        .hero-buttons a,
        .hero-buttons button {
            width: 90%;
        }
    }
`;