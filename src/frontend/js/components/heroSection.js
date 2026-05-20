import { createTemplate } from "../ui-utils.js";
import { heroSectionHTML, heroSectionCSS } from "../templates/heroSectionTemplate.js";
import { Auth } from '../auth.js';

// Importamos plantilla (HTML y CSS)
const template = createTemplate(heroSectionHTML, heroSectionCSS);

class HeroSection extends HTMLElement {
  constructor() {
    super();
    this.currentIndex = 0;
    this.intervalId = null;
  }

  connectedCallback() {
    this.render();
    this.startCarousel();
  }

  // Si el usuario cambia de página, el temporizador se para
  disconnectedCallback() {
    clearInterval(this.intervalId);
  }

  // Función para que las imágenes cambien por sí solas
  startCarousel() {
    const slides = this.querySelectorAll('.slide');
    
    this.intervalId = setInterval(() => {
      // Quitamos clase "active" a la imagen actual
      slides[this.currentIndex].classList.remove('active');

      // Calculamos el siguiente índice (vuelve a 0 al llegar al final)
      this.currentIndex = (this.currentIndex + 1) % slides.length;

      // Añadimos clase "active" a la nueva imagen
      slides[this.currentIndex].classList.add('active');
    }, 5000); // Cambia cada 5 segundos
  }

  render() {
    // Limpiamos e inyectamos el contenido del template
    this.innerHTML = '';
    this.appendChild(template.content.cloneNode(true));

    // Comprobamos si el usuario está autenticado
    const isLoggedIn = Auth.isLoggedIn();
    const user = Auth.getUserData();

    // Lógica para el botón de mascota perdida
    const publishLostBtn = this.querySelector('#lost-btn');
    publishLostBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isLoggedIn) {
            window.location.href = 'perfil?panel=publicar&estado=perdida';
        } else {
            window.location.href = 'login.html';
        }
    });

    // Lógica para el botón de mascota encontrada
    const publishFoundBtn = this.querySelector('#found-btn');
    publishFoundBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isLoggedIn) {
            window.location.href = 'perfil?panel=publicar&estado=encontrada';
        } else {
            window.location.href = 'login.html';
        }
    });

  }
}

customElements.define('hero-section', HeroSection);