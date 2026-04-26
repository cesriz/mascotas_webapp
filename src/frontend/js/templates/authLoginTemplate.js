export const authLoginHTML = `
    <div id="success-div"></div>
    <div id="http-cat"></div>
    <div id="login-div">
        <div class="auth-buttons-section">
            <div class="init-btn-div"><button id="init-btn">Iniciar sesión</button></div>
            <div class="register-btn-div"><button id="register-btn">Registrarse</button></div>
        </div>

        <div class="pet-auth-section" id="init-div">
            <form id="init">
                <label for="auth-correo">Email</label>
                <input type="text" id="auth-correo">

                <label for="auth-pass">Contraseña</label>
                <input type="password" id="auth-pass">

                <div class="auth-form-buttons">
                    <button class="button-primary auth-btn" type="submit">ENTRAR</button>
                </div>
            </form>
        </div>

        <div class="pet-auth-section" id="register-div">
            <form id="register">
                <label for="register-name">Nombre</label>
                <input type="text" id="register-name" required>

                <label for="register-surname">Apellidos</label>
                <input type="text" id="register-surname">

                <label for="register-direction">Dirección</label>
                <input type="text" id="register-direction">

                <label for="register-phone">Teléfono</label>
                <input type="text" id="register-phone">

                <label for="register-correo">Email</label>
                <input type="text" id="register-correo" required>

                <label for="register-pass">Contraseña</label>
                <input type="password" id="register-pass" required>

                <div class="auth-form-buttons">
                    <button class="button-primary auth-btn" type="submit">REGISTRARME</button>
                </div>
            </form>
        </div>
    </div>

    <div class = "changer-div"> <button id="changer">¿Has olvidado tu contraseña?</button> </div>

    <div id="forgot-pss-div">
        <div class="auth-buttons-section">
            <h3>¿Has olvidado tu contraseña?</h3>
        </div>
        <div class="pet-auth-section">
            <p>Introduce tu email y te enviarmos una nueva</p>
            <form id="forgot-pss">
                <label for="forgot-correo">Email</label>
                <input type="text" id="forgot-correo">

                <label for="forgot-pass">Contraseña</label>
                <input type="text" id="forgot-pass">

                <div class="auth-form-buttons">
                    <button class="button-primary auth-btn" type="submit">ENVIAR CONTRASEÑA NUEVA</button>
                </div>
            </form>
        </div>
    </div>
`;

export const authLoginCSS = `
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
        border-radius: 0 0 var(--radius-md) var(--radius-md);
        
        padding: 2rem;
    }

    #forgot-pss-div {
        margin-top: 30px;
    }

    /* Inputs */
    .pet-auth-section form {
        width: 90%;
        display: flex;
        flex-direction: column;
        gap: 10px; 
    }

    /* Botones */

    .auth-buttons-section {
        width: min(500px, 90vw);
        height: auto;
        margin: 0 auto;
        display: flex;
        border-radius: var(--radius-md) var(--radius-md) 0 0;
        background-color: var(--backgroundblue);
    }

    .auth-buttons-section button {
        width: 100%;
        height: 100%;
        margin: 0;
        border: none;
        padding: 1.5rem;
        background-color: inherit;
        font-weight: 600;
        text-align: center;
        cursor: pointer;
    }

    .init-btn-div {
        width: 50%;
        height: 100%;
        border-radius: var(--radius-md) 0 0 0;
    }

    .register-btn-div {
        width: 50%;
        height: 100%;
        border-radius: 0 var(--radius-md) 0 0;
    }


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

    .changer-div {
        width: 100%;
        height: fit-content;
        display:flex;
        justify-content: center;
        margin-top: 20px;
    }

    #changer {
        border: none;
        width: fit-content;
    }

    #changer:hover {
        color: var(--primary);
        font-weight: bold;

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