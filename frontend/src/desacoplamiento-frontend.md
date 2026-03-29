# Plan de Desacoplamiento Frontend (QuizApp)

## Objetivo
Desacoplar lógica, vistas y estilos en el frontend para mejorar la mantenibilidad y escalabilidad del proyecto.

---

## Lista de tareas

1. **Extracción de estilos a CSS**
   - 1.1. Identificar todos los estilos inline y en objetos JS en los componentes.
   - 1.2. Crear un fichero CSS por componente principal (`ProgressBar.css`, `QuizCard.css`, `ResultScreen.css`, etc.) en `src/components/`.
   - 1.3. Migrar los estilos de cada componente a su respectivo fichero CSS.
   - 1.4. Importar los CSS en cada componente y eliminar los estilos inline.
   - 1.5. Revisar si hay estilos globales que deban ir en `index.css`.

2. **Desacoplar vistas de App.jsx**
   - 2.1. Analizar y extraer la vista HOME a un nuevo componente `Home.jsx`.
   - 2.2. Analizar y extraer la vista QUIZ a un nuevo componente `Quiz.jsx`.
   - 2.3. Analizar y extraer la vista RESULT a un nuevo componente `Result.jsx`.
   - 2.4. Adaptar `App.jsx` para que solo gestione el estado global y el enrutado entre vistas.
   - 2.5. Revisar y ajustar las props y callbacks entre App y los nuevos componentes.

3. **Refactorización y limpieza**
   - 3.1. Revisar duplicidades y lógica compartida entre componentes.
   - 3.2. Documentar los cambios y actualizar el contexto del proyecto si es necesario.

---

## Orden recomendado

1. Extracción de estilos a CSS (por componente, para facilitar el refactor posterior).
2. Desacoplar vistas de App.jsx (crear Home.jsx, Quiz.jsx, Result.jsx).
3. Refactorización y limpieza final.

---

Este plan asegura un desacoplamiento progresivo y seguro, facilitando pruebas y revisiones en cada paso.