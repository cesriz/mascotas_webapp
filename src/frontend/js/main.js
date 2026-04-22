// IMPORTACIÓN DE SERVICIOS
import { Auth } from './auth.js';
import { API } from './api.js';

// IMPORTACIÓN DE COMPONENTES
// Importamos los componentes para que se ejecute el customElements.define() de cada uno
import './components/appNavbar.js';
import './components/appFooter.js';
import './components/http-cat.js';
import './components/petCard.js';
import './components/petList.js';
import './components/petFilters.js';
import './components/petMap.js';
import './components/petContactForm.js';
import './components/avistamientoCreationForm.js';
import './components/petDetails.js';
// Importarás los demás según los vayas creando:
// import './components/PetForm.js';




/**
 * Función de inicialización
 * Se ejecuta cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Mascotas WebApp inicializada");

    // Verificación de sesión
    // Si hay un token, podemos pedir los datos frescos del usuario al servidor
    if (Auth.isLoggedIn()) {
        try {
            const datosUsuario  = await API.getMe();
            // Si el token es válido, actualizamos los datos en el almacén local
            // por si el usuario cambió datos en otro dispositivo
            Auth.setSession(Auth.getToken(), datosUsuario ); 
            console.log("Sesión activa:", datosUsuario .nombre);

        } catch (error) {
            console.error("Token inválido o caducado");
            Auth.clearSession();
            window.location.href = 'login.html';
        }
    }

    // Lógica de navegación activa
    marcarEnlaceActivo();
    await renderPets();

});

/**
 * Función para resaltar en qué página estamos
 */
function marcarEnlaceActivo() {
    const rutaActual = window.location.pathname;
    // Buscamos dentro de nuestro componente navbar
    const nav = document.querySelector('app-navbar');

    // ... lógica para añadir una clase 'active' a los links ...
}

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
 * Capturar exitos y mostrarlos a en mensajes
 * /
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
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}


/**
 * 
 * FUNCIONES DE LOS COMPONENTES
 * 
 */

/**
 * TABLÓN.HTML - Función para insertar la info de la BD en las tarjetas de mascotas (llamada a API)
 */
async function renderPets(queryParams = "") {
    try {
        const pets = await API.getMascotas(queryParams); 
        const listComponent = document.querySelector('pet-list');
        
        if (listComponent) {
            listComponent.pets = pets; 
        }
        
        return pets;
    } catch (error) {
        console.error("Error al obtener mascotas:", error);
    }
}
/**
 * FILTER.JS - Aplicar los filtros a la carga de mascotas en pantalla
 */

const filtersComponent = document.querySelector('pet-filters');

if (filtersComponent) {
    filtersComponent.addEventListener('filter-apply', async (e) => {
        // Recibimos datos marcados en los select
        const filterData = e.detail;
        
        // Convertimos el objeto a formato ?llave=valor&llave2=valor2
        const queryParams = new URLSearchParams();

        Object.entries(filterData).forEach(([key, value]) => {
        if (value) { // Solo añadimos el filtro si el usuario seleccionó algo
            queryParams.append(key, value);
        }
        });

        // Transformamos queryParams a tipo string
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
        
        // Cargamos los datos pasándole la búsqueda
        const pets = await renderPets(queryString);

        // Actualizamos la lista
        const petList = document.querySelector('pet-list');
        petList.pets = pets;
    });
}


// ESTO ES SOLO PARA PRUEBAS DE PETMAP - BORRAR DESPUÉS

