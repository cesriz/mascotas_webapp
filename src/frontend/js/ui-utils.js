// Función para utilizar plantillas dentro de los componentes
export const createTemplate = (htmlContent, cssContent = '') => {
    const template = document.createElement('template');
    template.innerHTML = `
        <style>${cssContent}</style>
        ${htmlContent}
    `;
    return template;
};