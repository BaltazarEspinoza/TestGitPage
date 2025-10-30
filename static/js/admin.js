document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // =========== LÓGICA EXISTENTE PARA NAVEGACIÓN Y OPINIONES ==========
    // =================================================================
    const botones = document.querySelectorAll('.boton-categoria');
    const seccionUsuarios = document.getElementById('gestion-usuarios');
    const seccionProductos = document.getElementById('gestion-productos');
    const seccionOpiniones = document.getElementById('gestion-opiniones');

    function cargarOpiniones() {
        const resultsBody = document.getElementById('feedback-results-body');
        const noFeedbackMessage = document.getElementById('no-feedback');
        resultsBody.innerHTML = ''; 

        const storedFeedback = JSON.parse(localStorage.getItem('feedbackResults'));

        if (storedFeedback && storedFeedback.length > 0) {
            noFeedbackMessage.style.display = 'none';
            storedFeedback.forEach(feedback => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${feedback.Puntuación || 'N/A'}</td>
                    <td>${feedback.Aspectos_Positivos || 'N/A'}</td>
                    <td>${feedback.Recomendaría || 'N/A'}</td>
                    <td>${feedback['A_mejorar'] || 'N/A'}</td>
                    <td>${feedback.Opinión_Final || 'N/A'}</td>
                `;
                resultsBody.appendChild(row);
            });
        } else {
            noFeedbackMessage.style.display = 'block';
        }
    }

    botones.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            botones.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            seccionUsuarios.style.display = 'none';
            seccionProductos.style.display = 'none';
            seccionOpiniones.style.display = 'none';

            const textoBoton = e.currentTarget.innerText;
            if (textoBoton.includes('Usuarios')) {
                seccionUsuarios.style.display = 'block';
            } else if (textoBoton.includes('Productos')) {
                seccionProductos.style.display = 'block';
            } else if (textoBoton.includes('Opiniones')) {
                seccionOpiniones.style.display = 'block';
                cargarOpiniones();
            }
        });
    });

    // =================================================================
    // ================ NUEVA LÓGICA PARA EL CRUD DE USUARIOS ============
    // =================================================================

    // --- Selectores de elementos del DOM ---
    const userTableBody = document.getElementById('user-table-body');
    const modal = document.getElementById('user-modal');
    const modalTitle = document.getElementById('modal-title');
    const userForm = document.getElementById('user-form');
    const btnAgregarUsuario = document.getElementById('btn-agregar-usuario');
    const closeButton = document.querySelector('.close-button');
    const userIdField = document.getElementById('user-id');
    const userNameField = document.getElementById('user-name');
    const userEmailField = document.getElementById('user-email');
    const userPasswordField = document.getElementById('user-password');
    const userRoleField = document.getElementById('user-role');

    /**
     * [R]EAD: Obtiene los usuarios desde la API y los muestra en la tabla.
     */
    async function fetchUsers() {
        try {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Error al obtener usuarios');
            const users = await response.json();
            
            userTableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
            
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.nombre}</td>
                    <td>${user.email}</td>
                    <td>${user.rol}</td>
                    <td>
                        <button class="btn-editar" data-id="${user.id}" data-name="${user.nombre}" data-email="${user.email}" data-role="${user.rol}"><i class="bi bi-pencil-fill"></i> Editar</button>
                        <button class="btn-eliminar-item" data-id="${user.id}"><i class="bi bi-trash-fill"></i> Eliminar</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
            userTableBody.innerHTML = `<tr><td colspan="5">Error al cargar los datos. Intenta recargar la página.</td></tr>`;
        }
    }
    
    /**
     * Abre el modal para crear o editar un usuario.
     * @param {string} mode - 'create' o 'edit'.
     * @param {object|null} user - Los datos del usuario a editar.
     */
    function openModal(mode, user = null) {
        userForm.reset();
        
        if (mode === 'create') {
            modalTitle.textContent = 'Agregar Nuevo Usuario';
            userIdField.value = '';
            userPasswordField.placeholder = 'Contraseña (obligatoria)';
            userPasswordField.required = true;
        } else if (mode === 'edit' && user) {
            modalTitle.textContent = 'Editar Usuario';
            userIdField.value = user.id;
            userNameField.value = user.name;
            userEmailField.value = user.email;
            userRoleField.value = user.role;
            userPasswordField.placeholder = 'Dejar en blanco para no cambiar';
            userPasswordField.required = false;
        }
        modal.style.display = 'block';
    }

    /**
     * Cierra el modal.
     */
    function closeModal() {
        modal.style.display = 'none';
    }

    // --- Asignación de Eventos ---

    // 1. Abrir modal para crear un usuario nuevo.
    btnAgregarUsuario.addEventListener('click', () => {
        openModal('create');
    });

    // 2. Cerrar el modal con el botón 'x' o haciendo clic fuera.
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // 3. [C]REATE / [U]PDATE: Manejar el envío del formulario.
    userForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = userIdField.value;
        const password = userPasswordField.value;
        
        const userData = {
            name: userNameField.value,
            email: userEmailField.value,
            role: userRoleField.value,
        };

        if (password) {
            userData.password = password;
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/users/${id}` : '/api/users';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'La operación falló');
            }
            
            closeModal();
            fetchUsers();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            alert(`No se pudo guardar el usuario: ${error.message}`);
        }
    });

    // 4. [D]ELETE / Abrir modal de edición (usando delegación de eventos).
    userTableBody.addEventListener('click', async (event) => {
        const target = event.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;
        
        // --- Acción de Editar ---
        if (target.classList.contains('btn-editar')) {
            const userToEdit = {
                id: id,
                name: target.dataset.name,
                email: target.dataset.email,
                role: target.dataset.role,
            };
            openModal('edit', userToEdit);
        }
        
        // --- Acción de Eliminar ---
        if (target.classList.contains('btn-eliminar-item')) {
            if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                try {
                    const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Error al eliminar');
                    fetchUsers();
                } catch (error) {
                    console.error('Error al eliminar:', error);
                    alert('No se pudo eliminar el usuario.');
                }
            }
        }
    });

    // Carga inicial de usuarios al entrar a la página.
    fetchUsers();
});


// =================================================================
// ============== LÓGICA EXISTENTE PARA EL LOADER ==================
// =================================================================
window.addEventListener("load", () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});