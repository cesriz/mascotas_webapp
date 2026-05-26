export const userProfileHTML = `
    <div id="success-div"></div>
    <http-cat style="display: none;"></http-cat>
    <user-delete-confirm id="delete-confirm"></user-delete-confirm>
    
    <form class="profile-section" id="profile-data-form">
        <div class="profile-data-title">
            <img src="../assets/icons/mdi--user-outline.svg">
            <h3>Datos personales</h3>
        </div>

        <div class="profile-data-inputs personal">
            <div>            
                <label for="profile-name">Nombre</label>
                <input type="text" id="profile-name">
                <span class="error-text" id="error-profile-name"></span>
            </div>

            <div>            
                <label for="profile-surname">Apellidos</label>
                <input type="text" id="profile-surname">
                <span class="error-text" id="error-profile-apellidos"></span>
            </div>

            <div>            
                <label for="profile-email">Email</label>
                <input type="text" id="profile-email">
                <span class="error-text" id="error-profile-email"></span>
            </div>

            <div>
                <label for="profile-phone">Teléfono</label>
                <input type="text" id="profile-phone">
                <span class="error-text" id="error-profile-phone"></span>
            </div>

            <div>            
                <label for="profile-direction">Dirección</label>
                <input type="text" id="profile-direction">
                <span class="error-text" id="error-profile-direction"></span>
            </div>

            <div>           
                <label for="profile-register-date">Fecha de registro</label>
                <input type="date" id="profile-register-date" readonly disabled>
            </div>
        </div>

        <div class="profile-data-buttons">
            <button type="button" class="button-primary" id="profile-data-btn-updt">Modificar datos</button>
            <button type="reset" class="button-secondary" id="profile-data-btn-reset">Cancelar</button>
            <button type="submit" class="button-primary" id="profile-data-btn-save">Guardar</button> 
        </div>
    </form>

    <form class="profile-section" id="profile-security-form">
        <div class="profile-data-title">
            <img src="../assets/icons/mdi--secure-outline.svg">
            <h3>Seguridad</h3>
        </div>

        <div class="profile-data-inputs">
            <div>            
                <label for="profile-pass">Contraseña actual</label>
                <input type="password" id="profile-old-pass">
                <span class="error-text" id="error-profile-old-pass"></span>
            </div>

            <div>            
                <label for="profile-newpass">Nueva contraseña</label>
                <input type="password" id="profile-new-pass">
                <span class="error-text" id="error-profile-new-pass"></span>
            </div>

            <div>            
                <label for="profile-repeat-pass">Repite la contraseña</label>
                <input type="password" id="profile-confirm-pass">
                <span class="error-text" id="error-profile-confirm-pass"></span>
            </div>
        </div>

        <div class="profile-data-buttons">
            <button type="button" class="button-primary" id="profile-security-btn-updt">Modificar contraseña</button>
            <button type="reset" class="button-secondary" id="profile-security-btn-reset">Cancelar</button>
            <button type="submit" class="button-primary" id="profile-security-btn-save">Guardar contraseña</button> 
        </div>
    </form>



    <div class="profile-section" id="profile-delete">
        <div class="profile-data-title">
            <img src="../assets/icons/iconamoon--trash.svg" alt="Icono papelera">
            <h3>Eliminar cuenta</h3>
        </div>
        <p>Perderás todos tus anuncios publicados, mensajes y fotos de mascotas de forma permanente</p>
        <button class="button-danger" id="profile-delete-btn">Eliminar cuenta</button>
    </div>
`;

export const userProfileCSS = `
   /* Contenedores */
    .profile-section {
        background-color: var(--backgroundblue);
        border: 2px solid var(--primary);
        border-radius: var(--radius-md);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 50%;
        align-self: center;
        justify-self: center;
        margin-bottom: 1.5rem;

    }

    /* Títulos */
    .profile-data-title {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--text-lg);
        gap: 5px;
        margin-bottom: 10px;
        transform: translate(-10px,0);
    }

    .profile-data-title img {
        width: 24px;
        height: 24px;
    }

    /* Inputs */
    .profile-data-inputs {
        display: flex;
        flex-direction: column; 
        width: 100%;
        gap: 10px;
    }

    input, textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--inputbackground);
        border-radius: var(--radius-sm);
        font-family: inherit;
    }

    textarea {
        min-height: 100px;
        resize: vertical;
    }

    /* Botones */
    .profile-data-buttons {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        margin-bottom: 10px;
        flex-shrink: 0;
        gap: 10px;
    }

    .profile-data-buttons button {
        flex: 1;
        max-width: 250px;
        padding: 10px;
    }

    p {
      font-weight: 500;
    }


    /* --------Tablets y móviles--------- */

    @media (min-width: 1024px) {
        .personal {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px 30px;
        }
    }

    @media (max-width: 768px) {
        .profile-data {
            padding: 1.5rem;
            width: min(900px, 95vw);
        }

        .profile-section {
            padding: 1.5rem;
        }

        .profile-data-inputs {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .profile-data-buttons {
            flex-direction: column;
            gap: 10px;
        }

        .profile-data-buttons button {
            width: 100%;
            max-width: none;
        }

        .profile-data-title {
            font-size: var(--text-md);
            transform: none;
            text-align: center;
        }
    }
    
    @media (max-width: 480px) {
        .profile-section {
            padding: 1rem;
            border-width: 1px;
        }
        input, textarea {
            padding: 8px;
            font-size: 0.95rem;
        }

        .profile-data-title {
            font-size: var(--text-sm);
            gap: 8px;
        }

        .profile-data-title img {
            width: 20px;
            height: 20px;
        }
        .profile-data-buttons button {
            padding: 12px;
            font-size: 0.95rem;
        }

        textarea {
            min-height: 80px;
        }
    }        
`;