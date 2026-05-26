/**
 * ui-utils.js contiene la lógica necesaria para varios componentes distintos.
 */

// Lógica del sistema de plantillas de componentes
export const createTemplate = (htmlContent, cssContent = '') => {
    const template = document.createElement('template');
    template.innerHTML = `
        <style>${cssContent}</style>
        ${htmlContent}
    `;
    return template;
};


// Lógica que activa el autocompletado de Nominatim en un input
// Lo utilizamos en avistamientoCreationForm y petCreationForm
export function addressAutocomplete(inputElement, resultsContainer, onSelect) {
    let timeout = null;

    // Input de texto donde el usuario escribe la dirección
    inputElement.addEventListener('input', () => {
        clearTimeout(timeout);
        const query = inputElement.value.trim();

        if (query.length < 3) {
            resultsContainer.style.display = 'none';
            return;
        }

        timeout = setTimeout(async () => {
            try {
                // Llamamos a la API de Nominatim
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=es`
                );
                const data = await response.json();
                renderResults(data);
            } catch (error) {
                console.error("Error en autocompletado:", error);
            }
        }, 400);
    });

    // Renderizamos resultados
    function renderResults(results) {
        resultsContainer.innerHTML = '';
        if (!results || results.length === 0) {
            resultsContainer.style.display = 'none';
            return;
        }

        resultsContainer.style.display = 'block';

        results.forEach(place => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item'; // Clase definida en sytle.css
            item.textContent = place.display_name;

            item.onclick = () => {
                inputElement.value = place.display_name;
                resultsContainer.style.display = 'none';
                
                // Ejecutamos la lógica personalizada del formulario (mover mapa, guardar coords, etc.)
                if (onSelect) {
                    onSelect({
                        lat: parseFloat(place.lat),
                        lon: parseFloat(place.lon),
                        address: place.display_name
                    });
                }
            };
            resultsContainer.appendChild(item);
        });
    }

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!resultsContainer.contains(e.target) && e.target !== inputElement) {
            resultsContainer.style.display = 'none';
        }
    });
}


/**
 * Lógica para mostrar errores de validación en inputs
 **/

export function showInputError(scope, inputId, message) {
    const input = scope.querySelector(`#${inputId}`);
    const errorSpan = scope.querySelector(`#error-${inputId}`);

    if (input && errorSpan) {
        input.classList.add('is-invalid');
        errorSpan.textContent = message;
        errorSpan.classList.add('active');

        // Limpiar error al escribir
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid');
            errorSpan.classList.remove('active');
            errorSpan.textContent = '';
        }, { once: true }); // Usamos once:true para que el event listener se limpie solo
    }
}

// Lógica para limpiar todos los errores de validación de los inputs (útil al hacer submit o reset)
export function clearInputErrors(scope) {
    scope.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    scope.querySelectorAll('.error-text').forEach(el => {
        el.classList.remove('active');
        el.textContent = '';
    });
}