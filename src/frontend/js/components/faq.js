import { createTemplate } from "../ui-utils.js";
import { faqHTML, faqCSS } from "../templates/faqTemplate.js";

const template = createTemplate(faqHTML, faqCSS);

export class FaqView extends HTMLElement {
    constructor() {
        super();
        this._data = [
            { 
                q: "¿Cómo publico una mascota perdida?", 
                a: "Solo tienes que crear una publicación indicando el nombre de la mascota, una descripción, la última ubicación donde fue vista y subir una foto reciente. Cuanta más información añadas, más fácil será identificarla." 
            },
            {
                q: "¿Publicar un anuncio tiene algún coste?",
                a: "No, publicar mascotas perdidas o encontradas es completamente gratuito."
            },
            {
                q: "¿Qué debo hacer si encuentro una mascota?",
                a: "Puedes crear una publicación indicando dónde la encontraste, añadir fotos y detalles sobre su estado. También recomendamos llevarla a un veterinario para comprobar si tiene microchip."
            },
            {
                q: "¿Cómo contacto con la persona que publicó el anuncio?",
                a: "Desde la propia publicación podrás enviar un mensaje directo o utilizar los datos de contacto facilitados por el propietario."
            },
            {
                q: "¿Puedo editar o eliminar mi publicación?",
                a: "Sí, puedes modificar la información o eliminar el anuncio en cualquier momento desde tu perfil."
            },
            {
                q: "¿Cómo aumento las posibilidades de encontrar a mi mascota?",
                a: "Te recomendamos publicar varias fotos recientes, compartir el anuncio en redes sociales y mantener actualizada la información de la publicación."
            },
            {
                q: "¿Qué hago si mi mascota ya apareció?",
                a: "Puedes marcar la publicación como recuperada para informar al resto de usuarios y cerrar el caso."
            },
            {
                q: "¿La plataforma verifica las publicaciones?",
                a: "Nuestro equipo revisa los anuncios para evitar spam, contenido falso o publicaciones inapropiadas."
            },
            {
                q: "¿Puedo buscar mascotas por zona?",
                a: "Sí, puedes filtrar publicaciones por ciudad, provincia o ubicación cercana para encontrar casos relevantes en tu área."
            },
            {
                q: "¿Qué pasa si alguien reclama una mascota encontrada?",
                a: "Recomendamos verificar fotografías, características únicas o documentación antes de entregar la mascota para asegurarse de que pertenece realmente a esa persona."
            },
            {
                q: "¿La plataforma funciona también para otros animales?",
                a: "Sí, además de perros y gatos, puedes publicar aves, conejos y otras mascotas domésticas."
            },
            {
                q: "¿Necesito crear una cuenta para publicar?",
                a: "Sí, es necesario registrarse para poder gestionar tus publicaciones y facilitar un contacto seguro entre usuarios."
            },
            {
                q: "¿Qué hago si veo una publicación falsa o sospechosa?",
                a: "Puedes reportarla directamente desde la publicación y nuestro equipo la revisará lo antes posible."
            }
        ];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));
        
        const list = this.querySelector('#faq-list');

        // Creamos un contenedor para cada pregunta
        this._data.forEach(item => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            
            faqItem.innerHTML = `
                <button class="faq-question">
                    ${item.q}
                    <img src="../assets/icons/ri--arrow-drop-down-line.svg" class="arrow">
                </button>
                <div class="faq-answer">
                    <p>${item.a}</p>
                </div>
            `;

            // Evento para visualizar la respuesta a la pregunta
            faqItem.querySelector('.faq-question').onclick = () => {
                // Al hacer click en una de las preguntas, se cierran las demás automáticamente
                this.querySelectorAll('.faq-item').forEach(el => {
                    if (el !== faqItem) el.classList.remove('active');
                });
                
                faqItem.classList.toggle('active');
            };

            list.appendChild(faqItem);
        });
    }
}
customElements.define('faq-view', FaqView);