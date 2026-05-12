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
        padding: 20px;
    }
    .admin-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }
    .admin-table th, .admin-table td {
        padding: 12px 15px;
        border-bottom: 1px solid #eee;
    }
    .admin-table th {
        background-color: #f8f9fa;
        font-weight: bold;
    }
    .admin-table tr:hover {
        background-color: #f1f1f1;
    }
    .action-btn {
        padding: 6px 12px;
        cursor: pointer;
        border-radius: 4px;
        border: none;
        margin-right: 5px;
    }
`;