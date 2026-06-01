import { createTemplate } from "../ui-utils.js";
import { adminTableHTML, adminTableCSS } from "../templates/adminTableTemplate.js";

const template = createTemplate(adminTableHTML, adminTableCSS);

export class AdminTable extends HTMLElement {
    constructor() {
        super();
        this._data = [];
        this._columns = [];
    }

    set config({ columns, data }) {
        this._columns = columns;
        this._data = data;
        this.render();
    }

    render() {
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));

        const thead = this.querySelector('#table-head');
        const tbody = this.querySelector('#table-body');

        // Renderizar cabeceras
        this._columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.label;
            thead.appendChild(th);
        });

        // Renderizar filas
        this._data.forEach(item => {
            const tr = document.createElement('tr');
            
            this._columns.forEach(col => {
                const td = document.createElement('td');
                // Si la columna tiene una función 'render', la usamos (para botones, badges, etc.)
                if (col.render) {
                    td.appendChild(col.render(item));
                } else {
                    td.textContent = item[col.key];
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }
}

customElements.define('admin-table', AdminTable);