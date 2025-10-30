// Función para cambiar la visibilidad de la contraseña
function togglePasswordVisibility(inputId) {
    var input = document.getElementById(inputId);
    var type = input.type === 'password' ? 'text' : 'password';  // Alterna entre password y text
    input.type = type;
}

// Función para manejar el botón "Volver atrás"
function goBack() {
    // Si la página anterior es el registro, redirige a la página principal
    if (document.referrer.includes('/register')) {
        window.location.href = '/';
    
    } 
    
    else {
        window.location.href = '/';
    }

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
