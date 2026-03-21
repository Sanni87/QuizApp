import React, { useState, useEffect } from "react";
import ProgressBar from "./components/ProgressBar";
import QuizCard from "./components/QuizCard";
import ResultScreen from "./components/ResultScreen";

const API = "/api";

const VIEWS = { HOME: "home", QUIZ: "quiz", RESULT: "result" };

export default function App() {
  const [view, setView] = useState(VIEWS.HOME);
  const [quizList, setQuizList] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastWasCorrect, setLastWasCorrect] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/quizzes`)
      .then((r) => r.json())
      .then(setQuizList)
      .catch(() => setError("No se pudo cargar los tests. ¿Está el backend corriendo?"));
  }, []);

  const startQuiz = async (id) => {
    setLoadingQuiz(true);
    setError(null);
    try {
      const res = await fetch(`${API}/quizzes/${id}`);
      const data = await res.json();
      setActiveQuiz(data);
      setQuestionIndex(0);
      setScore(0);
      setView(VIEWS.QUIZ);
    } catch {
      setError("Error cargando el quiz. Intenta de nuevo.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleNext = (wasCorrect) => {
    if (wasCorrect) setScore((s) => s + 1);
    const nextIndex = questionIndex + 1;
    if (nextIndex >= activeQuiz.questions.length) {
      setView(VIEWS.RESULT);
    } else {
      setQuestionIndex(nextIndex);
    }
  };

  const shell = (children) => (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "2rem 1rem",
      background: "var(--bg)",
    }}>
      <div style={{ width: "100%", maxWidth: "560px" }}>
        <header style={{ marginBottom: "3rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            onClick={() => setView(VIEWS.HOME)}
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              cursor: "pointer",
              letterSpacing: "-0.02em",
            }}
          >
            QUIZ<span style={{ color: "var(--accent)" }}>.</span>
          </span>
          {view === VIEWS.QUIZ && activeQuiz && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}>
              {activeQuiz.title}
            </span>
          )}
        </header>
        {children}
      </div>
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (view === VIEWS.HOME) {
    return shell(
      <>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(2rem, 6vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "0.75rem",
            letterSpacing: "-0.03em",
          }}>
            Pon a prueba<br />
            <span style={{ color: "var(--accent)" }}>lo que sabes.</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Elige un test y obtén feedback inmediato en cada respuesta.
          </p>
        </div>

        {error && (
          <div style={{
            padding: "1rem 1.25rem",
            borderRadius: "var(--radius-sm)",
            border: "1.5px solid var(--wrong)",
            background: "var(--wrong-bg)",
            color: "var(--wrong)",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {quizList.length === 0 && !error && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Cargando tests...</p>
          )}
          {quizList.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => startQuiz(quiz.id)}
              disabled={loadingQuiz}
              style={{
                textAlign: "left",
                padding: "1.25rem 1.5rem",
                borderRadius: "var(--radius)",
                border: "1.5px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--text)",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "var(--bg3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--bg2)";
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
              }}>
                <div>
                  <p style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    marginBottom: "0.3rem",
                  }}>
                    {quiz.title}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {quiz.description}
                  </p>
                </div>
                <span style={{
                  minWidth: "fit-content",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "99px",
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  fontSize: "0.75rem",
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}>
                  {quiz.questionCount} preg.
                </span>
              </div>
            </button>
          ))}
        </div>
      </>
    );
  }

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  if (view === VIEWS.QUIZ && activeQuiz) {
    const question = activeQuiz.questions[questionIndex];
    return shell(
      <>
        <ProgressBar current={questionIndex + 1} total={activeQuiz.questions.length} />
        <QuizCard
          key={question.id}
          quizId={activeQuiz.id}
          question={question}
          index={questionIndex}
          total={activeQuiz.questions.length}
          onNext={(wasCorrect) => handleNext(wasCorrect)}
        />
      </>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (view === VIEWS.RESULT) {
    return shell(
      <ResultScreen
        score={score}
        total={activeQuiz.questions.length}
        onRestart={() => startQuiz(activeQuiz.id)}
        onHome={() => setView(VIEWS.HOME)}
      />
    );
  }

  return null;
}
