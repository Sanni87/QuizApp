# Quiz App

Web de tests con feedback inmediato. Stack: **Express** (backend) + **React + Vite** (frontend).

## Estructura

```
quiz-app/
├── backend/
│   ├── index.js          # Entry point Express
│   ├── routes/quiz.js    # Endpoints API
│   ├── data/mocks.js     # Tests mock (sustituir por DB)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx               # Shell + routing
    │   ├── components/
    │   │   ├── QuizCard.jsx      # Pregunta + opciones + feedback
    │   │   ├── ProgressBar.jsx   # Barra de progreso
    │   │   └── ResultScreen.jsx  # Pantalla final
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js    # Proxy /api → :3001
    └── package.json
```

## Setup

### Backend
```bash
cd backend
npm install
npm run dev       # nodemon, puerto 3001
# o en prod:
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # Vite, puerto 5173
```

El proxy de Vite redirige `/api/*` → `http://localhost:3001`, así que no hay CORS en dev.

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/quizzes` | Lista de tests (sin respuestas) |
| GET | `/api/quizzes/:id` | Preguntas de un test (sin respuestas) |
| POST | `/api/quizzes/:id/answer` | Comprueba una respuesta |

### POST /api/quizzes/:id/answer

Body:
```json
{ "questionId": "q1", "selectedIndex": 1 }
```

Response:
```json
{
  "correct": true,
  "correctIndex": 1,
  "explanation": "..."
}
```

## Añadir tests

Edita `backend/data/mocks.js`. Cuando integres base de datos, solo cambia esa capa — las rutas y el frontend no necesitan cambios.

## Próximos pasos sugeridos

- [ ] Integrar base de datos (PostgreSQL / MongoDB)
- [ ] Autenticación de usuarios
- [ ] Historial de resultados por usuario
- [ ] Panel de administración para crear/editar tests
- [ ] Timer por pregunta
- [ ] Categorías y filtros
