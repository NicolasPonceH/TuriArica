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

[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-396FBF?style=for-the-badge&logo=maplibre&logoColor=white)](https://maplibre.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Lucide](https://img.shields.io/badge/Lucide_Icons-F05032?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)

## 🛠 Tecnologías Utilizadas

| Tecnología | Descripción | Insignia |
| :--- | :--- | :--- |
| **React 18** | Arquitectura modular de componentes y hooks reactivos | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) |
| **Vite 6** | Bundler y servidor de desarrollo HMR ultrarrápido | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) |
| **TailwindCSS v4** | Motor de estilos utilitarios modernos y modo oscuro | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) |
| **MapLibre GL** | Motor cartográfico WebGL 3D a 60 FPS sin tokens | ![MapLibre](https://img.shields.io/badge/MapLibre-396FBF?style=flat-square&logo=maplibre&logoColor=white) |
| **Framer Motion** | Animaciones fluidas, transiciones de scroll y micro-interacciones | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) |
| **Lucide React** | Pack de iconografía vectorial limpia y coherente | ![Lucide](https://img.shields.io/badge/Lucide-F05032?style=flat-square&logo=lucide&logoColor=white) |
| **GraphHopper API** | Cálculo de rutas y distancias en tiempo real | ![GraphHopper](https://img.shields.io/badge/GraphHopper-55B359?style=flat-square&logo=openstreetmap&logoColor=white) |
| **Web Speech API** | Síntesis de voz (Text-to-Speech) nativa para accesibilidad universal | ![A11y](https://img.shields.io/badge/Web_Speech_API-A11y-purple?style=flat-square) |

---

## 📸 Vistazo a la Aplicación

### 🌟 Inicio Cinematográfico
![Hero](./docs/hero.png)

### 🌓 Lugares Turísticos y Modo Oscuro
![Lugares](./docs/lugares.png)

### 🗺️ Mapa Interactivo 3D (Rutas y Navegación)
![Mapa](./docs/mapa.png)

### 💬 Turi-Asistente Inteligente
![Asistente](./docs/asistente.png)

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
