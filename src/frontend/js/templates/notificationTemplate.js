export const notificationHTML = `
  <section class="notification-center">
        <header class="notification-summary">
            <div class="card">
                <h3>Total no leídas</h3>
                <span class="count"></span>
            </div>
            <div class="card">
                <h3>Contactos</h3>
                <span class="count"></span>
            </div>
            <div class="card">
                <h3>Avistamientos</h3>
                <span class="count"></span>
            </div>
        </header>

        <section class="contacts-section">
            <ul class="notification-list" id="notification-list"></ul>
        </section>
`;

// Plantilla para Contacto
export const templateContacto = (contacto) => {
    // Ruta de la foto placeholder por defecto
    const placeholder = '../assets/placeholder.png';

    // Si foto_mascota_url es null, undefined o vacío, usará el placeholder
    const photo = contacto.foto_mascota_url || placeholder;
    
    
    return`
    <li class="notification-item ${contacto.leido_destinatario ? '' : 'unread'}" 
        data-id="${contacto.id}" data-tipo="contacto">
        
        <img src="${photo}"  alt="Foto de ${contacto.mascota_nombre}" class="notification-img">
        
        <div class="content">
            <h4>Mensaje de ${contacto.nombre} sobre <strong>${contacto.mascota_nombre}</strong></h4>
            <p class="message-body">"${contacto.mensaje}"</p>
            <small>Recibido el: ${contacto.fecha_creacion}</small>
            <div class="imp-info">
                <p class="info-item"><img src="../assets/icons/mingcute--phone-line.svg" alt="Icono telefono">${contacto.telefono}</p>
                <p class="info-item"><img src="../assets/icons/material-symbols--mail-outline-rounded-orange.svg" alt="Icono email">${contacto.correo}</p>
            </div>
        </div>
        
        ${!contacto.leido_destinatario ? `
        <div class="action-area">
            <button class="button-primary">✓ Marcar como leído</button>
        </div>` : ''}
    </li>`;
}

// Plantilla para Avistamiento
export const templateAvistamiento = (avistamiento) => {
    // Ruta de la foto placeholder por defecto
    const placeholder = '../assets/placeholder.png';

    // Si foto_avistamiento_url es null, undefined o vacío, usará el placeholder
    const photo = avistamiento.foto_avistamiento_url || placeholder;

    return `
    <li class="notification-item ${avistamiento.leido_propietario ? '' : 'unread'}" 
        data-id="${avistamiento.id}" data-tipo="avistamiento" data-mascota-id="${avistamiento.mascota_id}">
        
        <img src="${photo}" alt="Foto del avistamiento" class="notification-img" 
             onerror="this.onerror=null; this.src='${placeholder}';">
        
        <div class="content">
            <h4>Avistamiento de <strong>${avistamiento.mascota_nombre}</strong></h4>
            <p class="message-body">"${avistamiento.descripcion}"</p>
            <div class="imp-info">
            <p class="info-item"><img src="../assets/icons/tdesign--location.svg" alt="Icono ubicacion">${avistamiento.direccion_formateada}, ${avistamiento.municipio}</p>
            <p class="info-item"><img src="../assets/icons/solar--calendar-linear.svg" alt="Icono fecha">${avistamiento.fecha_hora}</p>
            </div>
        </div>
        
        ${!avistamiento.leido_propietario ? `
        <div class="action-area">
            <button class="button-primary">✓ Marcar como leído</button>
        </div>` : ''}
    </li>`;
};

    
export const notificationCSS = `
    /* Estilos Generales */
    .notification-center {
        max-width: 1200px;
        margin: 2rem auto;
    }

    /* Contadores */
    .notification-summary {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .card {
        flex: 1;
        padding: 1.5rem;
        background: var(--inputbackground);
        border-radius: var(--radius-lg);
        text-align: center;
        border: 1px solid #e9ecef;
    }

    .count {
        display: block;
        font-size: 2rem;
        font-weight: bold;
        color: var(--primary);
    }

    /* Listas de notificaciones */
    .notification-list {
        list-style: none;
        padding: 0;
    }

    .notification-item {
        display: flex;
        align-items: center;
        padding: 1.5rem;
        margin-bottom: 1rem;
        background: var(--backgroundblue);
        border-radius: var(--radius-md);
        transition: transform 0.2s;
        cursor: pointer;
    }

    .notification-item:hover {
        background-color: var(--backgroundorange);
    }

    /* Resaltado para elementos no leídos */
    .notification-item.unread {
        border-left: 5px solid var(--primary);
    }

    /* Imágenes y contenido */
    .notification-img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: var(--radius-md);
        margin-right: 1.5rem;
    }

    .content h4 { 
        margin: 0 0 0.5rem 0; 
    }

    .message-body, .description {
        margin: 0 0 0.5rem 0; 
        font-style: italic; 
    }

    .info-item { 
        display:flex;
        align-items:center;
        margin: 0.25rem 0; 
        font-size: 0.9rem; }

    .info-item > img {
        width:20px;
        height:20px;
        margin-right: 8px;
    }

    .imp-info { 
        margin-top: 0.5rem; 
        font-size: var(--text-sm); 
        display:flex;
        flex-direction:column;
        align-items:start;
        justify-content:start;
    }

    .contact-info img {
        width:15px;
        height:15px;
        margin-right: 10px;
    }

    /* Contenedor de acciones */
    .action-area {
        margin-left: auto;
        display: flex;
        align-items: center;
        padding-left: 1rem;
    }


    /* ------------Tablets y móviles------------ */
    @media (max-width: 768px) {
        .notification-summary {
            flex-wrap: wrap;
        }

        .card {
            flex: 1 1 45%;
        }

        .notification-item {
            padding: 1rem;
        }

        .notification-img {
            width: 80px;
            height: 80px;
        }
    }

    /* Móviles */
    @media (max-width: 480px) {
        .notification-summary {
            flex-direction: column;
        }

        .card {
            width: 100%;
        }

        .notification-item {
            flex-direction: column;
            align-items: flex-start;
        }

        .notification-img {
            width: 100%;
            height: auto;
            margin: 0 0 1rem 0;
        }

        .content {
            width: 100%;
        }

        .count {
            font-size: 1.5rem;
        }

        .action-area {
            margin-left: 0;
            margin-top: 1rem;
            width: 100%;
        }
        .btn-mark-read {
            width: 100%;
        }
    }
`;