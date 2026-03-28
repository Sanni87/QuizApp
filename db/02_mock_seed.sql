-- ============================================================
-- QUIZ APP — Seed (datos migrados desde mocks.js)
-- Ejecutar DESPUÉS de 01_schema.sql
-- ============================================================

-- ============================================================
-- QUIZZES
-- ============================================================
INSERT INTO quizzes (id, title, description, order_index) VALUES
  ('js-basics',    'JavaScript Fundamentals', 'Test your core JS knowledge',   1),
  ('react-basics', 'React Essentials',        'Hooks, estado y ciclo de vida', 2),
  ('node-express', 'Node.js & Express',       'APIs, middleware y patrones',   3);


-- ============================================================
-- QUESTIONS + OPTIONS — js-basics
-- ============================================================
INSERT INTO questions (id, quiz_id, text, explanation, order_index) VALUES
  ('js-basics_q1', 'js-basics',
   '¿Cuál es la diferencia entre `let` y `var`?',
   '`let` respeta el scope del bloque `{}` donde se declara. `var` sube al scope de la función más cercana (hoisting), lo que puede causar bugs difíciles de detectar.',
   1),
  ('js-basics_q2', 'js-basics',
   '¿Qué devuelve `typeof null`?',
   'Es uno de los bugs históricos de JS. `typeof null` devuelve `''object''` por razones de compatibilidad retroactiva desde los primeros días del lenguaje.',
   2),
  ('js-basics_q3', 'js-basics',
   '¿Cuál de estas es una forma correcta de clonar un objeto en JS?',
   '`Object.assign({}, a)` hace una copia shallow. Para deep clone puedes usar `structuredClone(a)` (moderno) o `JSON.parse(JSON.stringify(a))` (con limitaciones).',
   3),
  ('js-basics_q4', 'js-basics',
   '¿Qué es el Event Loop en Node.js?',
   'El Event Loop es el corazón de Node.js. Permite ejecutar I/O no bloqueante delegando operaciones al sistema operativo y procesando callbacks cuando terminan, todo en un único hilo.',
   4),
  ('js-basics_q5', 'js-basics',
   '¿Qué devuelve `Promise.all([p1, p2, p3])`?',
   '`Promise.all` espera a que TODAS resuelvan y devuelve un array con sus valores en el mismo orden. Si cualquiera rechaza, rechaza inmediatamente (fail-fast).',
   5);

INSERT INTO options (question_id, text, is_correct, order_index) VALUES
  -- js-basics_q1
  ('js-basics_q1', 'No hay diferencia',                                                              FALSE, 1),
  ('js-basics_q1', '`let` tiene scope de bloque, `var` tiene scope de función',                      TRUE,  2),
  ('js-basics_q1', '`var` tiene scope de bloque, `let` tiene scope de función',                      FALSE, 3),
  ('js-basics_q1', '`let` solo funciona en Node.js',                                                 FALSE, 4),
  -- js-basics_q2
  ('js-basics_q2', '''null''',                                                                        FALSE, 1),
  ('js-basics_q2', '''undefined''',                                                                   FALSE, 2),
  ('js-basics_q2', '''object''',                                                                      TRUE,  3),
  ('js-basics_q2', '''boolean''',                                                                     FALSE, 4),
  -- js-basics_q3
  ('js-basics_q3', '`const b = a`',                                                                  FALSE, 1),
  ('js-basics_q3', '`const b = Object.assign({}, a)`',                                               TRUE,  2),
  ('js-basics_q3', '`const b = a.clone()`',                                                          FALSE, 3),
  ('js-basics_q3', '`const b = a.copy()`',                                                           FALSE, 4),
  -- js-basics_q4
  ('js-basics_q4', 'Un bucle que ejecuta código sincrónicamente',                                    FALSE, 1),
  ('js-basics_q4', 'El mecanismo que permite a Node manejar operaciones asíncronas en un solo hilo', TRUE,  2),
  ('js-basics_q4', 'Una librería para manejar eventos del DOM',                                      FALSE, 3),
  ('js-basics_q4', 'Un patrón de diseño exclusivo de Node.js',                                       FALSE, 4),
  -- js-basics_q5
  ('js-basics_q5', 'El resultado de la primera promise que resuelve',                                FALSE, 1),
  ('js-basics_q5', 'Una promise que resuelve con un array de resultados cuando todas resuelven',     TRUE,  2),
  ('js-basics_q5', 'Una promise que resuelve con el resultado de la última',                         FALSE, 3),
  ('js-basics_q5', 'Tres promises separadas',                                                        FALSE, 4);


-- ============================================================
-- QUESTIONS + OPTIONS — react-basics
-- ============================================================
INSERT INTO questions (id, quiz_id, text, explanation, order_index) VALUES
  ('react-basics_q1', 'react-basics',
   '¿Cuándo se ejecuta el efecto de `useEffect(() => {}, [])`?',
   'El array vacío `[]` como dependencias indica que el efecto solo se ejecuta una vez, tras el primer render (mount). Equivalente al viejo `componentDidMount`.',
   1),
  ('react-basics_q2', 'react-basics',
   '¿Qué hook usarías para acceder al DOM directamente?',
   '`useRef` devuelve un objeto mutable `{ current: ... }` que persiste entre renders sin causar re-renders. Perfecto para referencias al DOM, timers, o cualquier valor mutable.',
   2),
  ('react-basics_q3', 'react-basics',
   '¿Qué problema soluciona `useMemo`?',
   '`useMemo` cachea el resultado de una función costosa y solo la recalcula si cambian sus dependencias. `useCallback` hace lo mismo pero para funciones (no su resultado).',
   3);

INSERT INTO options (question_id, text, is_correct, order_index) VALUES
  -- react-basics_q1
  ('react-basics_q1', 'En cada render',                    FALSE, 1),
  ('react-basics_q1', 'Solo al montar el componente',      TRUE,  2),
  ('react-basics_q1', 'Solo al desmontar el componente',   FALSE, 3),
  ('react-basics_q1', 'Nunca',                             FALSE, 4),
  -- react-basics_q2
  ('react-basics_q2', '`useState`',                        FALSE, 1),
  ('react-basics_q2', '`useEffect`',                       FALSE, 2),
  ('react-basics_q2', '`useRef`',                          TRUE,  3),
  ('react-basics_q2', '`useContext`',                      FALSE, 4),
  -- react-basics_q3
  ('react-basics_q3', 'Memorizar funciones para pasarlas como props',       FALSE, 1),
  ('react-basics_q3', 'Evitar recalcular valores costosos en cada render',  TRUE,  2),
  ('react-basics_q3', 'Sincronizar estado entre componentes',               FALSE, 3),
  ('react-basics_q3', 'Guardar datos en localStorage',                      FALSE, 4);


-- ============================================================
-- QUESTIONS + OPTIONS — node-express
-- ============================================================
INSERT INTO questions (id, quiz_id, text, explanation, order_index) VALUES
  ('node-express_q1', 'node-express',
   '¿Qué es el middleware en Express?',
   'El middleware son funciones `(req, res, next) => {}` que se ejecutan en cadena. Pueden modificar req/res, terminar el ciclo, o llamar a `next()` para pasar al siguiente.',
   1),
  ('node-express_q2', 'node-express',
   '¿Cuál es la diferencia entre `app.use()` y `app.get()`?',
   '`app.use()` monta middleware para cualquier método HTTP y también hace prefix matching de rutas. `app.get()` es específico del método GET y requiere match exacto de ruta.',
   2);

INSERT INTO options (question_id, text, is_correct, order_index) VALUES
  -- node-express_q1
  ('node-express_q1', 'Una base de datos en memoria',                                                         FALSE, 1),
  ('node-express_q1', 'Funciones que tienen acceso a req, res y next en el ciclo request-response',           TRUE,  2),
  ('node-express_q1', 'Un ORM para Node.js',                                                                  FALSE, 3),
  ('node-express_q1', 'Un gestor de paquetes alternativo a npm',                                              FALSE, 4),
  -- node-express_q2
  ('node-express_q2', 'No hay diferencia',                                                                    FALSE, 1),
  ('node-express_q2', '`app.use()` aplica a todos los métodos HTTP, `app.get()` solo a GET',                 TRUE,  2),
  ('node-express_q2', '`app.get()` aplica a todos los métodos, `app.use()` solo a GET',                      FALSE, 3),
  ('node-express_q2', '`app.use()` es más rápido que `app.get()`',                                           FALSE, 4);
