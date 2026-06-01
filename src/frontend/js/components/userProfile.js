import { API } from '../api.js';
import { Auth } from '../auth.js';

import { showSuccess, showHttpError } from "../main.js";
import { userDeleteConfirm } from './userDeleteConfirm.js';
import { showInputError, clearInputErrors, createTemplate, initPasswordToggles } from "../ui-utils.js";
import { userProfileHTML, userProfileCSS } from "../templates/userProfileTemplate.js";

// Creamos la plantilla a partir del HTML y CSS importados
const template = createTemplate(userProfileHTML, userProfileCSS);

export class UserProfile extends HTMLElement {
    constructor() {
        super();
        this._userData = null;
    }

    connectedCallback() {
        this.render();
        this.initLogic();
        this.loadUserData();

        const profileForm = this.querySelector('#profile-data-form');
        this.setReadOnly(profileForm, true);

        const passwordForm = this.querySelector('#profile-security-form');
        this.setReadOnly(passwordForm, true);
    }

    render() {
        this.innerHTML = template.innerHTML;
        // Mostrar y ocultar contraseña en el input (ui-utils)
        initPasswordToggles(this);
    }

    /**
     * Carga los datos del usuario desde la API y rellena los inputs
     */
    async loadUserData() {
        try {
            const data = await API.getPerfil();
            this._userData = data;
            this.fillForm(data);

            const profileForm = this.querySelector('#profile-data-form');
            const passwordForm = this.querySelector('#profile-security-form');
            this.setReadOnly(profileForm, true);
            this.setReadOnly(passwordForm, true);
        } catch (error) {
            showHttpError(error);
        }
    }

    /**
     * Rellena los campos del formulario con la información del usuario
     */
    fillForm(user) {
        this.querySelector('#profile-name').value = user.nombre || '';
        this.querySelector('#profile-surname').value = user.apellidos || '';
        this.querySelector('#profile-email').value = user.correo || '';
        this.querySelector('#profile-phone').value = user.telefono || '';
        this.querySelector('#profile-direction').value = user.direccion || '';
        
        // Formatear fecha de registro
        if (user.fecha_registro) {
            const date = new Date(user.fecha_registro).toISOString().split('T')[0];
            this.querySelector('#profile-register-date').value = date;
        }
    }

    /**
     * Alterna el estado de solo lectura de los inputs y la visibilidad de botones
     * El método es reutilizable.
     */
    setReadOnly(form, isReadOnly) {
        const inputs = form.querySelectorAll('input:not(#profile-register-date)');
        inputs.forEach(input => {
            input.readOnly = isReadOnly;
        });

        // Gestionamos la visibilidad de los botones en el formulario de datos
        if (form.id === 'profile-data-form') {
            const btnEdit = this.querySelector('#profile-data-btn-updt');
            const btnSave = this.querySelector('#profile-data-btn-save');
            const btnReset = this.querySelector('#profile-data-btn-reset');

            if (isReadOnly) {
                btnEdit.style.display = 'block';
                btnSave.style.display = 'none';
                btnReset.style.display = 'none';
            } else {
                btnEdit.style.display = 'none';
                btnSave.style.display = 'block';
                btnReset.style.display = 'block';
            }
        }

        if (form.id === 'profile-security-form') {
            const passBtnEdit = this.querySelector('#profile-security-btn-updt');
            const passBtnSave = this.querySelector('#profile-security-btn-save');
            const passBtnReset = this.querySelector('#profile-security-btn-reset');

            if (isReadOnly) {
                passBtnEdit.style.display = 'block';
                passBtnSave.style.display = 'none';
                passBtnReset.style.display = 'none';
            } else {
                passBtnEdit.style.display = 'none';
                passBtnSave.style.display = 'block';
                passBtnReset.style.display = 'block';
            }
        }
    }

    initLogic() {
        // Sección 1: Datos personales
        const profileForm = this.querySelector('#profile-data-form');
        const btnEdit = this.querySelector('#profile-data-btn-updt');
        const btnReset = this.querySelector('#profile-data-btn-reset');

        // Al pulsar "Modificar datos"
        btnEdit.addEventListener('click', (e) => {
            e.preventDefault();
            this.setReadOnly(profileForm, false);
        });

        // Al pulsar "Reset" (Cancelar)
        btnReset.addEventListener('click', (e) => {
            e.preventDefault();
            this.fillForm(this._userData); // Restauramos datos originales
            clearInputErrors(this);
            this.setReadOnly(profileForm, true);
            const httpCat = this.querySelector('http-cat');
            if (httpCat) httpCat.style.display = 'none';
        });

        // Envío del formulario de perfil (Guardar)
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Limpiamos posibles errores
            const httpCat = this.querySelector('http-cat');
            if (httpCat) httpCat.style.display = 'none';
            clearInputErrors(this);

            // Validamos datos
            clearInputErrors(this);
            let isValid = true;

            const name = this.querySelector('#profile-name').value.trim();
            const email = this.querySelector('#profile-email').value.trim();
            const phone = this.querySelector('#profile-phone').value.trim();

            if (!name) {
                showInputError(this, 'profile-name', 'El nombre es obligatorio');
                isValid = false;
            }

            if (!email) {
                showInputError(this, 'profile-email', 'El correo es obligatorio');
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showInputError(this, 'profile-email', 'El formato del correo no es válido');
                isValid = false;
            }

            if (phone && !/^\+?[0-9\s\-]{9,15}$/.test(phone)) {
                showInputError(this, 'profile-phone', 'Formato de teléfono no válido');
                isValid = false;
            }   
            
            if (!isValid) return;

            const updatedData = {
                nombre: name,
                apellidos: this.querySelector('#profile-surname').value,
                correo: email,
                telefono: phone,
                direccion: this.querySelector('#profile-direction').value
            };

            try {
                await API.updatePerfil(updatedData);
                showSuccess("Perfil actualizado correctamente");
                this._userData = { ...this._userData, ...updatedData }; // Actualizamos memoria local
                this.setReadOnly(profileForm, true);

            } catch (error) {
                showHttpError(error, this);
                this.scrollTop = 0;
            }
        });

        // Sección 2: Seguridad
        const passwordForm = this.querySelector('#profile-security-form');
        const btnEditPss = this.querySelector('#profile-security-btn-updt');
        const btnResetPss = this.querySelector('#profile-security-btn-reset');

        // Al pulsar "Modificar contraseña"
        btnEditPss.addEventListener('click', (e) => {
            e.preventDefault();
            this.setReadOnly(passwordForm, false);
        });

        // Al pulsar "Reset" (Limpiar)
        btnResetPss.addEventListener('click', (e) => {
            e.preventDefault();
            this.fillForm(this._userData); // Restauramos datos originales
            clearInputErrors(this);
            this.setReadOnly(passwordForm, true);
            const httpCat = this.querySelector('http-cat');
            if (httpCat) httpCat.style.display = 'none';
        });


        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Limpiamos posibles errores
            const httpCat = this.querySelector('http-cat');
            if (httpCat) httpCat.style.display = 'none';
            clearInputErrors(this);

            // Seleccionamos inputs
            const currentPass = this.querySelector('#profile-old-pass').value;
            const newPass = this.querySelector('#profile-new-pass').value;
            const confirmPass = this.querySelector('#profile-confirm-pass').value;
            
            let hasError = false;

            // Validaciones
            if (!currentPass) {
                showInputError(this, 'profile-old-pass', 'La contraseña actual es obligatoria');                
                hasError = true;
            }

            if (!newPass) {
                showInputError(this, 'profile-new-pass', 'La nueva contraseña es obligatoria');                
                hasError = true;
            } else if (newPass.length < 6) {
                showInputError(this, 'profile-new-pass', 'Debe tener al menos 6 caracteres');                
                hasError = true;
            }

            if (!confirmPass) {
                showInputError(this, 'profile-confirm-pass', 'Debes confirmar la contraseña');                
                hasError = true;
            } else if (newPass !== confirmPass) {
                showInputError(this, 'profile-confirm-pass', 'Las contraseñas no coinciden');                
                hasError = true;
            }

            if (currentPass && newPass && currentPass === newPass) {
                showInputError(this, 'profile-new-pass', 'La nueva contraseña no puede ser igual a la anterior');                
                hasError = true;
            }

            if (hasError) return;

            // Guardamos datos
            const passData = {
                current_password: currentPass,
                new_password: newPass,
                new_password_confirm: confirmPass
            };

            try {
                await API.updatePassword(passData);

                showSuccess("Contraseña actualizada correctamente");
                passwordForm.reset();
                this.setReadOnly(passwordForm, true);

            } catch (error) {
                showHttpError(error, this);
                this.scrollTop = 0;
            }
        });

        // Sección 3: borrar cuenta
        const btnDelete = this.querySelector('#profile-delete-btn');
        btnDelete.onclick = async (e) => {
            e.stopPropagation();

            const confirmPanel = this.querySelector('#delete-confirm');

            if (confirmPanel) {
                confirmPanel.open();
            }

        };
    }
}

customElements.define('user-profile', UserProfile);