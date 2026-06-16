import { useState, useEffect } from "react";
import ResultScreen from "./components/ResultScreen";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Header from "./components/Header";
import AdvancedSetup from "./components/AdvancedSetup";
import ExamModeSetup from "./components/ExamModeSetup";
import SideBar from "./components/SideBar";
import "./App.css";

import { fetchQuizList, fetchQuizById } from "./utils/api";

const VIEWS = { HOME: "home", QUIZ: "quiz", RESULT: "result", ADVANCED: "advanced", EXAM_MODE: "exam_mode" };

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
  const [sideBarOpen, setSideBarOpen] = useState(false);

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

    const handleExamModeStart = async ({ quizId1, questionCount1, quizId2, questionCount2, shuffle, shuffleAnswers, failedQuestions }) => {
    setLoadingQuiz(true);
    setError(null);
    try {
      const quiz1 = await fetchQuizById(quizId1);
      const quiz2 = await fetchQuizById(quizId2);

      // Determine questions to use
      let combinedQuestions;
      
      if (failedQuestions) {
        // Retry mode: use only the failed questions
        combinedQuestions = [...failedQuestions];
      } else {
        // Normal mode: extract random questions from both quizzes
        const shuffledQuiz1 = getRandomElements(quiz1.questions, questionCount1);
        const questions1 = shuffledQuiz1
          .map((q, i) => ({ ...q, originalIndex: i + 1, quizSource: quizId1 }));

        const shuffledQuiz2 = getRandomElements(quiz2.questions, questionCount2);
        const questions2 = shuffledQuiz2
          .map((q, i) => ({ ...q, originalIndex: i + 1, quizSource: quizId2 }));

        // Combine questions
        combinedQuestions = [...questions1, ...questions2];
      }

      if (shuffle) {
        shuffleQuestions(combinedQuestions);
      }

      if (shuffleAnswers) {
        shuffleQuestionAnswers(combinedQuestions);
      }

      // Use first quiz as base for the combined quiz object
      const combinedQuiz = {
        ...quiz1,
        title: `${quiz1.title} + ${quiz2.title}`,
        questions: combinedQuestions,
      };

      setActiveQuiz(combinedQuiz);
      setQuizConfig({
        examMode: true,
        quizId1,
        questionCount1,
        quizId2,
        questionCount2,
        shuffle,
        shuffleAnswers,
      });
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

  const shell = (children) => (
    <div className="app-shell">
      <SideBar
        isOpen={sideBarOpen}
        onClose={() => setSideBarOpen(false)}
        quizList={quizList}
        onHomeClick={() => setView(VIEWS.HOME)}
        onAdvancedClick={() => setView(VIEWS.ADVANCED)}
        onExamModeClick={() => setView(VIEWS.EXAM_MODE)}
        activeQuizId={activeQuiz?.id}
      />
      <div className="app-shell-inner">
        <Header
          view={view.replace(/^[a-z]+\./, "")}
          activeQuiz={activeQuiz}
          onHome={() => setView(VIEWS.HOME)}
          onMenuToggle={() => setSideBarOpen(!sideBarOpen)}
        />
        {children}
      </div>
    </div>
  );

  const getRandomElements = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const shuffleQuestions = (filteredQuestions) => {
    for (let i = filteredQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
    }
    return filteredQuestions;
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

  // ── EXAM MODE ─────────────────────────────────────────────────────────────
  if (view === VIEWS.EXAM_MODE) {
    return shell(
      <ExamModeSetup
        quizList={quizList}
        onStart={handleExamModeStart}
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
          onExamModeClick={() => setView(VIEWS.EXAM_MODE)}
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
        onRestart={() => {
          if (quizConfig?.examMode) {
            handleExamModeStart(quizConfig);
          } else if (quizConfig) {
            handleAdvancedStart(quizConfig);
          } else {
            startQuiz(activeQuiz.id);
          }
        }}
        onRetryFailed={() => {
          if (quizConfig?.examMode) {
            // For exam mode, collect failed questions and retry them
            const failedQuestions = activeQuiz.questions
              .filter(q => currentFailedIndices.includes(q.originalIndex))
              .map((q, i) => ({ ...q, originalIndex: i + 1 }));
            handleExamModeStart({ ...quizConfig, failedQuestions });
          } else {
            handleAdvancedStart({ quizId: activeQuiz.id, questionIndices: currentFailedIndices, shuffle: quizConfig?.shuffle, shuffleAnswers: quizConfig?.shuffleAnswers });
          }
        }}
        onHome={() => setView(VIEWS.HOME)}
      />
    );
  }

  return null;
}