import React, { useState, useEffect } from "react";
import ProgressBar from "./components/ProgressBar";
import QuizCard from "./components/QuizCard";
import ResultScreen from "./components/ResultScreen";
import Home from "./components/Home";

const API = import.meta.env.VITE_API_URL ?? "/api";

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
      <Home
        quizList={quizList}
        loadingQuiz={loadingQuiz}
        error={error}
        startQuiz={startQuiz}
      />
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
