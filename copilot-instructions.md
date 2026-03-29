# Copilot Project Context

Este archivo proporciona contexto y convenciones para el uso de GitHub Copilot en el proyecto QuizApp.

## Estructura del Proyecto

- **backend/**: Lógica de servidor, rutas, scripts de seed y actualización, conexión a base de datos (Supabase).
  - `index.js`: Entrada principal del backend.
  - `routes/quiz.js`: Endpoints relacionados con quizzes.
  - `data/`: Mock data y conexión Supabase.
  - `scripts/`: Scripts para seed, actualización y utilidades.
- **db/**: Esquemas y seeds SQL para la base de datos.
- **frontend/**: Aplicación cliente (React + Vite).
  - `src/components/`: Componentes principales (QuizCard, ProgressBar, ResultScreen).

## Convenciones

- **Base de datos**: PostgreSQL gestionada en Supabase. El esquema está en `db/01_schema.sql`.
- **Scripts de seed**: Los scripts para insertar preguntas/respuestas deben ir en `backend/scripts/`.
- **Frontend**: React con Vite. CSS modular en `index.css`.
- **Rutas API**: Definidas en `backend/routes/`.

## Buenas prácticas

- Mantener la separación clara entre frontend y backend.
- Los scripts de migración y seed deben ser idempotentes.
- Usar comentarios claros en los scripts SQL y JS.
- Los datos de ejemplo y tests deben ir en los directorios correspondientes (`data/`, `scripts/`, `db/`).

## Notas

- Si se añaden nuevos tests o quizzes, seguir el formato de los scripts existentes.
- Para nuevas rutas o endpoints, documentar en el README y seguir la estructura de `routes/`.

---

Este archivo sirve como referencia rápida para desarrolladores y asistentes de IA sobre la estructura y convenciones del proyecto.