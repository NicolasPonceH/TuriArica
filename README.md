# TuriArica V2 🌸 - Plataforma Turística Inteligente de Arica

Bienvenido a **TuriArica V2**, la plataforma web y aplicación móvil progresiva (PWA) de turismo interactivo para la ciudad de Arica, Chile ("La Ciudad de la Eterna Primavera").

---

## 🌟 Características Principales

### 🗺️ Experiencia para Turistas y Visitantes
* **Mapa Interactivo 3D (MapLibre GL)**: Motor WebGL a 60 FPS con perspectiva 3D, edificios, trazado de rutas en tiempo real con GraphHopper y paradas de locomoción colectiva.
* **15+ Categorías Turísticas**: Playas, Museos, Monumentos Históricos, Gastronomía, Naturaleza, Miradores, Farmacias, Botillerías y Servicios 24h.
* **Turi-Asistente Inteligente**: Chatbot turístico con contexto de la base de datos de Arica.
* **Notificaciones & Popups Emergentes**: Alertas en vivo para eventos magnos (ej. *Carnaval Andino con la Fuerza del Sol*) y avisos preventivos de oleaje en playas.
* **Widget Costero en Vivo**: Monitoreo de mareas, condiciones para surf (*El Gringo*, *Las Machas*) y estado de banderas en playas aptas para el baño (*El Laucho*, *Chinchorro*).
* **Smart Itinerary Planner**: Generador de itinerarios turísticos a medida por día y estilo de viaje.
* **Ruta Gastronómica Autóctona**: Especialidades culinarias de los Valles de Azapa, Lluta y Caleta Arica.
* **Accesibilidad Universal (A11y)**: Text-to-Speech nativo, audios oficiales en MP3, modo alto contraste y tamaños de fuente adaptables.
* **Instalable como App Móvil (PWA)**: Compatible con Android, iOS y Desktop con funcionamiento offline.

---

### 🛡️ Panel de Administración y Backoffice
* **Credenciales Seguras**: Cuentas activas en SQLite con hash `bcrypt` y tokens `JWT` de 7 días.
  - **Administrador Jorell** (`jorell` / `turiarica2026`)
  - **Administrador Nicolás** (`nicolas` / `turiarica2026`)
* **Dashboard Ejecutivo**: Métricas en tiempo real de lugares registrados, categorías, avisos activos y estadísticas de optimización.
* **Gestor de Contenido Multimedia**:
  - Subida de fotos con conversión y compresión automática al formato moderno **WebP** y miniaturas vía `sharp` (**~92% de ahorro en peso**).
  - Subida de videos con streaming por rangos HTTP 206 (reproducción fluida en móviles).
* **Gestor de Eventos & Avisos**: Creación y activación de notificaciones emergentes (popups) y avisos temporales para turistas.
* **Base de Datos Persistente**: Motor relacional **SQLite 3** (`server/database/turiarica.db`) con seeds iniciales automáticos.
* **Preparación para IA**: Endpoints `/api/ai/context`, `/api/ai/ask` y `/api/ai/dataset` para alimentar modelos LLM con conocimiento turístico de Arica.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, TailwindCSS v4, MapLibre GL, Framer Motion, Lucide Icons, Vite PWA |
| **Backend** | Node.js (v22+), Express, SQLite 3 (DatabaseSync nativo), JWT, Bcryptjs |
| **Multimedia** | Sharp (WebP conversion & thumbnailing), Multer, HTML5 Video Streaming |
| **APIs Externas** | GraphHopper (Routing en vivo), OpenStreetMap, Web Speech API |

---

## 🚀 Ejecución en Entorno Local

Para correr la plataforma completa en tu máquina:

### 1. Iniciar el Backend (API, Base de Datos SQLite y Uploads)
En una terminal:
```bash
npm run server
```
*O con recarga en vivo:*
```bash
npm run server:dev
```
La API quedará escuchando en `http://localhost:5000/api`

### 2. Iniciar el Frontend (Web Turística)
En otra terminal:
```bash
npm run dev
```
La web quedará disponible en `http://localhost:5173`

---

## 🔐 Acceso al Panel de Administración

1. Abre en tu navegador: [http://localhost:5173/#/admin](http://localhost:5173/#/admin) (o haz clic en el ícono de llave en el pie de página).
2. Selecciona el usuario (**Jorell** o **Nicolás**).
3. Ingresa la contraseña: `turiarica2026`.

---

## 🌿 Estructura de Ramas Git para el Equipo

El repositorio cuenta con ramas organizadas para el trabajo de 2 personas:

- `main`: Rama de integración con la plataforma completa.
- `frontend`: Rama dedicada al cliente React, componentes visuales y PWA (`src/`).
- `backend`: Rama dedicada al servidor Express, base de datos y optimizador multimedia (`server/`).

### Flujo de trabajo:
```bash
# Para trabajar en frontend:
git checkout frontend
# Realizar cambios en src/ y subir:
git push origin frontend

# Para trabajar en backend:
git checkout backend
# Realizar cambios en server/ y subir:
git push origin backend

# Para integrar en main:
git checkout main
git merge frontend
git merge backend
git push origin main
```
