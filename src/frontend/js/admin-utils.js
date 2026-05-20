/**
 * Contiene la configuración de las tablas de administración (columnas y lógica de acciones)
 * Se utiliza con el método loadPanel definido en main.js para renderizar los datos según la opción seleccionada en el aside
 **/

import { API } from './api.js';
import { Auth } from './auth.js';
import { showSuccess, showHttpError } from './main.js';


// Función para insertar la información del panel de administración
export async function renderAdminPanel(apiMethod, columns) {
    try {
        const adminTable = document.querySelector('admin-table');
        if (!adminTable) return;

        // Llamamos al método pasado por parámetro
        const response = await apiMethod();
        
        // Guardamos la respuesta
        const datos = response || [];
        console.log(datos);

        // Insertamos en la tabla
        adminTable.config = {
            columns: columns,
            data: datos
        };
    } catch (error) {
        console.error("Error al cargar el panel admin:", error);
        showHttpError(error);
    }
}

export const adminConfig = {
    anuncios: {
        method: () => API.getAdminAnuncios(),
        columns: [
            { label: 'Nombre de la mascota', key: 'mascota' },
            { label: 'Usuario', key: 'usuario' },
            { label: 'Fecha de publicación', key: 'fecha' },
            { label: 'Visibilidad', key: 'estado' },
            { 
                label: 'Acciones',
                render: (anuncio) => {
                    // Contenedor para agrupar múltiples botones en la misma celda
                    const container = document.createElement('div');

                    // Botón para alternar visibilidad (Publicar/Ocultar)
                    const btnToggle = document.createElement('button');
                    btnToggle.textContent = anuncio.estado === 'PUBLICADO' ? 'Ocultar' : 'Publicar';
                    btnToggle.className = 'action-btn';
                    
                    btnToggle.onclick = async () => {
                        const nuevoEstado = anuncio.estado === 'PUBLICADO' ? 'OCULTO' : 'PUBLICADO';
                        console.log(nuevoEstado);
                        try {
                            await API.updateAnuncioEstado(anuncio.id, { estado_publicacion: nuevoEstado });
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
<<<<<<< HEAD
                    { label: 'Nombre de la mascota', key: 'mascota_nombre' },
                    { label: 'Usuario reportante', key: 'nombre' },
                    { label: 'Email', key: 'correo' },
                    { label: 'Asunto', key: 'asunto' },
                    { label: 'Mensaje', key: 'mensaje' },
                    { label: 'Fecha del reporte', key: 'fecha_creacion',
                        // Función para mostrar la fecha con un formato amigable
                        render: (row) => {
                            const span = document.createElement('span');
                            const fecha = new Date(row.fecha_creacion);
                            span.textContent = fecha.toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });

                            return span;
                        }
                     },
                    { label: 'Estado del reporte', key: 'estado' },
                    { label: 'Fecha de revisión', key: 'fecha_revision',
                                              // Función para mostrar la fecha con un formato amigable
                        render: (row) => {
                            const span = document.createElement('span');
                            const fecha = new Date(row.fecha_creacion);
                            span.textContent = fecha.toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });

                            return span;
                        }
                    },
                    { label: 'Notas', key: 'notas_admin' },
=======
            { label: 'ID mascota', key: 'mascota_id' },
            { label: 'Usuario reportante', key: 'usuario_reportante_id' },
            { label: 'Usuario propietario', key: 'usuario_propietario_id' },
            { label: 'Asunto', key: 'asunto' },                                  
            { label: 'Mensaje', key: 'mensaje' },
            { label: 'Nombre', key: 'nombre' },
            { label: 'Email', key: 'correo' },
            { label: 'Teléfono', key: 'telefono' },
            { label: 'Estado', key: 'estado' },
            { label: 'Notas', key: 'notas_admin' },
>>>>>>> cbebfb4b6ca2304e77e0d183057b9e567ebdafd9
            { 
                label: 'Acción',
                render: (rep) => {
                    const container = document.createElement('div');
                    container.className = 'admin-actions-cell';

                    // Selector de Estado
                    const select = document.createElement('select');
                    select.innerHTML = `
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="REVISADO">Revisado</option>
                        <option value="DESCARTADO">Descartado</option>
                    `;
                    select.value = rep.estado;
                    select.className = 'admin-input';

                    // Input de notas
                    const notaInput = document.createElement('textarea');
                    notaInput.placeholder = 'Añadir nota...';
                    notaInput.value = rep.notas_admin || '';
                    notaInput.className = 'admin-textarea';

                    // Botón de Guardar
                    const btnSave = document.createElement('button');
                    btnSave.textContent = 'Guardar';
                    btnSave.className = 'button-secondary';
                    btnSave.style.display = 'none'; // Oculto por defecto hasta que cambie algún dato

                    // Mostramos el botón si el usuario cambia el select o escribe en la nota
                    const showBtn = () => { 
                        btnSave.style.display = 'block'; 
                    };

                    select.onchange = showBtn;
                    notaInput.oninput = showBtn;

                    btnSave.onclick = async () => {
                        btnSave.disabled = true;
                        btnSave.textContent = 'Guardando...';

                        try {
                            await API.updateReporteEstado(rep.id, { 
                                estado: select.value,
                                notas_admin: notaInput.value 
                            });

                            //showSuccess('Reporte actualizado');
                            
                            // Refrescamos datos de la tabla
                            await renderAdminPanel(adminConfig.reportes.method, adminConfig.reportes.columns);
                        } catch(error) {
                            console.error(error);
                            btnSave.disabled = false;
                            btnSave.textContent = 'Reintentar Guardar';
                        }
                    };

                    container.appendChild(select);
                    container.appendChild(notaInput);
                    container.appendChild(btnSave);
                    return container;
                }
            }
            
        ]
    },

    soporte: {
        method: () => API.getAdminSoporte(),
        columns: [
                { label: 'Usuario reportante', key: 'nombre' },
                { label: 'Email', key: 'correo' },
                { label: 'Asunto', key: 'asunto' },
                { label: 'Mensaje', key: 'mensaje' },
                { label: 'Fecha del reporte', key: 'fecha_creacion' },
                { label: 'Estado del reporte', key: 'estado' },
                { label: 'Fecha de revisión', key: 'fecha_cierre' },
                { label: 'Notas', key: 'notas_admin' },
            { 
                label: 'Acción',
                render: (ticket) => {
                    const container = document.createElement('div');
                    container.className = 'admin-actions-cell';

                    // Selector de Estado
                    const select = document.createElement('select');
                    select.innerHTML = `<option value="ABIERTO">Abierto</option>
                                        <option value="CERRADO">Cerrado</option>`;
                    select.value = ticket.estado;
                    select.className = 'admin-input';

                    // Input de notas
                    const notaInput = document.createElement('textarea');
                    notaInput.placeholder = 'Añadir nota...';
                    notaInput.value = ticket.notas_admin || '';
                    notaInput.className = 'admin-textarea';

                    // Botón de Guardar
                    const btnSave = document.createElement('button');
                    btnSave.textContent = 'Guardar';
                    btnSave.className = 'action-btn';
                    btnSave.style.display = 'none'; // Oculto por defecto hasta que cambie algún dato

                    // Mostramos el botón si el usuario cambia el select o escribe en la nota
                    const showBtn = () => { 
                        btnSave.style.display = 'block'; 
                    };

                    select.onchange = showBtn;
                    notaInput.oninput = showBtn;

                    btnSave.onclick = async () => {
                        btnSave.disabled = true;
                        btnSave.textContent = 'Guardando...';

                        try {
                            await API.updateSoporteEstado(ticket.id, { 
                                estado: select.value,
                                notas_admin: notaInput.value 
                            });

                            //showSuccess('Reporte actualizado');
                            
                            // Refrescamos datos de la tabla
                            renderAdminPanel(adminConfig.soporte.method, adminConfig.soporte.columns);
                        } catch(error) {
                            cconsole.error('Error al actualizar soporte', error);
                            btnSave.disabled = false;
                            btnSave.textContent = 'Reintentar Guardar';
                        }
                    };

                    container.appendChild(select);
                    container.appendChild(notaInput);
                    container.appendChild(btnSave);
                    return container;
                }
            }
            
        ]
    },

    usuarios: {
        method: () => API.getAdminUsuarios(),
        columns: [
            { label: 'ID', key: 'id' },
            { label: 'Usuario', key: 'usuario' },
            { label: 'Email', key: 'correo' },            
            { label: 'Rol', key: 'rol' },
            { label: 'Activo', key: 'activo',
                // Función para mostrar "Si" o "No" según el registro de la base de datos
                render: (row) => {
                const span = document.createElement('span');
                
                // Comprobamos si es 1 o 0
                const esActivo = row.activo == 1; 
                span.textContent = esActivo ? 'Sí' : 'No';
                
                // Añadimos estilos para que sea más visual
                span.style.color = esActivo ? 'var(--success)' : 'var(--danger)';

                return span;
                }
            },
            { label: 'Anuncios publicados', key: 'anuncios' },
            { 
                label: 'Acciones', 
                render: (user) => {
                    const btn = document.createElement('button');
                    btn.textContent = user.activo == 1 ? 'Bloquear' : 'Activar';
                    btn.className = 'action-btn';


                    // Ocultamos el botón si la fila corresponde a un ADMIN
                    const isUserAdmin = user.rol === 'ADMIN';

                    if (isUserAdmin) {
                            btn.classList.add('hidden');
                        }  else {
                            btn.classList.remove('hidden');
                        }


                    btn.onclick = async () => {
                        try {
                            await API.updateUsuarioEstado(user.id, { activo: user.activo ? 0 : 1 });
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

