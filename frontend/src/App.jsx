import { useState, useEffect } from "react";
import ResultScreen from "./components/ResultScreen";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Header from "./components/Header";
import AdvancedSetup from "./components/AdvancedSetup";
import SideBar from "./components/SideBar";
import Login from "./components/Login";
import EditAnswerModal from "./components/EditAnswerModal";
import "./App.css";

import { 
  fetchQuizList, 
  fetchQuizById, 
  loginUser, 
  updateCorrectAnswer,
  getAuthToken,
  saveAuthToken,
  clearAuthToken 
} from "./utils/api";

const VIEWS = { HOME: "home", QUIZ: "quiz", RESULT: "result", ADVANCED: "advanced", LOGIN: "login" };

export default function App() {
  // Quiz state
  const [view, setView] = useState(VIEWS.HOME);
  const [quizList, setQuizList] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState(null);
  const [quizConfig, setQuizConfig] = useState(null);
  const [currentFailedIndices, setCurrentFailedIndices] = useState([]);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  // Authentication state
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Edit answer modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalLoading, setEditModalLoading] = useState(false);
  const [editModalError, setEditModalError] = useState(null);

  // Load auth from localStorage on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      // Try to parse user from token or localStorage (basic implementation)
      const storedUser = localStorage.getItem("auth_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Fetch quiz list
  useEffect(() => {
    fetchQuizList()
      .then(setQuizList)
      .catch((e) => setError(e.message));
  }, []);

  // Inicio normal desde la Home: todas las preguntas
  const startQuiz = async (id) => {
    setLoadingQuiz(true);
    setError(null);
    try {
      const data = await fetchQuizById(id);
      data.questions = data.questions.map((q, i) => ({ ...q, originalIndex: i + 1 }));
      setActiveQuiz(data);
      setQuizConfig(null); // sin filtro
      setQuestionIndex(0);
      setScore(0);
      setCurrentFailedIndices([]);
      setView(VIEWS.QUIZ);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingQuiz(false);
    }
  };

  // Inicio desde Modo Avanzado: preguntas filtradas por índices (1-based)
  const handleAdvancedStart = async ({ quizId, questionIndices, shuffle, shuffleAnswers }) => {
    setLoadingQuiz(true);
    setError(null);
    try {
      const data = await fetchQuizById(quizId);
      data.questions = data.questions.map((q, i) => ({ ...q, originalIndex: i + 1 }));
      const filteredQuestions = data.questions.filter((q) =>
        questionIndices.includes(q.originalIndex)
      );

      if (shuffle) {
        shuffleQuestions(filteredQuestions);
      }

      if (shuffleAnswers) {
        shuffleQuestionAnswers(filteredQuestions);
      }

      setActiveQuiz({ ...data, questions: filteredQuestions });
      setQuizConfig({ quizId, questionIndices, shuffle, shuffleAnswers });
      setQuestionIndex(0);
      setScore(0);
      setCurrentFailedIndices([]);
      setView(VIEWS.QUIZ);
    } catch (e) {
      setError(e.message);
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

  // ── Authentication Handlers ───────────────────────────────────────────────
  const handleLogin = async (email, password) => {
    try {
      const result = await loginUser(email, password);
      
      // Store token
      if (result.session?.access_token) {
        saveAuthToken(result.session.access_token);
        setAuthToken(result.session.access_token);
      }
      
      // Store user info
      if (result.user) {
        const userData = { email: result.user.email, id: result.user.id };
        localStorage.setItem("auth_user", JSON.stringify(userData));
        setUser(userData);
      }
      
      setIsAuthenticated(true);
      setView(VIEWS.HOME);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    localStorage.removeItem("auth_user");
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setView(VIEWS.HOME);
  };

  const handleEditAnswer = async (answerId) => {
    if (!authToken) {
      setEditModalError("No estás autenticado");
      return;
    }

    setEditModalLoading(true);
    setEditModalError(null);

    try {
      await updateCorrectAnswer(answerId, authToken);
      setShowEditModal(false);
      // Optional: Show success message or refresh quiz
    } catch (err) {
      setEditModalError(err.message);
    } finally {
      setEditModalLoading(false);
    }
  };

  const shell = (children) => {
    const activeQuestion = activeQuiz && questionIndex < activeQuiz.questions.length 
      ? activeQuiz.questions[questionIndex] 
      : null;

    return (
      <div className="app-shell">
        <SideBar
          isOpen={sideBarOpen}
          onClose={() => setSideBarOpen(false)}
          quizList={quizList}
          onHomeClick={() => setView(VIEWS.HOME)}
          onAdvancedClick={() => setView(VIEWS.ADVANCED)}
          activeQuizId={activeQuiz?.id}
          isAuthenticated={isAuthenticated}
          user={user}
          onLoginClick={() => setView(VIEWS.LOGIN)}
          onLogoutClick={handleLogout}
          activeQuestion={activeQuestion}
          onEditAnswerClick={() => setShowEditModal(true)}
        />
        <div className="app-shell-inner">
          <Header
            view={view.replace(/^[a-z]+\./, "")}
            activeQuiz={activeQuiz}
            onHome={() => setView(VIEWS.HOME)}
            onMenuToggle={() => setSideBarOpen(!sideBarOpen)}
          />
          {children}
          {showEditModal && activeQuestion && (
            <EditAnswerModal
              question={activeQuestion}
              onSave={handleEditAnswer}
              onCancel={() => setShowEditModal(false)}
              loading={editModalLoading}
              error={editModalError}
            />
          )}
        </div>
      </div>
    );
  };

  const shuffleQuestions = (filteredQuestions) => {
    for (let i = filteredQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
    }
  }

  const shuffleQuestionAnswers = (filteredQuestions) => {
    filteredQuestions.forEach(q => {
      const allAnswers = [...q.answers];
      for (let i = allAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
        }
        q.answers = allAnswers;
    });
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (view === VIEWS.LOGIN) {
    return shell(
      <Login
        onLogin={handleLogin}
        onBack={() => setView(VIEWS.HOME)}
      />
    );
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
          handleAdvancedStart({ quizId: activeQuiz.id, questionIndices: currentFailedIndices, shuffle: quizConfig?.shuffle, shuffleAnswers: quizConfig?.shuffleAnswers });
        }}
        onHome={() => setView(VIEWS.HOME)}
      />
    );
  }

  return null;
}