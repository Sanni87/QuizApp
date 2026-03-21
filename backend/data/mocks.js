const quizzes = [
  {
    id: "js-basics",
    title: "JavaScript Fundamentals",
    description: "Test your core JS knowledge",
    questions: [
      {
        id: "q1",
        text: "¿Cuál es la diferencia entre `let` y `var`?",
        options: [
          "No hay diferencia",
          "`let` tiene scope de bloque, `var` tiene scope de función",
          "`var` tiene scope de bloque, `let` tiene scope de función",
          "`let` solo funciona en Node.js",
        ],
        correctIndex: 1,
        explanation:
          "`let` respeta el scope del bloque `{}` donde se declara. `var` sube al scope de la función más cercana (hoisting), lo que puede causar bugs difíciles de detectar.",
      },
      {
        id: "q2",
        text: "¿Qué devuelve `typeof null`?",
        options: ["'null'", "'undefined'", "'object'", "'boolean'"],
        correctIndex: 2,
        explanation:
          "Es uno de los bugs históricos de JS. `typeof null` devuelve `'object'` por razones de compatibilidad retroactiva desde los primeros días del lenguaje.",
      },
      {
        id: "q3",
        text: "¿Cuál de estas es una forma correcta de clonar un objeto en JS?",
        options: [
          "`const b = a`",
          "`const b = Object.assign({}, a)`",
          "`const b = a.clone()`",
          "`const b = a.copy()`",
        ],
        correctIndex: 1,
        explanation:
          "`Object.assign({}, a)` hace una copia shallow. Para deep clone puedes usar `structuredClone(a)` (moderno) o `JSON.parse(JSON.stringify(a))` (con limitaciones).",
      },
      {
        id: "q4",
        text: "¿Qué es el Event Loop en Node.js?",
        options: [
          "Un bucle que ejecuta código sincrónicamente",
          "El mecanismo que permite a Node manejar operaciones asíncronas en un solo hilo",
          "Una librería para manejar eventos del DOM",
          "Un patrón de diseño exclusivo de Node.js",
        ],
        correctIndex: 1,
        explanation:
          "El Event Loop es el corazón de Node.js. Permite ejecutar I/O no bloqueante delegando operaciones al sistema operativo y procesando callbacks cuando terminan, todo en un único hilo.",
      },
      {
        id: "q5",
        text: "¿Qué devuelve `Promise.all([p1, p2, p3])`?",
        options: [
          "El resultado de la primera promise que resuelve",
          "Una promise que resuelve con un array de resultados cuando todas resuelven",
          "Una promise que resuelve con el resultado de la última",
          "Tres promises separadas",
        ],
        correctIndex: 1,
        explanation:
          "`Promise.all` espera a que TODAS resuelvan y devuelve un array con sus valores en el mismo orden. Si cualquiera rechaza, rechaza inmediatamente (fail-fast).",
      },
    ],
  },
  {
    id: "react-basics",
    title: "React Essentials",
    description: "Hooks, estado y ciclo de vida",
    questions: [
      {
        id: "q1",
        text: "¿Cuándo se ejecuta el efecto de `useEffect(() => {}, [])`?",
        options: [
          "En cada render",
          "Solo al montar el componente",
          "Solo al desmontar el componente",
          "Nunca",
        ],
        correctIndex: 1,
        explanation:
          "El array vacío `[]` como dependencias indica que el efecto solo se ejecuta una vez, tras el primer render (mount). Equivalente al viejo `componentDidMount`.",
      },
      {
        id: "q2",
        text: "¿Qué hook usarías para acceder al DOM directamente?",
        options: ["`useState`", "`useEffect`", "`useRef`", "`useContext`"],
        correctIndex: 2,
        explanation:
          "`useRef` devuelve un objeto mutable `{ current: ... }` que persiste entre renders sin causar re-renders. Perfecto para referencias al DOM, timers, o cualquier valor mutable.",
      },
      {
        id: "q3",
        text: "¿Qué problema soluciona `useMemo`?",
        options: [
          "Memorizar funciones para pasarlas como props",
          "Evitar recalcular valores costosos en cada render",
          "Sincronizar estado entre componentes",
          "Guardar datos en localStorage",
        ],
        correctIndex: 1,
        explanation:
          "`useMemo` cachea el resultado de una función costosa y solo la recalcula si cambian sus dependencias. `useCallback` hace lo mismo pero para funciones (no su resultado).",
      },
    ],
  },
  {
    id: "node-express",
    title: "Node.js & Express",
    description: "APIs, middleware y patrones",
    questions: [
      {
        id: "q1",
        text: "¿Qué es el middleware en Express?",
        options: [
          "Una base de datos en memoria",
          "Funciones que tienen acceso a req, res y next en el ciclo request-response",
          "Un ORM para Node.js",
          "Un gestor de paquetes alternativo a npm",
        ],
        correctIndex: 1,
        explanation:
          "El middleware son funciones `(req, res, next) => {}` que se ejecutan en cadena. Pueden modificar req/res, terminar el ciclo, o llamar a `next()` para pasar al siguiente.",
      },
      {
        id: "q2",
        text: "¿Cuál es la diferencia entre `app.use()` y `app.get()`?",
        options: [
          "No hay diferencia",
          "`app.use()` aplica a todos los métodos HTTP, `app.get()` solo a GET",
          "`app.get()` aplica a todos los métodos, `app.use()` solo a GET",
          "`app.use()` es más rápido que `app.get()`",
        ],
        correctIndex: 1,
        explanation:
          "`app.use()` monta middleware para cualquier método HTTP y también hace prefix matching de rutas. `app.get()` es específico del método GET y requiere match exacto de ruta.",
      },
    ],
  },
];

module.exports = { quizzes };
