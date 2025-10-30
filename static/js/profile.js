// Función para cambiar la visibilidad de la contraseña
function togglePasswordVisibility(inputId) {
    var input = document.getElementById(inputId);
    var type = input.type === 'password' ? 'text' : 'password';  // Alterna entre password y text
    input.type = type;
}

function goBack() {
    // Si la página anterior es el registro, redirige a la página principal
    if (document.referrer.includes('/login')) {
        window.location.href = '/';
    } else {
        window.history.back();  // Si no, simplemente vuelve atrás en el historial
    }
}

// SCRIPT MODIFICADO PARA MANEJAR EL MODAL
document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('delete-confirm-modal');
    var openModalBtn = document.getElementById('open-delete-modal');
    var closeButton = document.querySelector('.close-button');

    openModalBtn.onclick = function() {
        modal.style.display = 'flex';
    }

    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});


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