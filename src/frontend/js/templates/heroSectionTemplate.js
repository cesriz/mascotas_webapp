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
                <a href="publicar.html?estado=perdida" class="button-primary">HE PERDIDO A MI MASCOTA</a>
                <a href="publicar.html?estado=encontrada" class="button-primary">HE ENCONTRADO UNA MASCOTA</a>
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

    h1 {
        font-size: 3rem;
        font-weight: 800;
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7); /* Sombra para dar legibilidad */
        margin-bottom: 10px;
    }

    h2 {
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

    a {
        text-decoration: none;
        font-weight: bold;
    }
`;