# Quiz App

Aplicación web de **tests con feedback inmediato** por pregunta. Diseñada para preparar oposiciones (OPE Osakidetza / País Vasco) y practicar conocimientos de desarrollo web.

## ✨ Funcionalidades

- **Listado de tests** disponibles con título, descripción y número de preguntas.
- **Resolución interactiva**: seleccionar respuesta → feedback inmediato (correcto/incorrecto + explicación).
- **Modo Avanzado**: elegir un rango de preguntas o seleccionar preguntas exactas por número.
- **Pantalla de resultados**: puntuación con gráfico circular SVG animado y mensajes según rendimiento.
- **Diseño responsive** con tema oscuro y animaciones.

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Base de datos | PostgreSQL (Supabase) |
| Backend | Node.js + Express 4 |
| Frontend | React 18 + Vite 5 |
| Estilos | CSS modular (vanilla) |
| Tipografías | Google Fonts (Syne + DM Sans) |

## 📁 Estructura del proyecto

```
QuizApp/
├── backend/
│   ├── index.js              # Entry point Express (puerto 3001)
│   ├── routes/quiz.js        # Endpoints de la API
│   ├── data/
│   │   ├── mocks.js          # Datos mock locales (fallback)
│   │   └── supabase/
│   │       └── supabase.js   # Cliente Supabase + capa de acceso a datos
│   ├── scripts/              # Scripts de seed y actualización de datos
│   └── .env                  # Variables de entorno (no versionado)
├── db/
│   ├── 01_schema.sql         # Esquema de base de datos (DDL + RLS)
│   └── 02_mock_seed.sql      # Seed con datos de ejemplo
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Shell principal + navegación por estado
│   │   ├── index.css         # Variables CSS globales, resets, animaciones
│   │   └── components/       # Componentes React (cada uno con su .css)
│   ├── index.html            # HTML raíz
│   └── vite.config.js        # Proxy /api → backend
└── README.md
```

## 🚀 Setup

### Requisitos

- Node.js 20+
- Cuenta de [Supabase](https://supabase.com/) (o usar datos mock locales)

### Base de datos

1. Crea un proyecto en Supabase.
2. Ejecuta `db/01_schema.sql` en el SQL Editor de Supabase.
3. Ejecuta `db/02_mock_seed.sql` para insertar los tests de ejemplo.

### Backend

```bash
cd backend
npm install
```

Crea un fichero `.env`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu-service-key
PORT=3001
```

```bash
npm run dev       # Desarrollo (nodemon, auto-reload)
npm start         # Producción
```

### Frontend

```bash
cd frontend
npm install
npm run dev       # Vite → http://localhost:5173
```

> El proxy de Vite redirige `/api/*` → `http://localhost:3001`, evitando problemas de CORS en desarrollo.

## 📡 API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/quizzes` | Lista todos los tests con preguntas y opciones |
| `GET` | `/api/quizzes/:id` | Detalle de un test (preguntas sin respuestas correctas) |
| `POST` | `/api/quizzes/:quizId/answer` | Comprueba una respuesta |
| `GET` | `/health` | Health check |

### POST `/api/quizzes/:quizId/answer`

**Request body:**

```json
{ "questionId": "js-basics_q1", "selectedIndex": 42 }
```

**Response:**

```json
{
  "correct": true,
  "correctIndex": 42,
  "explanation": "Texto explicativo de la respuesta..."
}
```

## 🗄️ Modelo de datos

```
quizzes
  ├── id (PK, TEXT)
  ├── title, description
  └── order_index

questions
  ├── id (PK, TEXT, formato: {quizId}_q{N})
  ├── quiz_id (FK → quizzes)
  ├── text, explanation
  └── order_index

answers
  ├── id (PK, SERIAL)
  ├── question_id (FK → questions)
  ├── text, is_correct
  └── order_index
```

Row Level Security (RLS) habilitado con política de solo lectura pública.

## 📜 Scripts disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| Seed Osakidetza | `node scripts/seed-osakidetza.js` | Importa quiz desde JSON a Supabase |
| Update answers | `npm run update-answers` | Actualiza respuestas correctas y explicaciones |

> Los scripts requieren `SUPABASE_URL` y `SUPABASE_SECRET_KEY` en las variables de entorno.

## 🎨 Diseño

- **Tema oscuro** con acento amarillo-verde (`#c8f135`).
- Tipografías: **Syne** (headings) + **DM Sans** (body text).
- Animaciones CSS: `fadeUp`, `pop`, `shimmer`.
- Componentes con CSS modular (un archivo `.css` por componente).

## 📄 Licencia

[MIT](./LICENSE) — © 2026 Sanni87
