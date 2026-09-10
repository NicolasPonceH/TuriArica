# TuriArica V2 🌸

Bienvenido al rediseño premium de **TuriArica**, una aplicación web interactiva e inclusiva diseñada para mostrar los atractivos turísticos de la ciudad de Arica (la ciudad de la Eterna Primavera) sin barreras tecnológicas.

## ✨ Características Principales

* **Diseño "Brutal" y Premium**: Interfaz moderna basada en *Glassmorphism*, paletas vibrantes ("Eterna Primavera"), y tipografías hermosas (`Inter` / `Outfit`).
* **Carrusel de Video Inmersivo**: El inicio de la aplicación cuenta con videos cinematográficos en alta calidad con transiciones suaves (crossfade) integrados con la temática de la ciudad.
* **Mapa Interactivo 3D (MapLibre GL)**:
  * Motor WebGL a 60 FPS.
  * Perspectiva 3D con inclinación (*Pitch*) y rotación.
  * Rutas calculadas dinámicamente con efecto de neón.
* **Turi-Asistente Inteligente**: Un chatbot flotante integrado para guiar al usuario a tomar decisiones sobre qué visitar.
* **Accesibilidad Universal (A11y)**:
  * **Text-to-Speech (TTS)**: Botones para leer descripciones o la página entera en voz alta.
  * **Audios Reales**: Reproducción de descripciones en MP3 (con fallback a TTS).
  * **Panel de Ajustes Rápidos**: Modificación del tamaño del texto y un **Modo de Alto Contraste (Modo Oscuro)** dinámico y sin filtros destructivos.
  * **Transporte**: Integración de micros y líneas de transporte público para cada destino.

## 📸 Vistazo a la Aplicación

### Inicio Cinematográfico
![Hero](/docs/hero.png)

### Lugares y Modo Oscuro
![Lugares](/docs/lugares.png)

### Mapa Interactivo 3D (Rutas en Tiempo Real)
![Mapa](/docs/mapa.png)

### Turi-Asistente
![Asistente](/docs/asistente.png)

## 🛠 Tecnologías Utilizadas

* **[React 18](https://react.dev/)**: Librería principal para la construcción de interfaces.
* **[Vite](https://vitejs.dev/)**: Empaquetador ultra rápido.
* **[TailwindCSS v4](https://tailwindcss.com/)**: Motor de estilos y diseño fluido.
* **[Framer Motion](https://www.framer.com/motion/)**: Animaciones complejas y fluidas (scroll, micro-interacciones, físicas de rebote).
* **[MapLibre GL](https://maplibre.org/) & react-map-gl**: Mapas interactivos en 3D libres de tokens.
* **[Lucide React](https://lucide.dev/)**: Sistema de íconos consistente y moderno.
* **[GraphHopper API](https://www.graphhopper.com/)**: Motor de enrutamiento para calcular distancias hacia los puntos turísticos.

## 🚀 Instalación Local

Si deseas correr este proyecto en tu máquina local:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/NicolasPonceH/TuriArica-V2.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el entorno de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:5173` en tu navegador.

---
*Desarrollado con ❤️ para Arica, Chile.*
