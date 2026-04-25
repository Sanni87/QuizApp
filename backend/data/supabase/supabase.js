// backend/db/supabase.js
// ============================================================
// Cliente Supabase + capa de acceso a datos
// con fallback automático a mocks si Supabase no está disponible
// ============================================================

import { createClient } from '@supabase/supabase-js';

// --- Inicialización -----------------------------------------------------------
const supabaseUrl  = process.env.SUPABASE_URL;
const supabaseKey  = process.env.SUPABASE_SERVICE_KEY;
const supabaseUpdateKey = process.env.SUPABASE_BACKEND_KEY; // Clave con permisos de escritura para el backend

// El cliente es null si no hay variables de entorno → usa mocks
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;
  
if (!supabase) {
  console.warn('[DB] Variables SUPABASE_URL / SUPABASE_SERVICE_KEY no encontradas → usando mocks');
}

//Creamos otro cliente con permisos de escritura para las operaciones que lo requieran (ej. setAnswerAsCorrect)
const supabaseWrite = (supabaseUrl && supabaseUpdateKey)
  ? createClient(supabaseUrl, supabaseUpdateKey)
  : null;

if (!supabaseWrite) {
  console.warn('[DB] Variable SUPABASE_BACKEND_KEY no encontrada → operaciones de escritura no disponibles');
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

/**
 * Login de usuario con email y contraseña.
 * Devuelve { user, session } si es exitoso, null si falla.
 */
async function loginUser(email, password) {
  try {
    if (!supabaseWrite) {
      throw new Error('Supabase con permisos de escritura no está configurado');
    }

    const { data, error } = await supabaseWrite.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[AUTH] Error en login:', error.message);
      return null;
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
      },
    };

  } catch (err) {
    console.error('[AUTH] Error en loginUser:', err.message);
    return null;
  }
}

/**
 * Establece una respuesta como correcta y el resto de respuestas
 * de la misma pregunta como incorrectas, dentro de una transacción.
 * Requiere autenticación de Supabase.
 */
async function setAnswerAsCorrect(answerId, token) {
  try {
    if (!supabaseWrite) {
      throw new Error('Supabase con permisos de escritura no está configurado');
    }

    // Validar token
    const { data: { user }, error: authError } = await supabaseWrite.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Token inválido o expirado');
    }

    // Llamar a la función SQL que maneja ambos updates en una transacción
    const { data, error } = await supabaseWrite.rpc('set_answer_as_correct', {
      p_answer_id: answerId,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Error desconocido al actualizar la respuesta');
    }

    return { success: true, message: data.message };

  } catch (err) {
    console.error('[DB] Error en setAnswerAsCorrect:', err.message);
    return { success: false, error: err.message };
  }
}

export { getAllQuizzes, getQuizById, loginUser, setAnswerAsCorrect };
