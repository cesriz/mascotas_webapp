export const resetPasswordHTML = `
    <div>
        <div class="reset-header-section">
            <h3>Restablecer contraseña</h3>
        </div>
        <div class="reset-body-section">
            <form id="reset-pss">
                <label for="forgot-correo">Nueva contraseña</label>
                <input type="password" id="password">

                <label for="forgot-correo">Repetir contraseña</label>
                <input type="password" id="password-confirm">

                <div class="hidden">
                    <input type="string" id="reset-token">
                </div>

                <div class="reset-form-buttons"> 
                    <button class="button-primary" type="submit">RESTABLECER CONTRASEÑA</button>
                </div>
            </form>
        </div>
    </div>
`;

export const resetPasswordCSS = `
    /* Header */
    .reset-header-section {
        width: min(500px, 90vw);
        height: auto;
        margin: 0 auto;
        display: flex;
        border-radius: var(--radius-md) var(--radius-md) 0 0;
        background-color: var(--backgroundblue);
    }

    .reset-header-section h3 {
        width: 100%;
        text-align: center;
        padding: 1rem;
        font-size: var(--text-2md);
    }

    /* Body */
    .reset-body-section {
        width: min(500px, 90vw); 
        margin: 0 auto;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;

        background-color: var(--backgroundblue);
        border-top: 1px solid var(--secondary);
        border-radius: 0 0 var(--radius-md) var(--radius-md);
        
        padding: 2rem;
    }

    #reset-pss input {
        margin-bottom: 1rem;
    }

    .reset-form-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
    }

    /* --------Tablets y móviles--------- */
    @media (max-width: 768px) {
        button {
            max-width: 100%;
        }
    }

    @media (max-width: 480px) {
        h3 {
            font-size: 0.95rem;
        }

        button {
            padding: 0.5rem;
        }
    }     
`;