let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const modalConfirmacion = document.querySelector("#modalConfirmacion");
const cerrarModalBtn = document.querySelector("#cerrarModal");
const btnCancelarVaciar = document.querySelector("#btnCancelarVaciar");
const btnConfirmarVaciar = document.querySelector("#btnConfirmarVaciar");
const modalPago = document.querySelector("#modalPago");
const cerrarModalPago = document.querySelector("#cerrarModalPago");
const btnCancelarPago = document.querySelector("#btnCancelarPago");
const formularioPago = document.querySelector("#formularioPago");



function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
                const div = document.createElement("div");
            div.classList.add("carrito-producto");
            // --- PLANTILLA MODIFICADA (CON INPUT) ---
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                
                <div class="carrito-producto-info">
                    <h3 class="carrito-producto-titulo">${producto.titulo}</h3>
                    <small class="carrito-producto-detalle-math">Precio: $${producto.precio}</small>
                </div>

                <div class="carrito-producto-cantidad">
                    <button class="cantidad-btn btn-restar" data-id="${producto.id}" aria-label="Restar uno">
                        <i class="bi bi-dash-lg"></i>
                    </button>
                    <span class="cantidad-valor" aria-live="polite">${producto.cantidad}</span>
                    <button class="cantidad-btn btn-sumar" data-id="${producto.id}" aria-label="Sumar uno">
                        <i class="bi bi-plus-lg"></i>
                    </button>
                </div>

                <p class="carrito-producto-subtotal">$${producto.precio * producto.cantidad}</p>

                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
            // --- FIN DE PLANTILLA MODIFICADA ---
    
            contenedorCarritoProductos.append(div);

            
        })
    
    actualizarBotonesEliminar();
    actualizarTotal();
    actualizarBotonesCantidad();
	
    } else {
            contenedorCarritoVacio.classList.remove("disabled");
            contenedorCarritoProductos.classList.add("disabled");
            contenedorCarritoAcciones.classList.add("disabled");
            contenedorCarritoComprado.classList.add("disabled");


            contenedorCarritoProductos.innerHTML = ""; 
            actualizarTotal();
            // -------------------------
        }

}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #ff0000ff, #f81f1fff)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".9rem",
          padding: "1rem 3rem 1rem 1.5rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

botonVaciar.addEventListener("click", mostrarModalVaciar);

function mostrarModalVaciar() {
    modalConfirmacion.classList.remove("disabled"); // Muestra el modal
}

function vaciarCarritoConfirmado() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito(); // Recarga la vista para mostrar "Carrito vacío"
    modalConfirmacion.classList.add("disabled"); // Oculta el modal
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarritoConfirmado() {

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
    contenedorCarritoProductos.innerHTML = "";
    actualizarTotal();

}


function comprarCarrito() {
    modalPago.classList.remove("disabled"); // Solo muestra el modal de pago
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

// ===============================================
// Eventos para el Modal de Confirmación
// ===============================================

// Abrir modal al hacer clic en el botón "Vaciar Carrito"
const btnVaciar = document.querySelector("#vaciar-carrito");
if (btnVaciar) {
    btnVaciar.addEventListener("click", mostrarModalVaciar);
}

// --- PEGA ESTO AL FINAL DE carrito.js ---

// Listeners para los botones del nuevo modal
if (cerrarModalBtn) {
    cerrarModalBtn.addEventListener("click", () => modalConfirmacion.classList.add("disabled"));
}
if (btnCancelarVaciar) {
    btnCancelarVaciar.addEventListener("click", () => modalConfirmacion.classList.add("disabled"));
}
if (btnConfirmarVaciar) {
    btnConfirmarVaciar.addEventListener("click", vaciarCarritoConfirmado);
}

/**
 * Añade event listeners a todos los botones de +/- cantidad.
 */
function actualizarBotonesCantidad() {
    const botonesRestar = document.querySelectorAll(".btn-restar");
    const botonesSumar = document.querySelectorAll(".btn-sumar");

    botonesRestar.forEach(boton => {
        boton.addEventListener("click", restarCantidad);
    });

    botonesSumar.forEach(boton => {
        boton.addEventListener("click", sumarCantidad);
    });
}

/**
 * Decrementa la cantidad de un producto.
 */
function restarCantidad(e) {
    const idProducto = e.currentTarget.dataset.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idProducto);

    if (index === -1) return; // No se encontró el producto

    // No permitir bajar de 1
    if (productosEnCarrito[index].cantidad > 1) {
        productosEnCarrito[index].cantidad--;
        actualizarVistaProducto(e.currentTarget, productosEnCarrito[index]);
    }
}

/**
 * Incrementa la cantidad de un producto.
 */
function sumarCantidad(e) {
    const idProducto = e.currentTarget.dataset.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idProducto);

    if (index === -1) return; // No se encontró el producto

    productosEnCarrito[index].cantidad++;
    actualizarVistaProducto(e.currentTarget, productosEnCarrito[index]);
}

/**
 * Helper: Actualiza el DOM y localStorage después de un cambio de cantidad.
 */
function actualizarVistaProducto(boton, producto) {
    // Actualiza el localStorage
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    // Busca los elementos del DOM relativos al botón presionado
    const filaProducto = boton.closest('.carrito-producto');
    const valorCantidad = filaProducto.querySelector('.cantidad-valor');
    const subtotalElement = filaProducto.querySelector('.carrito-producto-subtotal');

    // Actualiza la cantidad y el subtotal en la vista
    valorCantidad.textContent = producto.cantidad;
    subtotalElement.textContent = `$${producto.precio * producto.cantidad}`;

    // Actualiza el total general
    actualizarTotal();
}


// --- Listeners para el Modal de Pago ---
if (cerrarModalPago) {
    cerrarModalPago.addEventListener("click", () => modalPago.classList.add("disabled"));
}

if (btnCancelarPago) {
    btnCancelarPago.addEventListener("click", () => modalPago.classList.add("disabled"));
}

if (formularioPago) {
    // Escuchamos el "submit" del formulario
    formularioPago.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita que la página se recargue
        modalPago.classList.add("disabled"); // Oculta el modal de pago
        comprarCarritoConfirmado(); // Ejecuta la lógica de compra original
    });
}