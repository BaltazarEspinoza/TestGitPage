# 🎵 Proyecto Disquería CURISONG

Este proyecto consiste en el desarrollo de una tienda virtual enfocada en la venta de artículos relacionados con álbumes de música, tales como vinilos, cassettes y discos compactos.  
El objetivo es simular una página web moderna y funcional, capaz de competir con otras tiendas especializadas en el mismo rubro, como **Plaza Música**, **Needle** o **MusicLand Chile**.


Esta tienda de artículos físicos de música permite explorar productos por categorías, utilizar filtros de navegación y vitrinear o adquirir productos de nuestro catálogo.

## ✨ Características principales

Permitimos:

🛒 Catálogo dinámico de productos (vinilos, CDs, instrumentos, etc.)  
🔍 Búsqueda y filtrado por categorías  
🎨 Diseño responsive adaptable a dispositivos móviles  
💾 Datos gestionados mediante base de datos SQLite  
⚡ Navegación fluida con animaciones y transiciones suaves
🎵 Integración con la API de Spotify: al visualizar un producto, se muestran todas las canciones del respectivo álbum, si están disponibles en la plataforma.


## 🎨 Diseño visual

### 🖌️ Paleta de colores
| Nombre variable     | Color    | Uso sugerido |
|--------------------|---------|---------------|
| `--clr-main`        | `#3D74B6` | Color principal (botones, encabezados) |
| `--clr-main-light`  | `#ecfbde` | Fondo suave o detalles secundarios |
| `--clr-white`       | `#defbe7` | Texto sobre fondos oscuros |
| `--clr-celeste`     | `#afcfd8` | Elementos decorativos o de contraste |
| `--clr-purple`      | `#320A6B` | Color de acento o secciones destacadas |

---

### 🖋️ Tipografía
- **Fuente principal:** `Rubik`, sans-serif  
- **Estilo:** moderno, legible y con un aire juvenil, ideal para una tienda de música.

---

### 💡 Estilo general
El diseño busca transmitir **energía y modernidad**, combinando tonos fríos (celeste y azul) con detalles contrastantes en púrpura.  
La tipografía uniforme y el uso de espacios limpios dan una **sensación de orden y profesionalismo**.

---

## 🧩 Tecnologías utilizadas

El desarrollo de **Disquería CURISONG** se basa en un stack web clásico y ligero, centrado en la eficiencia, la interactividad y la gestión de datos.

| Tecnología | Descripción |
|-------------|--------------|
| **HTML5** | Estructura principal del sitio y definición del contenido. |
| **CSS3** | Estilos, paleta de colores, diseño responsive y animaciones. |
| **JavaScript (ES6)** | Interactividad, manejo del DOM y funcionalidades dinámicas. |
| **JSON** | Almacenamiento y gestión de datos del catálogo de productos. |
| **SQLite** | Base de datos ligera para el almacenamiento local de información. |
| **Python** | Ejecución del programa, scripts de apoyo, automatización de procesos relacionados con la gestión del proyecto. |
| **Spotify API** | Permite obtener información de álbumes, listar canciones y reproducir previews cuando están disponibles. |

---

Estas tecnologías trabajan en conjunto para ofrecer una **experiencia de usuario fluida, moderna y adaptable**, respaldada por un manejo eficiente de datos en el backend.

---

## 📁 Estructura del proyecto

El proyecto se organiza de forma modular para mantener una separación clara entre los recursos, las plantillas y la documentación.

```plaintext
Proyecto_Disqueria-main
│
├── docs/                      # Documentación y material de apoyo
│   ├── MockupsYWireframes/    # Bocetos y estructura visual
│   ├── requisitos.md          # Requisitos funcionales y técnicos
│   ├── API Externa.md         # Descripción de la API utilizada
│   └── README.md              # Documentación interna del equipo
│
├── statics/                   # Archivos estáticos
│   ├── css/                   # Hojas de estilo
│   ├── img/                   # Imágenes y recursos gráficos
│   └── js/                    # Scripts de JavaScript y archivo JSON
│
├── templates/                 # Páginas HTML del sitio
│   ├── index.html
│   ├── admin.html
│   ├── feedback.html
│   ├── detalle.html
│   ├── carrito.html
│   ├── detalle.html
│   ├── login.html
│   ├── logout.html
│   ├── register.html
│   ├── profile.html
│   └── 404.html
│
├── requirements.txt           # Dependencias del proyecto (Python)
├── .gitignore                 # Archivos y carpetas ignoradas por Git
└── Proyecto_Curisong-html.zip # Archivo comprimido del proyecto completo

```
---
## ⚙️ Instrucciones para visualizar el proyecto

Para ejecutar y probar **Disquería CURISONG** localmente, sigue estos pasos:

1. Clona el repositorio en la carpeta deseada:
```bash
git clone https://github.com/usuario/Proyecto_Disqueria-main.git
```
2. Accede al directorio del proyecto:
```bash
cd Proyecto_Disqueria-main
```
3. Instala las dependencias necesarias detalladas en requirements.txt:
```bash
pip install -r requirements.txt
```
4. Ejecuta el script principal para levantar la aplicación:
```bash
cd backend
python app.py
```
5. Abre tu navegador y visita http://localhost:5000 (o el puerto que indique la aplicación) para visualizar el proyecto.

---


**Proyecto realizado durante el semestre 2025-2 para el módulo Proyecto de Programación**
© 2025 CuriSong
