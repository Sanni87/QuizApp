// backend/data/supabase/quiz_updates.js
// ============================================================
// Quiz Updates — funciones de modificación de quiz, questions y answers
// Requiere autenticación de Supabase, usa SUPABASE_BACKEND_KEY
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseUpdateKey = process.env.SUPABASE_BACKEND_KEY;

const supabaseWrite = (supabaseUrl && supabaseUpdateKey)
  ? createClient(supabaseUrl, supabaseUpdateKey)
  : null;

if (!supabaseWrite) {
  console.warn('[DB] Variable SUPABASE_BACKEND_KEY no encontrada → operaciones de escritura no disponibles');
}

// --- API pública --------------------------------------------------------------

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

export { setAnswerAsCorrect };
