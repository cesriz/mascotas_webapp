const template = document.createElement('template');
template.innerHTML = `
    <style>
        .http-cat { 
            display: block; 
            text-align: center;
            width: 100%;
        }

        img {
            width: 100%;
            max-width: 450px;
            border-radius: var(--radius-xs);
            object-fit: contain;
            height: auto;
        }

        .error-msg {
            margin-top: 1.5rem;
            font-size: var(--text-md);
            color: black;
            font-weight: bold;
        }

        /* -------- Tablet y móvil -------- */
        @media (max-width: 768px) {
            img {
                max-width: 350px;
            }

            .error-msg {
                font-size: var(--text-sm);
            }
        }

        @media (max-width: 480px) {
            .http-cat {
                padding: 5px;
            }

            img {
                max-width: 280px;
            }

            .error-msg {
                font-size: var(--text-xs);
                margin-top: 1rem;
            }
    </style>

    <div class="http-cat">
        <img id="cat-img">
        <div id="messages"></div>
    </div>
`;

export class HttpCat extends HTMLElement {
    // Función que sirve para que el navegador actualice el código si este cambia.
    static get observedAttributes() { 
        return ['code', 'message', 'errors']; 
    }

    attributeChangedCallback() { 
        this.render(); 
    }

    connectedCallback() { 
        this.render(); 
    }

    render() {
        this.innerHTML = ''; 
        this.appendChild(template.content.cloneNode(true));
        
        const code = this.getAttribute('code') || '500';
        const message = this.getAttribute('message');
        const errors = this.getAttribute('errors');

        const img = this.querySelector('#cat-img');
        const messagesContainer = this.querySelector('#messages');

        img.src = `https://http.cat/${code}`;

        let html = '';

        if (message) {
            html += `<p class="error-msg">${message}</p>`;
        }

        if (errors) {
            const parsed = JSON.parse(errors);
            parsed.forEach(err => {
                html += `<p class="error-msg">${err}</p>`;
            });
            }

            messagesContainer.innerHTML = html;
    }
}
customElements.define('http-cat', HttpCat);