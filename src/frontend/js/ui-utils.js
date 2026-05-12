/**
 * ui-utils.js contiene la lógica del sistema de plantillas de componentes
 */


export const createTemplate = (htmlContent, cssContent = '') => {
    const template = document.createElement('template');
    template.innerHTML = `
        <style>${cssContent}</style>
        ${htmlContent}
    `;
    return template;
};