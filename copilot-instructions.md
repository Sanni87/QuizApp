# Copilot Project Context

Este archivo proporciona contexto y convenciones para asistentes de IA (Copilot, Gemini, etc.) que trabajen en el proyecto **QuizApp**.

> **⚠️ REGLA OBLIGATORIA — Mantener la documentación actualizada:**
> Si durante una sesión de trabajo realizas cambios relevantes en el proyecto (nueva funcionalidad, cambios en la estructura de ficheros, nuevas dependencias, nuevos endpoints, modificaciones en el esquema de datos, nuevas convenciones, etc.), **debes actualizar este fichero (`copilot-instructions.md`) y el `README.md`** de la raíz del proyecto para reflejar esos cambios. Esto es esencial para que la información no se pierda entre sesiones y cualquier asistente de IA que trabaje en el proyecto en el futuro tenga contexto actualizado.

## Descripción general

QuizApp es una aplicación web de tests/quizzes con feedback inmediato por pregunta. Está orientada actualmente a tests de oposiciones (Osakidetza / OPE País Vasco), aunque también incluye quizzes de desarrollo web (JS, React, Node/Express) como datos de ejemplo.

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Base de datos | PostgreSQL (Supabase) | — |
| Backend | Node.js + Express | Express 4.x |
| Frontend | React + Vite | React 18, Vite 5 |
| Estilos | CSS modular (vanilla) | — |
| Tipografías | Google Fonts (Syne + DM Sans) | — |
| Licencia | MIT | — |

## Estructura del proyecto

```
QuizApp/
├── backend/
│   ├── index.js                  # Entry point Express (CommonJS, puerto 3001)
│   ├── routes/
│   │   └── quiz.js               # Endpoints API (ESM: import/export)
│   ├── data/
│   │   ├── mocks.js              # Mock data local (CommonJS, legacy/fallback)
│   │   └── supabase/
│   │       └── supabase.js       # Cliente Supabase + capa de datos (ESM)
│   ├── scripts/
│   │   ├── seed-osakidetza.js    # Seed: importa quiz desde JSON a Supabase
│   │   ├── update-osakidetza-answers.js  # Actualiza respuestas correctas + explicaciones
│   │   ├── testComun_*.json      # JSON con preguntas del test
│   │   └── *.pdf                 # PDF fuente de preguntas
│   ├── .env                      # Variables de entorno (NO versionado)
│   └── package.json
├── db/
│   ├── 01_schema.sql             # Esquema DDL (quizzes, questions, answers + RLS)
│   └── 02_mock_seed.sql          # Seed SQL con datos de ejemplo
├── frontend/
│   ├── index.html                # HTML raíz (carga Google Fonts)
│   ├── vite.config.js            # Proxy /api → localhost:3001
│   ├── src/
│   │   ├── main.jsx              # Punto de entrada React
│   │   ├── App.jsx               # Shell: routing por estado (HOME/QUIZ/RESULT/ADVANCED)
│   │   ├── App.css               # Layout del shell
│   │   ├── index.css             # Variables CSS globales, resets, animaciones
│   │   └── components/
│   │       ├── Header.jsx/.css         # Cabecera con logo y título del quiz activo
│   │       ├── Home.jsx/.css           # Pantalla principal: listado de tests
│   │       ├── AdvancedButton.jsx/.css # Botón para acceder al modo avanzado
│   │       ├── AdvancedSetup.jsx/.css  # Configuración avanzada (rango o preguntas exactas)
│   │       ├── Quiz.jsx                # Contenedor de pregunta activa
│   │       ├── QuizCard.jsx/.css       # Pregunta + opciones + feedback inline
│   │       ├── ProgressBar.jsx/.css    # Barra de progreso
│   │       └── ResultScreen.jsx/.css   # Pantalla final con gráfico circular SVG
│   └── package.json
├── GEMINI.md                     # Apunta a este fichero para asistentes AI
├── README.md                     # Documentación del proyecto
├── LICENSE                       # MIT
└── .gitignore
```

## Modelo de datos (Supabase / PostgreSQL)

```
quizzes (id PK, title, description, order_index, created_at)
  └── questions (id PK, quiz_id FK, text, explanation, order_index, created_at)
       └── answers (id SERIAL PK, question_id FK, text, is_correct, order_index)
```

- **RLS habilitado**: solo lectura pública (`SELECT`) en las tres tablas.
- Las queries usan relaciones anidadas de Supabase (`questions(answers(...))`).

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción |
|----------|-------------|
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_KEY` | Clave de servicio (lectura en runtime) |
| `SUPABASE_SECRET_KEY` | Clave con permisos de escritura (solo para scripts) |
| `PORT` | Puerto del servidor Express (por defecto: `3001`) |

### Frontend

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base de la API (por defecto: `/api` → proxy de Vite) |

## API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/quizzes` | Lista todos los quizzes con preguntas y opciones (sin `is_correct` en respuesta pública) |
| `GET` | `/api/quizzes/:id` | Detalle de un quiz: preguntas y opciones (sanitizadas) |
| `POST` | `/api/quizzes/:quizId/answer` | Comprueba una respuesta individual |
| `GET` | `/health` | Health check |

### POST `/api/quizzes/:quizId/answer`

**Body:**
```json
{ "questionId": "js-basics_q1", "selectedIndex": 42 }
```
> `selectedIndex` es el `id` (SERIAL) de la respuesta seleccionada, no la posición.

**Response:**
```json
{
  "correct": true,
  "correctIndex": 42,
  "explanation": "Texto explicativo..."
}
```

## Convenciones de código

### Backend
- `index.js` usa **CommonJS** (`require`/`module.exports`).
- `routes/quiz.js` y `data/supabase/supabase.js` usan **ESM** (`import`/`export`).
- La capa de datos (`supabase.js`) incluye fallback para cuando las variables de entorno de Supabase no están disponibles (log de warning, retorna array vacío).

### Frontend
- Componentes React funcionales con hooks.
- CSS modular: cada componente tiene su propio `.css` importado directamente.
- Variables de diseño centralizadas en `src/index.css` (`:root { --bg, --accent, --correct, --wrong, ... }`).
- Navegación por estado interno (`view`), no hay React Router.
- La URL de la API se lee de `import.meta.env.VITE_API_URL` con fallback a `/api`.

### Base de datos
- El esquema está en `db/01_schema.sql`. Ejecutar primero.
- El seed de ejemplo está en `db/02_mock_seed.sql`. Ejecutar después.
- Los IDs de preguntas siguen el patrón `{quizId}_q{N}` (ej: `osakidetza-comun_q1`).

### Scripts
- Los scripts de seed/actualización van en `backend/scripts/`.
- Deben ser idempotentes (usar `upsert` donde sea posible).
- Se ejecutan con `node --env-file-if-exists=.env ./scripts/<script>.js`.
- El script `update-osakidetza-answers.js` se puede lanzar con `npm run update-answers`.

## Diseño y UX

- **Tema oscuro** con acento amarillo-verde (`#c8f135`).
- Tipografías: **Syne** (headings), **DM Sans** (body).
- Animaciones: `fadeUp`, `pop`, `shimmer` definidas en `index.css`.
- Pantalla de resultados con gráfico circular SVG animado.
- **Modo Avanzado**: permite seleccionar un rango de preguntas o preguntas exactas (por número) antes de iniciar el test.

## Buenas prácticas

- Mantener la separación clara entre frontend y backend.
- Los scripts de migración y seed deben ser idempotentes.
- Usar comentarios claros en los scripts SQL y JS.
- Los datos de ejemplo y tests deben ir en los directorios correspondientes (`data/`, `scripts/`, `db/`).
- Cada componente React nuevo debe tener su propio fichero `.css` modular.
- No exponer `is_correct` en los endpoints GET (sanitizar antes de responder).

## Setup para desarrollo

### Backend
```bash
cd backend
npm install
npm run dev       # nodemon → puerto 3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # Vite → puerto 5173
```

El proxy de Vite redirige `/api/*` → `http://localhost:3001`, evitando CORS en desarrollo.