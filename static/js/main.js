/**
 * --------------------------------------------------------------------
 * SELECCIÓN DE ELEMENTOS DEL DOM
 * --------------------------------------------------------------------
 */
const contenedorProductos = document.querySelector("#contenedor-productos");
const contenedorTendencias = document.querySelector("#contenedor-tendencias");
const contenedorUltimos = document.querySelector("#contenedor-ultimos");
const contenedorPop = document.querySelector("#contenedor-pop"); // <-- AÑADIDO
const contenedorRock = document.querySelector("#contenedor-rock");
const filtroGenero = document.querySelector("#filtro-genero");
const seccionTendencias = document.querySelector("#seccion-tendencias");
const seccionUltimos = document.querySelector("#seccion-ultimos");
const seccionPop = document.querySelector("#seccion-pop"); // <-- AÑADIDO
const seccionRock = document.querySelector("#seccion-rock");
const contenedorTrap = document.querySelector("#contenedor-trap");
const seccionTrap = document.querySelector("#seccion-trap");
const filtroWrapper = document.querySelector(".filtro-wrapper");
const filtroBtnCustom = document.querySelector("#filtro-btn-custom");
const filtroListaCustom = document.querySelector("#filtro-lista-custom");
const filtroTextoSeleccion = document.querySelector("#filtro-texto-seleccion");


const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
const numerito = document.querySelector("#numerito");
const searchInput = document.querySelector(".search-input");
const loader = document.getElementById("loader");
const wrapper = document.querySelector(".wrapper");
const openMenu = document.querySelector("#open-menu");
const closeMenu = document.querySelector("#close-menu");
const aside = document.querySelector("aside");

/**
 * --------------------------------------------------------------------
 * ESTADO DE LA APLICACIÓN
 * --------------------------------------------------------------------
 */
let productos = [];
let productosEnCarrito = [];


/**
 * --------------------------------------------------------------------
 * INTERSECTION OBSERVER (Para animaciones al scrollear)
 * --------------------------------------------------------------------
 */

// Opciones para el observador:
// - rootMargin: Empieza a cargar la animación 50px *antes* de que entre en pantalla
// - threshold: Se activa en cuanto un 10% del elemento es visible
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
};

// Creamos el observador
const intersectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // Si el elemento está en la pantalla (intersecting)
        if (entry.isIntersecting) {
            // Añadimos la clase 'producto-visible' para activar la animación CSS
            entry.target.classList.add('producto-visible');
            // Dejamos de observar este elemento, la animación ya se hizo
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

/**
 * Función auxiliar que le dice al observador qué elementos vigilar.
 * La llamaremos cada vez que rendericemos productos.
 */
function observarProductos(contenedor) {
    // Buscamos solo los productos que aún no se han animado
    const productosAObservar = contenedor.querySelectorAll('.producto-animar');
    productosAObservar.forEach(producto => {
        intersectionObserver.observe(producto);
    });
}


/**
 * --------------------------------------------------------------------
 * FUNCIONES PRINCIPALES      
 * --------------------------------------------------------------------
 */

async function cargarDatosProductos() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/productos");
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        productos = await response.json();
        mostrarVistaPrincipal();
        poblarFiltroGeneros(); 
    } catch (error) {
        console.error("No se pudieron cargar los productos:", error);
        contenedorProductos.innerHTML = "<p>Hubo un error al cargar los productos. Intenta de nuevo más tarde.</p>";
    }
}

function mostrarVistaPrincipal() {
    seccionTendencias.style.display = "block";
    seccionUltimos.style.display = "block";
    seccionPop.style.display = "block";
    seccionRock.style.display = "block";
    seccionTrap.style.display = "block"; // <-- AÑADE ESTA LÍNEA
    
    tituloPrincipal.innerHTML = "🔥 LO ÚLTIMO EN TENDENCIAS 🔥";

    const productosTendencia = productos.filter(p => p.status === 'tendencia');
    const productosUltimos = productos.filter(p => p.status === 'ultimos_agregados');
    const productosPop = productos.filter(p => p.status === 'tendencias_pop');
    const productosRock = productos.filter(p => p.status === 'tendencias_rock');
    const productosTrap = productos.filter(p => p.status === 'tendencias_trap'); // <-- AÑADE ESTA LÍNEA

    renderizarProductos(contenedorTendencias, productosTendencia);
    renderizarProductos(contenedorUltimos, productosUltimos);
    renderizarProductos(contenedorPop, productosPop);
    renderizarProductos(contenedorRock, productosRock);
    renderizarProductos(contenedorTrap, productosTrap); // <-- AÑADE ESTA LÍNEA
    renderizarProductos(contenedorProductos, productos);
}

// REEMPLAZA la función poblarFiltroGeneros (línea 94) por esta:
function poblarFiltroGeneros() {
    if (productos.length === 0) return;

    const todosLosGeneros = productos.flatMap(producto => producto.genero);
    const generosUnicos = [...new Set(todosLosGeneros)].sort();

    // Limpiamos la lista custom por si acaso
    filtroListaCustom.innerHTML = ""; 

    // --- NUEVO: Añadir "Todos" a la lista custom ---
    const liTodos = document.createElement("li");
    liTodos.innerText = "Todos los Géneros";
    liTodos.setAttribute("data-value", "todos");
    liTodos.addEventListener("click", manejarClickGeneroCustom);
    filtroListaCustom.append(liTodos);

    // --- Lógica existente (poblar <select>) + Lógica NUEVA (poblar <ul>) ---
    generosUnicos.forEach(genero => {
        if (genero) {
            // Lógica existente (poblar <select> oculto)
            const option = document.createElement("option");
            option.value = genero;
            option.textContent = genero;
            filtroGenero.append(option);

            // Lógica NUEVA (poblar <ul> visible)
            const li = document.createElement("li");
            li.innerText = genero;
            li.setAttribute("data-value", genero);
            li.addEventListener("click", manejarClickGeneroCustom);
            filtroListaCustom.append(li);
        }
    });
}

function renderizarProductos(contenedor, productosAMostrar) {
    contenedor.innerHTML = ""; 

    productosAMostrar.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        
        // --- ¡AÑADIDO! ---
        // Esta es la clase que el observador buscará.
        div.classList.add("producto-animar"); 

        const generosHTML = producto.genero && producto.genero.length > 0
            ? `<h5 class="producto-genero">${producto.genero.join(' / ')}</h5>`
            : '';

        div.innerHTML = `
            <div class="holographic-container">
                <div class="holographic-card">
                    <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}" />
                </div>
            </div>
            <div class="producto-detalles">
                <div class="producto-info">
                    <h3 class="producto-titulo">${producto.titulo}</h3>
                    <h5 class="producto-artista">${producto.artista}</h5>
                    ${generosHTML}
                    <h5 class="producto-categoria-nombre">${producto.categoria.nombre}</h5>
                    <p class="producto-precio">$${producto.precio}</p>
                </div>
                <div class="producto-acciones">
                    <a href="/producto/${producto.id}" class="producto-ver-detalles">MIRAR</a>
                    <button class="producto-agregar" id="${producto.id}"><i class="bi bi-cart"></i></button>
                </div>
            </div>
        `;
        contenedor.append(div);
    });

    // --- ¡AÑADIDO! ---
    // Después de añadir todos los productos al DOM,
    // le decimos al observador que empiece a vigilarlos.
    observarProductos(contenedor);

    actualizarBotonesAgregar();
}

function actualizarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.removeEventListener("click", agregarAlCarrito);
        boton.addEventListener("click", agregarAlCarrito);
    });
}

function cargarCarritoDesdeStorage() {
    const productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
    if (productosEnCarritoLS) {
        productosEnCarrito = JSON.parse(productosEnCarritoLS);
        actualizarNumerito();
    } else {
        productosEnCarrito = [];
    }
}

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    mostrarNotificacion("Producto agregado");
}

function actualizarNumerito() {
    const nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

function mostrarNotificacion(texto) {
    Toastify({
        text: texto,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #52caa4ff, #0e988cff)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".9rem",
            padding: "1rem 3rem 1rem 1.5rem"
        },
        offset: { x: '1.5rem', y: '1.5rem' }
    }).showToast();
}

/**
 * --------------------------------------------------------------------
 * MANEJADORES DE EVENTOS
 * --------------------------------------------------------------------
 */

function manejarClickCategoria(e) {
    const botonId = e.currentTarget.id;

    botonesCategorias.forEach(boton => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");

    if (botonId !== "todos") {
        seccionTendencias.style.display = "none";
        seccionUltimos.style.display = "none";
        seccionPop.style.display = "none"; // <-- AÑADIDO
        seccionRock.style.display = "none";
        seccionTrap.style.display = "none";

        const productoCategoria = productos.find(producto => producto.categoria.id === botonId);
        tituloPrincipal.innerText = productoCategoria.categoria.nombre;
        const productosFiltrados = productos.filter(producto => producto.categoria.id === botonId);
        renderizarProductos(contenedorProductos, productosFiltrados);
    } else {
        mostrarVistaPrincipal();
    }
    window.scrollTo(0, 0);
}


// AÑADE ESTA NUEVA FUNCIÓN (ej. después de manejarBusqueda, línea 253)
function manejarClickGeneroCustom(e) {
    const valorSeleccionado = e.currentTarget.getAttribute("data-value");
    const textoSeleccionado = e.currentTarget.innerText;

    // 1. Actualizar el texto del botón falso
    filtroTextoSeleccion.innerText = textoSeleccionado;

    // 2. Sincronizar el <select> oculto
    filtroGenero.value = valorSeleccionado;

    // 3. ¡¡TRUCO CLAVE: Disparar el evento 'change' manualmente!!
    // Esto hace que la función original 'manejarFiltroGenero' se ejecute
    // sin que tengamos que reescribir su lógica.
    filtroGenero.dispatchEvent(new Event('change'));

    // 4. Cerrar el menú
    filtroListaCustom.classList.remove("active");
    filtroBtnCustom.classList.remove("active");
}


function manejarFiltroGenero(e) {
    const generoSeleccionado = e.currentTarget.value;

    if (generoSeleccionado !== "todos") {
        seccionTendencias.style.display = "none";
        seccionUltimos.style.display = "none";
        seccionPop.style.display = "none"; // <-- AÑADIDO
        seccionRock.style.display = "none";
        seccionTrap.style.display = "none";
        
        const productosFiltrados = productos.filter(producto => 
            producto.genero && producto.genero.includes(generoSeleccionado)
        );
        
        tituloPrincipal.innerText = `Género: ${generoSeleccionado}`;
        renderizarProductos(contenedorProductos, productosFiltrados);
    } else {
        mostrarVistaPrincipal();
    }
    window.scrollTo(0, 0);
}

function manejarBusqueda(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm === "") {
        mostrarVistaPrincipal();
        return;
    }

    seccionTendencias.style.display = "none";
    seccionUltimos.style.display = "none";
    seccionPop.style.display = "none"; // <-- AÑADIDO
    seccionRock.style.display = "none";
    seccionTrap.style.display = "none";

    tituloPrincipal.innerText = `Resultados para "${searchTerm}"`;
    const productosFiltrados = productos.filter(producto => {
        const titulo = producto.titulo.toLowerCase();
        const artista = producto.artista.toLowerCase();
        return titulo.includes(searchTerm) || artista.includes(searchTerm);
    });
    
    renderizarProductos(contenedorProductos, productosFiltrados);
}

function iniciarCarrusel() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const carousel = document.querySelector('.carousel');

    if (!carousel) return;

    let currentIndex = 0;
    let intervalId = null;

    const showSlide = (index) => {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    };

    const startInterval = () => {
        clearInterval(intervalId);
        intervalId = setInterval(() => showSlide(currentIndex + 1), 8000);
    };

    nextBtn.addEventListener('click', () => {
        showSlide(currentIndex + 1);
        startInterval();
    });

    prevBtn.addEventListener('click', () => {
        showSlide(currentIndex - 1);
        startInterval();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startInterval();
        });
    });

    carousel.addEventListener('mouseenter', () => clearInterval(intervalId));
    carousel.addEventListener('mouseleave', startInterval);
    
    showSlide(0);
    startInterval();
}


/**
 * --------------------------------------------------------------------
 * INICIALIZACIÓN (VERSIÓN CORREGIDA)
 * --------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeStorage();
    cargarDatosProductos();
    iniciarCarrusel();

    // --- ¡CORRECCIÓN! ---
    // Eliminamos los listeners antiguos para 'focus', 'blur' y 'change'
    // que controlaban el 'size' del select. Ya no son necesarios.
    
    // Listener para abrir/cerrar el nuevo dropdown
    filtroBtnCustom.addEventListener("click", (e) => {
        e.stopPropagation(); // Evita que el clic se propague al 'document'
        filtroListaCustom.classList.toggle("active");
        filtroBtnCustom.classList.toggle("active");
    });

    // Listener para cerrar el dropdown si se hace clic fuera
    document.addEventListener("click", (e) => {
        // Si el clic NO fue dentro del filtro-wrapper
        if (!filtroWrapper.contains(e.target)) {
            filtroListaCustom.classList.remove("active");
            filtroBtnCustom.classList.remove("active");
        }
    });

    
    // --- ESTOS SON LOS LISTENERS QUE SÍ DEBEN QUEDARSE ---
    botonesCategorias.forEach(boton => boton.addEventListener("click", manejarClickCategoria));
    searchInput.addEventListener("input", manejarBusqueda);
    // Este listener es VITAL. Es el que llama a tu lógica de filtrado.
    filtroGenero.addEventListener("change", manejarFiltroGenero); 

    openMenu.addEventListener("click", () => {
        aside.classList.add("aside-visible");
    });

    closeMenu.addEventListener("click", () => {
        aside.classList.remove("aside-visible");
    });
});

window.addEventListener("load", () => {
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});


// --- Función para mostrar la ventana emergente de contacto ---
function mostrarContacto(event) {
    // Evita que el enlace recargue la página
    event.preventDefault();

    // Selecciona los elementos de la ventana emergente
    const modal = document.getElementById('contacto-modal');
    const closeButton = modal.querySelector('.custom-close-button');
    const copyButton = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text').innerText;

    // Muestra la ventana (usamos 'flex' por el centrado en el CSS)
    modal.style.display = 'flex';

    // Función para cerrar la ventana
    function cerrarModal() {
        modal.style.display = 'none';
        // Reinicia el texto del botón de copiar por si fue usado
        copyButton.innerText = 'Copiar';
    }

    // --- Lógica para cerrar la ventana ---
    // 1. Al hacer clic en la 'X'
    closeButton.onclick = cerrarModal;

    // 2. Al hacer clic fuera de la ventana (en el fondo oscuro)
    window.onclick = function(event) {
        if (event.target == modal) {
            cerrarModal();
        }
    };

    // --- Lógica para el botón de copiar ---
    copyButton.onclick = function() {
        // Usa la API del portapapeles para copiar el texto
        navigator.clipboard.writeText(emailText).then(() => {
            // Da feedback visual al usuario
            copyButton.innerText = '¡Copiado!';
            
            // Vuelve al texto original después de 2 segundos
            setTimeout(() => {
                copyButton.innerText = 'Copiar';
            }, 2000);
        }).catch(err => {
            console.error('Error al copiar el texto: ', err);
            alert('No se pudo copiar. Por favor, selecciona y copia el correo manualmente.');
        });
    };
}


// --- Función para mostrar la ventana emergente del cupón ---
function mostrarCupon(event) {
    // Evita cualquier comportamiento por defecto de la imagen
    event.preventDefault();

    // Selecciona los elementos de la ventana del cupón
    const modal = document.getElementById('cupon-modal');
    const closeButton = modal.querySelector('.custom-close-button');
    const copyButton = document.getElementById('copy-cupon-btn');
    const codigoText = document.getElementById('codigo-cupon').innerText;

    // Muestra la ventana
    modal.style.display = 'flex';

    // Función para cerrar la ventana
    function cerrarModal() {
        modal.style.display = 'none';
        copyButton.innerText = 'Copiar'; // Reinicia el texto del botón
    }

    // --- Lógica para cerrar la ventana ---
    closeButton.onclick = cerrarModal;
    window.onclick = function(event) {
        if (event.target == modal) {
            cerrarModal();
        }
    };

    // --- Lógica para el botón de copiar ---
    copyButton.onclick = function() {
        navigator.clipboard.writeText(codigoText).then(() => {
            copyButton.innerText = '¡Copiado!';
            setTimeout(() => {
                copyButton.innerText = 'Copiar';
            }, 2000);
        }).catch(err => {
            console.error('Error al copiar el código: ', err);
            alert('No se pudo copiar. El código es: ' + codigoText);
        });
    };
}

// --- Función para mostrar la ventana emergente del cupón del footer ---
function mostrarCuponFooter(event) {
    event.preventDefault();

    // Selecciona los elementos de la nueva ventana
    const modal = document.getElementById('cupon-footer-modal');
    const closeButton = modal.querySelector('.custom-close-button');
    const copyButton = document.getElementById('copy-cupon-footer-btn');
    const codigoText = document.getElementById('codigo-cupon-footer').innerText;

    // Muestra la ventana
    modal.style.display = 'flex';

    // Función para cerrar la ventana
    function cerrarModal() {
        modal.style.display = 'none';
        copyButton.innerText = 'Copiar Código'; // Reinicia el texto del botón
    }

    // --- Lógica para cerrar la ventana ---
    closeButton.onclick = cerrarModal;
    window.onclick = function(event) {
        if (event.target == modal) {
            cerrarModal();
        }
    };

    // --- Lógica para el botón de copiar ---
    copyButton.onclick = function() {
        navigator.clipboard.writeText(codigoText).then(() => {
            copyButton.innerText = '¡Copiado!';
            setTimeout(() => {
                copyButton.innerText = 'Copiar Código';
            }, 2000);
        }).catch(err => {
            console.error('Error al copiar el código: ', err);
            alert('No se pudo copiar. El código es: ' + codigoText);
        });
    };
}

// (El código de 'const link' al final de tu archivo original
// parece ser un fragmento de prueba, lo he eliminado 
// para evitar conflictos con tu función 'renderizarProductos'.)