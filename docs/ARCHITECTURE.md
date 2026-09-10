# Documentación Técnica y Arquitectura de TuriArica V2

Este documento detalla la estructura interna, modelos de datos, endpoints de API y flujos de trabajo del proyecto TuriArica V2.

---

## 1. Arquitectura General

El proyecto está diseñado como un monorepo dividido limpiamente en dos capas:
1. **Frontend (`src/`):** SPA construida con React 18, Vite 6 y TailwindCSS v4. Maneja la renderización de mapas en 3D con MapLibre GL, el sistema de accesibilidad, los modales de interacción y la PWA.
2. **Backend (`server/`):** API REST construida con Node.js y Express. Utiliza SQLite 3 como base de datos embebida de alto rendimiento y Sharp para el procesamiento multimedia.

---

## 2. Esquema de la Base de Datos SQLite (`server/database/turiarica.db`)

### Tabla `admins`
| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | Identificador del usuario |
| `username` | TEXT UNIQUE | Nombre de usuario (`jorell`, `nicolas`, `admin`) |
| `password_hash` | TEXT | Hash de contraseña con `bcryptjs` (salt rounds: 10) |
| `role` | TEXT | Rol de privilegios (`administrador`, `superadmin`) |
| `created_at` | DATETIME | Fecha de creación del usuario |

### Tabla `places`
| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | Identificador del lugar |
| `name` | TEXT | Nombre del atractivo o punto |
| `category` | TEXT | Categoría turística (Playa, Museo, Histórico, etc.) |
| `type` | TEXT | Tipo general (`turismo`, `gastronomia`, `servicio`) |
| `icon` | TEXT | Nombre de icono Lucide correspondiente |
| `color` | TEXT | Color hexadecimal de acento |
| `short_desc` | TEXT | Descripción breve para tarjetas |
| `full_desc` | TEXT | Descripción completa enriquecida para el turista y la IA |
| `lat` | REAL | Latitud geográfica decimal |
| `lng` | REAL | Longitud geográfica decimal |
| `hours` | TEXT | Horarios de atención |
| `directions` | TEXT | Instrucciones de cómo llegar |
| `phone` | TEXT | Teléfono de contacto |
| `website` | TEXT | Sitio web oficial |
| `price_range` | TEXT | Rango de precios (`$`, `$$`, `$$$`) |
| `is_24h` | INTEGER | Booleano (1 o 0) si atiende 24 horas |
| `audio_file` | TEXT | Ruta de archivo de audio narrativo |
| `transport_json` | TEXT | JSON con líneas de micro, letrero y paradas |
| `photos_json` | TEXT | JSON array con URLs de fotos optimizadas |
| `videos_json` | TEXT | JSON array con URLs de videos web |
| `ai_tags_json` | TEXT | JSON array de etiquetas clave para el contexto IA |
| `is_default` | INTEGER | Booleano si es parte de los lugares base |
| `created_at` | DATETIME | Timestamp de creación |
| `updated_at` | DATETIME | Timestamp de última edición |

### Tabla `events`
| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | Identificador del evento o aviso |
| `title` | TEXT | Título del evento |
| `message` | TEXT | Descripción detallada de la alerta o festival |
| `type` | TEXT | Tipo (`festival`, `alerta`, `evento`, `cultural`) |
| `start_date` | TEXT | Fecha de inicio (YYYY-MM-DD) |
| `end_date` | TEXT | Fecha de término (YYYY-MM-DD) |
| `is_active` | INTEGER | Booleano (1 o 0) de visibilidad |
| `is_popup` | INTEGER | Booleano (1 o 0) si se muestra como popup emergente |
| `banner_url` | TEXT | URL de imagen o afiche promocional |
| `action_url` | TEXT | Enlace externo a sitio oficial o compra de entradas |
| `priority` | INTEGER | Nivel de orden (1 = más prioritario) |
| `created_at` | DATETIME | Timestamp de registro |

---

## 3. Endpoints de la API REST (`http://localhost:5000/api`)

### Autenticación (`/auth`)
- `POST /api/auth/login`: Autentica con `{ username, password }` y retorna JWT token.
- `GET /api/auth/me`: Valida token y retorna información de la sesión.
- `PUT /api/auth/change-password`: Modifica la contraseña del administrador actual.

### Lugares Turísticos (`/places`)
- `GET /api/places`: Retorna la lista completa de lugares.
- `GET /api/places/:id`: Retorna el detalle de un lugar específico.
- `POST /api/places`: *(Requiere Token)* Crea un nuevo lugar.
- `PUT /api/places/:id`: *(Requiere Token)* Actualiza un lugar existente.
- `DELETE /api/places/:id`: *(Requiere Token)* Elimina un lugar.

### Eventos y Avisos (`/events`)
- `GET /api/events/active`: Retorna los anuncios activos vigentes para popups y campana de notificaciones.
- `GET /api/events`: *(Requiere Token)* Retorna todos los eventos para el panel de administración.
- `POST /api/events`: *(Requiere Token)* Crea un nuevo evento.
- `PUT /api/events/:id`: *(Requiere Token)* Actualiza un evento.
- `DELETE /api/events/:id`: *(Requiere Token)* Elimina un evento.

### Subida Multimedia (`/upload`)
- `POST /api/upload/photo`: *(Requiere Token)* Procesa con `sharp`, redimensiona a 1920x1080 WebP y crea miniatura 400x300 WebP.
- `POST /api/upload/video`: *(Requiere Token)* Guarda video web y habilita streaming con cabeceras `Range`.

### Servicios de Inteligencia Artificial (`/ai`)
- `GET /api/ai/context`: Genera un system prompt dinámico y corpus de conocimiento turístico para LLMs.
- `POST /api/ai/ask`: Responde preguntas del usuario utilizando la base de datos de Arica.
- `GET /api/ai/dataset`: Exporta la base de datos en formato Q&A / JSONL para fine-tuning o RAG.
