import { API } from '../api.js';
import { Auth } from '../auth.js';
import { showSuccess, showHttpError } from "../main.js";
import { createTemplate } from "../ui-utils.js";
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
            this.setReadOnly(profileForm, true);
        });

        // Envío del formulario de perfil (Guardar)
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const updatedData = {
                nombre: this.querySelector('#profile-name').value,
                apellidos: this.querySelector('#profile-surname').value,
                correo: this.querySelector('#profile-email').value,
                telefono: this.querySelector('#profile-phone').value,
                direccion: this.querySelector('#profile-direction').value
            };

            try {
                await API.updatePerfil(updatedData);
                showSuccess("Perfil actualizado correctamente");
                this._userData = { ...this._userData, ...updatedData }; // Actualizamos memoria local
                this.setReadOnly(profileForm, true);
            } catch (error) {
                showHttpError(error);
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
            this.setReadOnly(passwordForm, true);
        });


        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const passData = {
                oldPassword: this.querySelector('#profile-old-pass').value,
                newPassword: this.querySelector('#profile-new-pass').value,
                confirmPassword: this.querySelector('#profile-confirm-pass').value
            };

            if (passData.newPassword !== passData.confirmPassword) {
                alert("Las contraseñas nuevas no coinciden");
                return;
            }

            try {
                await API.updatePassword({
                    current_password: passData.oldPassword,
                    new_password: passData.newPassword
                });

                showSuccess("Contraseña actualizada correctamente");
                passwordForm.reset();
                this.setReadOnly(passwordForm, true);
            } catch (error) {
                showHttpError(error);
            }
        });

        // Sección 3: borrar cuenta
        const btnDelete = this.querySelector('#profile-delete-btn');
        btnDelete.addEventListener('click', async () => {
            const confirmacion = confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.");
            
            if (confirmacion) {
                try {
                    await API.deletePerfil();
                    showSuccess("Cuenta eliminada. Lamentamos verte partir.");
                    Auth.logout(); // Limpiamos sesión
                    setTimeout(() => window.location.href = 'index.html', 2000);
                } catch (error) {
                    showHttpError(error);
                }
            }
        });
    }
}

customElements.define('user-profile', UserProfile);