/**
 * main.js funciona como el orquestador
 *  - Inicializa los componentes
 *  - Valida la sesión del usuario al cargar la web
 *  - Gestiona el enrutamiento
 */

// IMPORTACIÓN DE SERVICIOS
import { Auth } from './auth.js';
import { API } from './api.js';
import { adminConfig } from './admin-utils.js';

// IMPORTACIÓN DE COMPONENTES
// Importamos los componentes para que se ejecute el customElements.define() de cada uno
import './components/adminTable.js';
import './components/appAside.js';
import './components/appFooter.js';
import './components/appNavbar.js';
import './components/authLogin.js';
import './components/authReset.js';
import './components/avistamientoCard.js';
import './components/avistamientoCreationForm.js';
import './components/heroSection.js';
import './components/http-cat.js';
import './components/notificationCenter.js';
import './components/petCard.js';
import './components/petContactForm.js';
import './components/petCreationForm.js';
import './components/petDetails.js';
import './components/petFilters.js';
import './components/petList.js';
import './components/petMap.js';
import './components/reportForm.js';
import './components/supportForm.js';
import './components/userProfile.js';



/**
 * Función de inicialización
 * Se ejecuta cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Mascotas WebApp inicializada");

    // Intentamos sincronizar los datos del usuario. 
    // Hacemos petición a la API, actualizamos localstorage o borramos si hay error.
    const user = await Auth.syncUser();

    if (Auth.isLoggedIn() && !user) {
        // Si había token pero syncUser devolvió null (token caducado)
        window.location.href = 'login.html';
        return; // Detenemos la ejecución
    }

    if (user) {
        console.log("Sesión confirmada para:", user.nombre);
    }

    // Detectamos la ruta del navegador para seleccionar el tipo de datos a renderizar
    console.log("Ruta detectada por el navegador:", window.location.pathname);

    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        await renderPets('recientes');  
    }

    if (window.location.pathname.includes('/tablon')) {
        await renderPets('todas'); 
    }

    if (window.location.pathname.includes('/felices')) {
        await renderPets('felices', "?estado=RECUPERADA");

        // Ocultamos el campo para filtrar por estado
        const situacion = document.querySelector('#situacion-div');
        if (situacion) {
            situacion.classList.add('hidden');
        }
    }
});


/**
 * Gestor de errores
 * Capturar errores y mostrarlos a través de http-cats
 */
export function showHttpError(error, container = document) {
    const httpCat = container.querySelector('http-cat');
    if (!httpCat) return;

    httpCat.setAttribute('code', error.code || 500);

    if (error.message) {
        httpCat.setAttribute('message', error.message);
    }

    if (error.validationErrors) {
        httpCat.setAttribute(
            'errors',
            JSON.stringify(error.validationErrors)
        );
    }

    httpCat.style.display = 'block';
}

/**
 * Gestor de exitos
 * Capturar exitos y mostrar mensaje
 **/
export function showSuccess(message) {
    const successDiv = document.querySelector('#success-div');
    successDiv.className = 'success-div';
    successDiv.textContent = message;

    setTimeout(() => {
        successDiv.classList.add('visible');
    }, 10);

    setTimeout(() => {
        successDiv.classList.remove('visible');
        setTimeout(() => successDiv.textContent = '', 300);
    }, 3000);
}


/**
 * 
 * FUNCIONES DE LOS COMPONENTES
 * 
 */

// Variable que define el tipo de petCards que queremos ver
let currentCards = 'todas';

// petList - Función para insertar la info de la BD en las tarjetas de mascotas (llamada a API)
async function renderPets(tipo, queryParams = "") {
    currentCards = tipo;
    let response;

    // Según el tipo de tarjeta, decidimos qué método llamar
    try {
        switch(tipo) {
            case 'propias':
                response = await API.getMisMascotas(); 
                break;
            case 'recientes':
                response = await API.getMascotasRecientes(5);
                break;
            case 'todas':
                response = await API.getMascotas(queryParams);
                break;
            default:
                // Si tipo ya es una query string, la usamos
                const query = tipo.startsWith('?') ? tipo : queryParams;
                response = await API.getMascotas(queryParams);
                break;
        }

    // Renderizamos las mascotas en el componente petList
        // Si response es un Array, lo usamos. 
        // Si es un objeto, buscamos la propiedad .data.
        const pets = Array.isArray(response) ? response : (response.data || []);

        const listComponent = document.querySelector('pet-list');

        if (listComponent) {
            listComponent.pets = pets;
        }
        return pets;

    } catch (error) {
        console.error("Error al cargar:", error);
    }    
}


// petList - Función para insertar la información de las tarjetas de avistamientos
async function renderAvistamientos() {
    try {
        const response = await API.getMisAvistamientos(); 

        const avistamientoList = response.data;

        // Renderizamos los avistamientos en el componente petList
        const listContainer = document.querySelector('pet-list');
        listContainer.innerHTML = '';

        avistamientoList.forEach(av => {
            const card = document.createElement('avistamiento-card');
            card.avistamientoData = av; 
            listContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar:", error);
    }    
}


// petFilters.js - Aplicar los filtros a la carga de mascotas en pantalla
const filtersComponent = document.querySelector('pet-filters');

if (filtersComponent) {
    filtersComponent.addEventListener('filter-apply', async (e) => {
        // Recibimos datos marcados en los select
        const filterData = e.detail;
        
        // Convertimos el objeto a formato ?llave=valor&llave2=valor2
        const queryParams = new URLSearchParams();

        // Forzamos que solo se muestren las mascotas encontradas en la vista de Finales Felices
        if (window.location.pathname.includes('/felices')) {
            filterData.estado = 'RECUPERADA';
        }

        Object.entries(filterData).forEach(([key, value]) => {
            if (value) { // Solo añadimos el filtro si el usuario seleccionó algo
                queryParams.append(key, value);
            }
        });

        // Transformamos queryParams a tipo string
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
        
        // Cargamos los datos pasándole la búsqueda y el tipo de tarjetas
        const pets = await renderPets(currentCards, queryString);

        // Actualizamos el contador en el HTML
        const counterContainer = document.querySelector('.results-counter');
        const countSpan = document.querySelector('#pet-count');
        if (counterContainer && countSpan && pets) {
            // Actualizamos el número
            countSpan.textContent = pets.length;
            
            // Mostramos contador
            counterContainer.classList.add('is-visible');
        }
    });
}

// petDetail.js - Pasar el filtro para mostrar los datos de la mascota
const peDetailComponent = this.querySelector('pet-details');


// adminTable.js - Función para insertar la información del panel de administración
async function renderAdminPanel(apiMethod, columns) {
    try {
        const adminTable = document.querySelector('admin-table');
        if (!adminTable) return;

        // Llamamos al método pasado por parámetro
        const response = await apiMethod();
        
        // Guardamos la respuesta
        const datos = response.data || [];

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


// appAside.js - Función para renderizar componentes según el panel seleccionado
const mainContent = document.querySelector('#main-content');

async function loadPanel(panel) {
    const mainContent = document.querySelector('#main-content');
    mainContent.innerHTML = '';

    let component;

    switch(panel) {
        // --- Vistas de usuario ---
        case 'mascotas':
            component = document.createElement('pet-list');
            break;
        case 'perfil':
            component = document.createElement('user-profile');
            break;
        
        // --- Vistas de administrador ---
        // Usamos admin-utils.js
        case 'admin-usuarios':
            component = document.createElement('admin-table');
            mainContent.appendChild(component);
            await renderAdminPanel(adminConfig.usuarios.method, adminConfig.usuarios.columns);
            break;

        case 'admin-anuncios':
            component = document.createElement('admin-table');
            mainContent.appendChild(component);
            await renderAdminPanel(adminConfig.anuncios.method, adminConfig.anuncios.columns);
            break;

        case 'admin-reportes':
            component = document.createElement('admin-table');
            mainContent.appendChild(component);
            await renderAdminPanel(adminConfig.reportes.method, adminConfig.reportes.columns);
            break;

        case 'admin-soporte':
            component = document.createElement('admin-table');
            mainContent.appendChild(component);
            await renderAdminPanel(adminConfig.soporte.method, adminConfig.soporte.columns);
            break;
            
        default:
            mainContent.innerHTML = '<h3>Página en construcción</h3>';
            return;
    }

    // Si el componente no fue añadido en el switch (vistas usuario), lo añadimos aquí
    if (component && !mainContent.contains(component)) {
        mainContent.appendChild(component);
    }
}

// Eventos del aside: escuchamos clicks en todo el documento, pero filtramos si vienen del aside
document.addEventListener('click', (e) => {
    // Buscamos si el elemento clicado tiene el atributo data-panel
    const link = e.target.closest('[data-panel]');
    
    if (link) {
        const panel = link.getAttribute('data-panel');
        
        // Manejo especial de Logout
        if (panel === 'logout') {
            API.logout();
            Auth.clearSession();
            window.location.href = '/login.html';
            return;
        }

        // Cargar vista
        loadPanel(panel);
    }
});