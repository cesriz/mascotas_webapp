import { createTemplate } from "../ui-utils.js";
import { petPosterHTML, petPosterCSS } from "../templates/petPosterTemplate.js";
import { generateQrDataUrl, getPetDetailUrl } from "../qr-utils.js";

const template = createTemplate(petPosterHTML, petPosterCSS);
const HTML_TO_IMAGE_URL = 'https://esm.sh/html-to-image@1.11.13?bundle';

export class PetPosterExporter extends HTMLElement {
    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
    }

    // Punto de entrada dónde petDetails.js solo le pasa la mascota y el componente hace el resto
    async download(pet) {
        if (!pet) return;

        try {
            // Rellena el cartel con los datos de la mascota
            const poster = await this.renderPoster(pet);
            // Convierte el cartel en imagen
            const imageData = await this.exportPosterWithFallback(poster);
            // Descarga el archivo
            this.downloadImage(imageData, pet.nombre);
        } catch (error) {
            console.error('Error al generar el cartel:', error);
            alert('No se pudo generar el cartel. Intentalo de nuevo más tarde.');
        }
    }

    // Rellena la maqueta HTML del cartel con datos reales de la mascota
    // Devuelve el nodo del cartel listo para exportar
    async renderPoster(pet) {
        const poster = this.querySelector('#social-poster-export');
        if (!poster) return null;

        this.setText('#poster-title', this.getPosterTitle(pet));
        this.setText('#poster-pet-name', pet.nombre || 'Mascota');
        this.setText('#poster-species', pet.especie_nombre || 'No especificada');
        this.setText('#poster-breed', pet.raza_nombre || 'No especificada');
        this.setText('#poster-colors', this.getPetColors(pet) || 'No especificados');
        this.setText('#poster-pet-description', pet.descripcion || 'Sin descripcion disponible.');
        this.setText('#poster-location', pet.direccion_formateada || 'Ubicacion no disponible');
        this.setText('#poster-date', this.getPosterEventDate(pet));
        this.setPosterPhoto(pet);
        await this.setPosterQr(pet);
        this.setRewardVisibility(pet);

        // Esperamos fuentes e imagenes para que html-to-image capture el cartel ya terminado
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        // Espera a que todas las imagenes carguen
        await this.waitForPosterImages(poster);
        return poster;
    }

    setText(selector, text) {
        const element = this.querySelector(selector);
        if (element) element.textContent = text;
    }

    // Asigna la foto principal de la mascota al cartel
    setPosterPhoto(pet) {
        const photo = this.querySelector('#poster-photo');
        if (!photo) return;

        photo.crossOrigin = 'anonymous';
        photo.src = pet.fotos?.[0]?.url || '../assets/placeholder.png';
        photo.alt = `Foto de ${pet.nombre || 'la mascota'}`;
    }

    // Genera el QR del anuncio y lo coloca en el cartel 
    async setPosterQr(pet) {
        const qrImg = this.querySelector('#poster-qr-img');
        if (!qrImg) return;

        const detailUrl = getPetDetailUrl(pet.id);
        qrImg.src = await generateQrDataUrl(detailUrl);
        qrImg.alt = `QR del anuncio de ${pet.nombre || 'la mascota'}`;
    }

    // Muestra/oculta la fila de recompensa según si existe
    setRewardVisibility(pet) {
        const rewardRow = this.querySelector('#poster-reward-row');
        if (!rewardRow) return;

        rewardRow.style.display = pet.recompensa !== null && pet.recompensa > 0 ? 'flex' : 'none';
    }

    getPosterTitle(pet) {
        const petName = (pet.nombre || 'MASCOTA').toUpperCase();
        const species = (pet.especie_nombre || 'ANIMAL').toUpperCase();
        const status = (pet.estado || '').toLowerCase();

        if (status === 'perdida') return `SE BUSCA A ${petName}`;
        if (status === 'encontrada') return `${species} ENCONTRADO`;

        return `AYUDA CON ${petName}`;
    }

    getPosterEventDate(pet) {
        // Mapea que fecha mostrar según estado
        const eventDateMap = {
            PERDIDA: pet.fecha_perdida,
            ENCONTRADA: pet.fecha_encontrada
        };
        const eventDate = eventDateMap[pet.estado] || '';

        return eventDate ? new Date(eventDate).
        
        // Convierte a formato legible
        toLocaleDateString('es-ES') : 'Fecha no disponible';
    }

    // Extrae el nombre de cada color y los une con comas
    getPetColors(pet) {
        if (!Array.isArray(pet.colores)) return '';
        return pet.colores.map(col => col.nombre).filter(Boolean).join(', ');
    }

    async waitForPosterImages(poster) {
        // Obtiene todas las imágenes del cartel
        const images = Array.from(poster.querySelectorAll('img'));

        await Promise.all(images.map((img) => {
            // Si ya está cargada, retorna inmediatamente
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            
            // Sino, espera a que cargue o falle
            return new Promise((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => {
                    if (!img.src.includes('placeholder.png')) {
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                        img.src = '../assets/placeholder.png';
                    } else {
                        resolve();
                    }
                };
            });
        }));
    }

    // Si la foto principal falla por CORS o por carga externa, repetimos con placeholder
    async exportPosterWithFallback(poster) {
        try {
            return await this.exportPosterToPng(poster);
        } catch (error) {
            console.error('No se pudo exportar el cartel con la foto principal. Se reintenta con placeholder.', error);

            const photo = this.querySelector('#poster-photo');
            if (photo) {
                photo.src = '../assets/placeholder.png';
                await this.waitForPosterImages(poster);
            }

            return await this.exportPosterToPng(poster);
        }
    }

    // Convierte el HTML en imagen
    async exportPosterToPng(poster) {
        // Importa la librería html-to-image
        const { toPng } = await import(HTML_TO_IMAGE_URL);

        return await toPng(poster, {
            cacheBust: true,
            pixelRatio: 2,
            width: 1080,
            height: 1350,
            canvasWidth: 1080,
            canvasHeight: 1350,
            backgroundColor: '#ffffff'
        });
    }

    downloadImage(imageData, petName) {
        const link = document.createElement('a');
        // Limpia el nombre de la mascota
        const fileName = this.slugify(petName || 'mascota');
        // Crea el link temportal para descargar
        link.download = `cartel-${fileName || 'mascota'}.png`;
        link.href = imageData;
        link.click();
    }

    // Convierte texto a formato URL-safe. "Max Perro" → "max-perro"
    slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

customElements.define('pet-poster-exporter', PetPosterExporter);
