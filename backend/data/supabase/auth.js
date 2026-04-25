// backend/data/supabase/auth.js
// ============================================================
// Autenticación — funciones públicas de login
// Usa SUPABASE_BACKEND_KEY
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseUpdateKey = process.env.SUPABASE_BACKEND_KEY;

const supabaseWrite = (supabaseUrl && supabaseUpdateKey)
  ? createClient(supabaseUrl, supabaseUpdateKey)
  : null;

if (!supabaseWrite) {
  console.warn('[AUTH] Variable SUPABASE_BACKEND_KEY no encontrada → autenticación no disponible');
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

export { loginUser };
