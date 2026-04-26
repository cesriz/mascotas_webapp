export const petListHTML = `
    <div class="pet-list">
        <http-cat style="display: none;"></http-cat>

        <div class="grid-container" id="grid"></div>

        <div id="empty-msg" class="empty-state">
            <p>No se encontraron mascotas en esta categoría.</p>
        </div>
    </div>
`;

export const petListCSS = `
    .pet-list{
        display: block;
        width: 100%;
    }
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        padding: 1rem;
    }

    .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
        display: none;
    }
      
`;