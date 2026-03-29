import { useState, useEffect } from "react";
import ResultScreen from "./components/ResultScreen";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Header from "./components/Header";
import "./App.css";

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
    <div className="app-shell">
      <div className="app-shell-inner">
        <Header view={view.replace(/^[a-z]+\./, "")} activeQuiz={activeQuiz} onHome={() => setView(VIEWS.HOME)} />
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
    return shell(
      <Quiz
        activeQuiz={activeQuiz}
        questionIndex={questionIndex}
        handleNext={handleNext}
      />
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
