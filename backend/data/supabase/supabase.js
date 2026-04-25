// backend/data/supabase/supabase.js
// ============================================================
// Re-exportación centralizada de funciones Supabase
// (DEPRECATED: Importa directamente desde módulos específicos)
// ============================================================

export { loginUser } from './auth.js';
export { getAllQuizzes, getQuizById } from './quiz_queries.js';
export { setAnswerAsCorrect } from './quiz_updates.js';
