// backend/db/supabase.js
// ============================================================
// Cliente Supabase + capa de acceso a datos
// con fallback automático a mocks si Supabase no está disponible
// ============================================================

import { createClient } from '@supabase/supabase-js';

// --- Inicialización -----------------------------------------------------------
const supabaseUrl  = process.env.SUPABASE_URL;
const supabaseKey  = process.env.SUPABASE_SERVICE_KEY;

// El cliente es null si no hay variables de entorno → usa mocks
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!supabase) {
  console.warn('[DB] Variables SUPABASE_URL / SUPABASE_SERVICE_KEY no encontradas → usando mocks');
}

// --- Helpers ------------------------------------------------------------------

/**
 * Convierte una fila de Supabase al formato que espera el frontend:
 * { id, quiz_id, text, explanation, order_index, answers: [...] }
 * → { id, text, explanation, answers: [{ id, text, is_correct }] }
 */
function formatQuestion(q) {
  return {
    id:          q.id,
    text:        q.text,
    explanation: q.explanation ?? null,
    answers:     (q.answers ?? [])
                   .sort((a, b) => a.order_index - b.order_index)
                   .map(o => ({
                     id:         o.id,
                     text:       o.text,
                     is_correct: o.is_correct,
                   })),
  };
}

// --- API pública --------------------------------------------------------------

/**
 * Devuelve todos los quizzes con sus preguntas y opciones.
 */
async function getAllQuizzes() {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('id, title, description, order_index')
      .order('order_index', { ascending: false });

    if (error) throw error;

    return data.map(quiz => ({
      id:          quiz.id,
      title:       quiz.title,
      description: quiz.description,
    }));

  } catch (err) {
    console.error('[DB] Error en getAllQuizzes, usando fallback a mocks:', err.message);
    return [];
  }
}

/**
 * Devuelve un quiz por id con sus preguntas y opciones.
 */
async function getQuizById(id) {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        id, title, description, order_index,
        questions (
          id, text, explanation, order_index,
          answers (
            id, text, is_correct, order_index
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      id:          data.id,
      title:       data.title,
      description: data.description,
      questions:   (data.questions ?? [])
                     .sort((a, b) => a.order_index - b.order_index)
                     .map(formatQuestion),
    };

  } catch (err) {
    console.error(`[DB] Error en getQuizById(${id})`, err.message);
    return [];
  }
}

export { getAllQuizzes, getQuizById };
