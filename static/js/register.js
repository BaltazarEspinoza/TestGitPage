// --- Scripts para mensajes flash ---
setTimeout(() => {
    document.querySelectorAll('.alert-custom').forEach(el => {
    el.style.transition = 'opacity 0.5s ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 500);
    });
}, 4000); 

// --- Función para cambiar la visibilidad de la contraseña ---
function togglePasswordVisibility(inputId) {
    var input = document.getElementById(inputId);
    var type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
}

// --- Función para volver atrás ---
function goBack() {
    if (document.referrer.includes('/login')) {
        window.location.href = '/';
    } else {
        window.history.back();
    }
}

// --- Funciones para los términos y condiciones ---
function abrirTerminos() {
// Le decimos al overlay que se muestre como un contenedor flexible
document.getElementById("overlayTerminos").style.display = "flex";
}

function cerrarTerminos() {
document.getElementById("overlayTerminos").style.display = "none";
}

function cerrarTerminos() {
    document.getElementById("overlayTerminos").style.display = "none";
}

/**
 * Oculta el loader con una transición suave cuando la página ha cargado.
 */
window.addEventListener("load", () => {
    if (loader) {
        // Inicia la transición para hacerlo transparente
        loader.style.opacity = '0';
        
        // Espera a que la transición termine (500ms) para ocultarlo del todo
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); 
    }
    // Ya no es necesario mostrar el wrapper, se verá automáticamente
    // cuando el loader desaparezca.
});