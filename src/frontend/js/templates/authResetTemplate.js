export const authResetHTML = `
    <div id="reset-pss-div" class="pet-auth-section">
        <h3>Establecer nueva contraseña</h3>

        <form id="reset-pss">
            <input type="hidden" id="reset-token">
            
            <label for="new-pass">Nueva contraseña</label>
            <div class="password-container">
                <input type="password" id="new-pass">
                <span class="toggle-pass"><img src="../assets/icons/mdi--eye-outline.svg" alt="Icono mostrar contraseña"></span>
            </div>
            <span class="error-text" id="error-new-pass"></span>            

            <label for="confirm-pass">Confirmar contraseña</label>
            <div class="password-container">
                <input type="password" id="confirm-pass">
                <span class="toggle-pass"><img src="../assets/icons/mdi--eye-outline.svg" alt="Icono mostrar contraseña"></span>
            </div>
            <span class="error-text" id="error-password-confirm-pass"></span>

            <div class="auth-form-buttons"> 
                <button class="button-primary auth-btn" type="submit">ACTUALIZAR CONTRASEÑA</button>
            </div>
        </form>

        <div id="success-div"></div>
    </div>

`;

export const authResetCSS = `
     /* Contenedores */
    .pet-auth-section {
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
        border-radius: var(--radius-md);
        
        padding: 2rem;
    }

    /* Inputs */
    .pet-auth-section form {
        width: 90%;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    /* Botones */
    .auth-form-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
    }

    .auth-button {
        width: 100%;
        max-width: 250px;
        font-size: var(--text-sm);
    }

    /* Otros */

    h3 {
        width: 100%;
        text-align: center;
        padding: 1rem;
        font-size: var(--text-2md);
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
            padding: 0.9rem;
        }
    }    
`;