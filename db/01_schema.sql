-- ============================================================
-- QUIZ APP — Schema
-- Ejecutar en: Supabase > SQL Editor
-- ============================================================

-- 1. QUIZZES
CREATE TABLE quizzes (
  id          TEXT PRIMARY KEY,          -- ej: 'js-basics'
  title       TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. QUESTIONS
CREATE TABLE questions (
  id          TEXT PRIMARY KEY,          -- ej: 'js-basics_q1'
  quiz_id     TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  explanation TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. OPTIONS
CREATE TABLE options (
  id          SERIAL PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- Índices para acelerar las queries más frecuentes
-- ============================================================
CREATE INDEX idx_questions_quiz_id    ON questions(quiz_id);
CREATE INDEX idx_options_question_id  ON options(question_id);

-- ============================================================
-- Row Level Security (RLS) — solo lectura pública
-- Actívalo si usas la anon key desde el frontend
-- ============================================================
ALTER TABLE quizzes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read quizzes"   ON quizzes   FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Public read options"   ON options   FOR SELECT USING (true);
