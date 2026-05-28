// Componente que se utiliza para ver imágenes en pantalla completa
export class ImageViewer extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <style>
                #image-viewer-overlay {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                img { 
                    max-width: 90%; 
                    max-height: 90%; 
                    object-fit: contain; 
                    border-radius: var(--radius-sm);
                }
            </style>
            <div id="image-viewer-overlay" class="panel-overlay hidden">
                <img id="full-img" src="" alt="Pantalla completa">
            </div>
        `;
    }

    connectedCallback() {
        // Al hacer click en el overlay, cerramos
        this.querySelector('#image-viewer-overlay').onclick = (e) => {
            if (e.target.id === 'image-viewer-overlay') this.close();
        };
    }

    open(src) {
        const overlay = this.querySelector('#image-viewer-overlay');
        const img = this.querySelector('#full-img');
        img.src = src;
        
        overlay.classList.remove('hidden'); 
        overlay.style.display = 'flex'; // O tu lógica de visibilidad
    }

    close() {
        const overlay = this.querySelector('#image-viewer-overlay');
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
    }
}
customElements.define('image-viewer', ImageViewer);