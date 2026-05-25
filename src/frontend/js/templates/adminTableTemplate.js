export const adminTableHTML = `
    <div class="admin-table-container">
        <table class="admin-table">
            <thead>
                <tr id="table-head">
                    </tr>
            </thead>
            <tbody id="table-body">
                </tbody>
        </table>
    </div>
`;

export const adminTableCSS = `
    .admin-table-container {
        overflow-x: auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        padding: 1rem;
        margin: 2rem;
    }
    .admin-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
        table-layout: auto;
    }
    .admin-table th, .admin-table td {
        padding: 1rem;
        border-bottom: 1px solid #eee;
    }
    .admin-table th {
        background-color: #f8f9fa;
        font-weight: bold;
    }
    .admin-table tr:hover {
        background-color: var(--backgroundblue);
    }
    .action-btn {
        padding: 6px 12px;
        cursor: pointer;
        border-radius: var(--radius-md);
        border: none;
        margin-right: 5px;
    }

    .action-btn:hover {
        background-color: var(--primary);
        color: white;
    }

    .admin-actions-cell {
        display: flex;
        flex-direction: column;   
        gap: 5px;
    } 
        
    .admin-textarea {
        font-size: var(--text-sm);
        min-width: 120px;
        min-height: 50px;
    }

    /* --------Tablets y móviles--------- */
    @media (max-width: 768px) {
        .admin-table-container {
            margin: 0.5rem;
            padding: 0.5rem;
            border: none;
            box-shadow: none;
            background: transparent;
        }

        /* Escondemos el encabezado original de la tabla */
        .admin-table thead {
            display: none;
        }

        /* Convertimos cada fila en una tarjeta (card) */
        .admin-table tr {
            display: block;
            background: white;
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            border: 1px solid #eee;
        }

        /* Convertimos cada celda en una línea con título */
        .admin-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-align: right;
            padding: 0.75rem 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 14px;
        }

        .admin-table td:last-child {
            border-bottom: none;
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }

        .admin-table td::before {
            content: attr(data-label);
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11px;
            color: #666;
            flex: 1;
            text-align: left;
        }

        .admin-actions-cell {
            margin-top: 10px;
            width: 100%;
        }

        .action-btn {
            width: 100%;
            padding: 12px;
            margin-bottom: 5px;
        }
    }
`;