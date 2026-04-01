import { useState, useEffect } from "react";
import ResultScreen from "./components/ResultScreen";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Header from "./components/Header";
import AdvancedSetup from "./components/AdvancedSetup";
import "./App.css";

const API = import.meta.env.VITE_API_URL ?? "/api";

const VIEWS = { HOME: "home", QUIZ: "quiz", RESULT: "result", ADVANCED: "advanced" };

export default function App() {
  const [view, setView] = useState(VIEWS.HOME);
  const [quizList, setQuizList] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState(null);
  const [quizConfig, setQuizConfig] = useState(null);
  const [currentFailedIndices, setCurrentFailedIndices] = useState([]);

  useEffect(() => {
    fetch(`${API}/quizzes`)
      .then((r) => r.json())
      .then(setQuizList)
      .catch(() => setError("No se pudo cargar los tests. ¿Está el backend corriendo?"));
  }, []);

  // Inicio normal desde la Home: todas las preguntas
  const startQuiz = async (id) => {
    setLoadingQuiz(true);
    setError(null);
    try {
      const res = await fetch(`${API}/quizzes/${id}`);
      const data = await res.json();
      data.questions = data.questions.map((q, i) => ({ ...q, originalIndex: i + 1 }));
      setActiveQuiz(data);
      setQuizConfig(null); // sin filtro
      setQuestionIndex(0);
      setScore(0);
      setCurrentFailedIndices([]);
      setView(VIEWS.QUIZ);
    } catch {
      setError("Error cargando el quiz. Intenta de nuevo.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  // Inicio desde Modo Avanzado: preguntas filtradas por índices (1-based)
  const handleAdvancedStart = async ({ quizId, questionIndices, shuffle }) => {
    setLoadingQuiz(true);
    setError(null);
    try {
      const res = await fetch(`${API}/quizzes/${quizId}`);
      const data = await res.json();
      data.questions = data.questions.map((q, i) => ({ ...q, originalIndex: i + 1 }));
      const filteredQuestions = data.questions.filter((q) =>
        questionIndices.includes(q.originalIndex)
      );

      if (shuffle) {
        shuffleQuestions(filteredQuestions);
      }

      setActiveQuiz({ ...data, questions: filteredQuestions });
      setQuizConfig({ quizId, questionIndices, shuffle });
      setQuestionIndex(0);
      setScore(0);
      setCurrentFailedIndices([]);
      setView(VIEWS.QUIZ);
    } catch {
      setError("Error cargando el quiz. Intenta de nuevo.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleNext = (wasCorrect) => {
    const failedIndex = activeQuiz.questions[questionIndex].originalIndex;
    let newFailedIndices = currentFailedIndices;

    if (!wasCorrect) {
      if (!currentFailedIndices.includes(failedIndex)) {
        newFailedIndices = [...currentFailedIndices, failedIndex];
        setCurrentFailedIndices(newFailedIndices);
      }
    } else {
      setScore((s) => s + 1);
    }

    const nextIndex = questionIndex + 1;
    if (nextIndex >= activeQuiz.questions.length) {
      if (newFailedIndices.length > 0) {
        saveAttemptToStorage(activeQuiz.id, newFailedIndices);
      }
      setView(VIEWS.RESULT);
    } else {
      setQuestionIndex(nextIndex);
    }
  };

  const saveAttemptToStorage = (quizId, failedIndices) => {
    try {
      const stored = localStorage.getItem("quiz_failed_attempts");
      const history = stored ? JSON.parse(stored) : {};
      
      if (!history[quizId]) {
        history[quizId] = [];
      }
      
      history[quizId].unshift({
        date: new Date().toISOString(),
        indices: failedIndices
      });
      
      // Keep only last 3
      history[quizId] = history[quizId].slice(0, 3);
      
      localStorage.setItem("quiz_failed_attempts", JSON.stringify(history));
    } catch (e) {
      console.error("No se pudo guardar el intento en localStorage", e);
    }
  };

  const shell = (children) => (
    <div className="app-shell">
      <div className="app-shell-inner">
        <Header
          view={view.replace(/^[a-z]+\./, "")}
          activeQuiz={activeQuiz}
          onHome={() => setView(VIEWS.HOME)}
        />
        {children}
      </div>
    </div>
  );

  const shuffleQuestions = (filteredQuestions) => {
    for (let i = filteredQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
    }
  }

  // ── ADVANCED ──────────────────────────────────────────────────────────────
  if (view === VIEWS.ADVANCED) {
    return shell(
      <AdvancedSetup
        quizList={quizList}
        onStart={handleAdvancedStart}
        onBack={() => setView(VIEWS.HOME)}
      />
    );
  }

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (view === VIEWS.HOME) {
    return shell(
      <>
        <Home
          quizList={quizList}
          loadingQuiz={loadingQuiz}
          error={error}
          startQuiz={startQuiz}
          onAdvancedClick={() => setView(VIEWS.ADVANCED)}
        />
      </>
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
        currentFailedIndices={currentFailedIndices}
        onRestart={() =>
          quizConfig
            ? handleAdvancedStart(quizConfig)
            : startQuiz(activeQuiz.id)
        }
        onRetryFailed={() => {
          handleAdvancedStart({ quizId: activeQuiz.id, questionIndices: currentFailedIndices, shuffle: false });
        }}
        onHome={() => setView(VIEWS.HOME)}
      />
    );
  }

  return null;
}