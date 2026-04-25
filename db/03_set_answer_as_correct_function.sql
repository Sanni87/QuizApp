-- ============================================================
-- Función PL/pgSQL: set_answer_as_correct
-- Establece una respuesta como correcta dentro de una transacción
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION set_answer_as_correct(p_answer_id INT)
RETURNS JSON AS $$
DECLARE
  v_question_id TEXT;
BEGIN
  -- Obtener el question_id del answer
  SELECT question_id INTO v_question_id 
  FROM answers 
  WHERE id = p_answer_id;
  
  -- Si el answer no existe
  IF v_question_id IS NULL THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Answer not found'
    );
  END IF;
  
  -- Dentro de la transacción:
  -- 1. Poner false en todos los answers de la pregunta
  UPDATE answers 
  SET is_correct = false 
  WHERE question_id = v_question_id;
  
  -- 2. Poner true en el answer especificado
  UPDATE answers 
  SET is_correct = true 
  WHERE id = p_answer_id;
  
  -- Retornar éxito
  RETURN json_build_object(
    'success', true, 
    'message', 'Respuesta establecida como correcta'
  );
  
EXCEPTION WHEN OTHERS THEN
  -- En caso de error, el rollback es automático
  RETURN json_build_object(
    'success', false, 
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql;
