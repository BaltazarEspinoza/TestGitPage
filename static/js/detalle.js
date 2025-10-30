/**
 * --------------------------------------------------------------------
 * SCRIPT PARA LA PÁGINA DE DETALLE DEL PRODUCTO
 * --------------------------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- SELECCIÓN DE ELEMENTOS ---
    const mainContainer = document.querySelector(".main-detalle");
    if (!mainContainer) return; // Si no estamos en la página de detalle, no hacer nada

    const btnDisminuir = document.querySelector('.btn-cantidad[aria-label="Disminuir cantidad"]');
    const btnAumentar = document.querySelector('.btn-cantidad[aria-label="Aumentar cantidad"]');
    const inputCantidad = document.querySelector('.input-cantidad');
    const btnAgregarCarrito = document.querySelector('.btn-agregar-carrito');
    const numerito = document.querySelector("#numerito"); // Asume que el header está en la página

    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    // --- LÓGICA DEL CONTROL DE CANTIDAD ---

    btnAumentar.addEventListener("click", () => {
        let cantidadActual = parseInt(inputCantidad.value);
        inputCantidad.value = cantidadActual + 1;
    });

    btnDisminuir.addEventListener("click", () => {
        let cantidadActual = parseInt(inputCantidad.value);
        // Evita que la cantidad sea menor a 1
        if (cantidadActual > 1) {
            inputCantidad.value = cantidadActual - 1;
        }
    });

    // --- LÓGICA PARA AGREGAR AL CARRITO ---

    btnAgregarCarrito.addEventListener("click", () => {
        const cantidadAAgregar = parseInt(inputCantidad.value);
        
        // Extraemos los datos del producto directamente del HTML
        const producto = {
            id: mainContainer.dataset.id,
            titulo: mainContainer.dataset.titulo,
            precio: parseFloat(mainContainer.dataset.precio),
            imagen: mainContainer.dataset.imagen
        };

        agregarAlCarrito(producto, cantidadAAgregar);
    });

    function agregarAlCarrito(productoAgregado, cantidad) {
        // Buscamos si el producto ya existe en el carrito
        const productoExistente = productosEnCarrito.find(p => p.id === productoAgregado.id);

        if (productoExistente) {
            // Si existe, solo actualizamos la cantidad
            productoExistente.cantidad += cantidad;
        } else {
            // Si no existe, lo agregamos con la cantidad seleccionada
            productoAgregado.cantidad = cantidad;
            productosEnCarrito.push(productoAgregado);
        }

        guardarCarritoYActualizar();
        mostrarNotificacion(`Se agregaron ${cantidad} "${productoAgregado.titulo}" al carrito`);
    }

    function guardarCarritoYActualizar() {
        // Guardar en LocalStorage
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        // Actualizar el contador del carrito en el header
        actualizarNumerito();
    }

    function actualizarNumerito() {
        if (numerito) {
            const nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
            numerito.innerText = nuevoNumerito;
        }
    }
    
    // --- FUNCIÓN DE NOTIFICACIÓN (TOASTIFY) ---
    // Asegúrate de tener Toastify JS incluido en esta página
    function mostrarNotificacion(texto) {
        Toastify({
            text: texto,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #0056b3, #3D74B6)",
                borderRadius: "2rem",
                textTransform: "uppercase",
                fontSize: ".75rem"
            },
            offset: { x: '1.5rem', y: '1.5rem' }
        }).showToast();
    }
});

// --- LÓGICA DEL LOADER DE PÁGINA ---
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});