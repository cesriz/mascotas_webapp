import { API } from "../api.js";
import { createTemplate } from "../ui-utils.js";
import { notificationHTML, notificationCSS, templateAvistamiento, templateContacto } from "../templates/notificationTemplate.js";

// Importamos plantilla (HTML y CSS)
const template = createTemplate(notificationHTML, notificationCSS);

export class Notification extends HTMLElement {
    constructor() {
        super();
        this.data = null;
    }

    async connectedCallback() {
        await this.showNotifications();
        this.addEvents();
    }

    async showNotifications() {
        try {
            // Obtenemos los datos de la API
            this.data = await API.getNotificaciones();

        // Creamos una lista única combinando contactos y avistamientos
        // Añadimos una propiedad 'tipo' a cada objeto
        const contacts = this.data.contactos.map(c => ({ ...c, tipo: 'contacto' }));
        const avistamientos = this.data.avistamientos.map(a => ({ ...a, tipo: 'avistamiento' }));
        
        this.notificacionesCompletas = [...contacts, ...avistamientos];
        
        // Ordenamos por fecha
        this.notificacionesCompletas.sort((a, b) => 
            new Date(b.fecha_creacion || b.fecha_hora) - new Date(a.fecha_creacion || a.fecha_hora)
        );

        this.render();

        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        }
    }

    render() {
        // Actualizamos contadores del resumen
        const counts = this.querySelectorAll('.count');
        counts[0].textContent = this.data.resumen.total_no_leidas;
        counts[1].textContent = this.data.resumen.contactos_no_leidos;
        counts[2].textContent = this.data.resumen.avistamientos_no_leidos;

        // Renderizar contactos y avistamientos
        const list = this.querySelector('#notification-list');

        list.innerHTML = this.notificacionesCompletas.map(item => {
            // Llamamos a la plantilla correspondiente según el tipo
            return item.tipo === 'contacto' ? templateContacto(item) : templateAvistamiento(item);
        }).join('');

    }

    addEvents() {
        // Lógica para marcar como leído
        // Al hacer click en un botón, buscamos la tarjeta a la que pertenece
        this.addEventListener('click', async (e) => {
            if (e.target.matches('.button-primary')) {
                const item = e.target.closest('.notification-item');
                const { id, tipo } = item.dataset; // 'contacto' o 'avistamiento'

                try {
                    if (tipo === 'contacto') {
                        await API.leerContacto(id);
                    } else {
                        await API.leerAvistamiento(id);
                    }

                    item.classList.remove('unread'); // Eliminamos estilos de las notificaciones no-leídas
                    e.target.remove(); // Eliminamos el botón tras marcar

                } catch (err) {
                    alert("No se pudo marcar como leída");
                }
            }

            // Al hacer clic en tarjeta de avistamiento, redireccionamos a los detalles de la mascota
            if (e.target.closest('.notification-item') && e.target.dataset.tipo === 'avistamiento') {
                const mascotaId = e.target.closest('.notification-item').dataset.mascotaId;
                window.location.hash = `/mascotas/${mascotaId}`;
            }
        });
    }
}

customElements.define('notification-center', Notification);
