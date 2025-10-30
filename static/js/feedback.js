const form = document.getElementById('feedbackForm');
const formContainer = document.getElementById('form-container');
const graciasMensaje = document.getElementById('gracias-mensaje');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que el formulario se envíe y la página se recargue

    // 1. Convertir los datos del formulario a un objeto
    const formData = new FormData(form);
    const feedbackEntry = {};
    formData.forEach((value, key) => {
        // Limpiamos un poco el nombre de la clave para que sea más fácil de usar
        const cleanKey = key.replace(/\s+/g, '_'); // Reemplaza espacios con guiones bajos
        feedbackEntry[cleanKey] = value;
    });
    
    // 2. Obtener los resultados que ya están guardados
    // Si no hay nada, crea un arreglo vacío
    const existingFeedback = JSON.parse(localStorage.getItem('feedbackResults')) || [];

    // 3. Agregar la nueva opinión al arreglo
    existingFeedback.push(feedbackEntry);

    // 4. Guardar el arreglo actualizado en localStorage
    localStorage.setItem('feedbackResults', JSON.stringify(existingFeedback));

    // 5. Ocultar el formulario y mostrar el mensaje de agradecimiento
    formContainer.style.display = 'none';
    graciasMensaje.style.display = 'block';

    // Opcional: Limpiar el formulario para un nuevo envío
    form.reset(); 
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