// Contiene la configuración de las tablas de administración (columnas y lógica de acciones)
// Se utiliza principalmente con el método renderAdminPanel definido en main.js

import { API } from './api.js';
import { showSuccess } from './main.js';

export const adminConfig = {
    anuncios: {
        method: () => API.getAdminAnuncios(),
        columns: [
            { label: 'ID', key: 'id' },
            { label: 'Nombre', key: 'nombre' },
            { label: 'Estado de la mascota', key: 'estado' },
            { label: 'Visibilidad', key: 'estado_publicacion' },
            { 
                label: 'Acciones',
                render: (anuncio) => {
                    // Contenedor para agrupar múltiples botones en la misma celda
                    const container = document.createElement('div');

                    // Botón para alternar visibilidad (Publicar/Ocultar)
                    const btnToggle = document.createElement('button');
                    btnToggle.textContent = anuncio.estado_publicacion === 'PUBLICADO' ? 'Ocultar' : 'Publicar';
                    btnToggle.className = 'action-btn';
                    btnToggle.onclick = async () => {
                        const nuevoEstado = anuncio.estado_publicacion === 'PUBLICADO' ? 'OCULTO' : 'PUBLICADO';
                        try {
                            await API.updateEstadoPublicacion(anuncio.id, { data: nuevoEstado });
                            showSuccess('Estado actualizado correctamente');
                            // Refrescamos la tabla tras la acción
                            renderAdminPanel(adminConfig.anuncios.method, adminConfig.anuncios.columns);
                        } catch (error) {
                            console.error('Error al actualizar anuncio', error);
                        }
                    };

                    // Botón para borrar anuncio
                    const btnDelete = document.createElement('button');
                    btnDelete.textContent = 'Borrar';
                    btnDelete.className = 'action-btn';
                    btnDelete.onclick = async () => {
                        try {
                            await API.deleteAnuncio(anuncio.id);
                            showSuccess('Anuncio eliminado correctamente');
                            renderAdminPanel(adminConfig.anuncios.method, adminConfig.anuncios.columns);
                        } catch(error) {
                            console.error('Error al borrar el anuncio', error);
                        }
                    };

                    container.appendChild(btnToggle);
                    container.appendChild(btnDelete);
                    return container;
                }
            }
        ],
    },

    reportes: {
        method: () => API.getAdminReportes(),
        columns: [
            { label: 'ID mascota', key: 'mascota_id' },
            { label: 'Usuario reportante', key: 'usuario_reportante_id' },
            { label: 'Usuario propietario', key: 'usuario_propietario_id' },
            { label: 'Asunto', key: 'asunto' },
            { label: 'Motivo', key: 'motivo' },                                    
            { label: 'Mensaje', key: 'mensaje' },
            { label: 'Nombre', key: 'nombre' },
            { label: 'Email', key: 'correo' },
            { label: 'Teléfono', key: 'telefono' },
            { label: 'Estado', key: 'estado' },
            { label: 'Notas', key: 'notas_admin' },
            { 
                label: 'Acción',
                render: (rep) => {
                    const select = document.createElement('select');
                    select.innerHTML = `<option value="PENDIENTE">Pendiente</option>
                                        <option value="REVISADO">Revisado</option>
                                        <option value="DESCARTADO">Descartado</option>`;
                    select.value = rep.estado;
                    
                    // Se ejecuta al cambiar el valor del selector
                    select.onchange = async (e) => {
                        try {
                            await API.updateReporteEstado(rep.id, { data: e.target.value });
                            showSuccess('Reporte actualizado correctamente');
                            renderAdminPanel(adminConfig.reportes.method, adminConfig.reportes.columns);
                        } catch(error) {
                            console.error('Error al actualizar reporte', error);
                        }
                    };
                    return select;
                }
            }
        ]
    },

    soporte: {
        method: () => API.getAdminSoporte(),
        columns: [
            { label: 'ID mascota', key: 'mascota_id' },
            { label: 'Usuario reportante', key: 'usuario_id' },
            { label: 'Asunto', key: 'asunto' },
            { label: 'Categoría', key: 'categoria' },                                    
            { label: 'Mensaje', key: 'mensaje' },
            { label: 'Email', key: 'correo' },
            { label: 'Teléfono', key: 'telefono' },
            { label: 'Estado', key: 'estado' },
            { label: 'Notas', key: 'notas_admin' },
            { 
                label: 'Acción',
                render: (ticket) => {
                    const select = document.createElement('select');
                    select.innerHTML = `<option value="ABIERTO">Abierto</option>
                                        <option value="CERRADO">Cerrado</option>`;
                    select.value = ticket.estado;
                    
                    select.onchange = async (e) => {
                        try {
                            await API.updateSoporteEstado(ticket.id, { data: e.target.value });
                            showSuccess('Ticket actualizado correctamente');
                            renderAdminPanel(adminConfig.soporte.method, adminConfig.soporte.columns);
                        } catch(error) {
                            console.error('Error al actualizar soporte', error);
                        }
                    };
                    return select;
                }
            }
        ]
    },

    usuarios: {
        method: () => API.getAdminUsuarios(),
        columns: [
            { label: 'ID', key: 'id' },
            { label: 'Nombre', key: 'nombre' },
            { label: 'Apellidos', key: 'apellidos' },
            { label: 'Email', key: 'correo' },            
            { label: 'Teléfono', key: 'telefono' },
            { label: 'Dirección', key: 'direccion' },
            { label: 'Rol', key: 'rol' },
            { label: 'Activo', key: 'activo' },
            { 
                label: 'Acciones', 
                render: (user) => {
                    const btn = document.createElement('button');
                    btn.textContent = user.activo == 1 ? 'Bloquear' : 'Activar';
                    btn.className = 'action-btn';
                    
                    btn.onclick = async () => {
                        try {
                            await API.updateUsuarioEstado(user.id, { activo: user.activo ? 0 : 1 });
                            showSuccess('Estado del usuario actualizado');
                            renderAdminPanel(adminConfig.usuarios.method, adminConfig.usuarios.columns);
                        } catch(error) {
                            console.error('Error al actualizar estado:', error);
                        }
                    };
                    return btn;
                }
            }
        ]
    },
};