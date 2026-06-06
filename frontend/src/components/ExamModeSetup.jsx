import { useState, useEffect } from "react";
import "./ExamModeSetup.css";

import { fetchQuizById } from "../utils/api";

const DEFAULT_FIRST_QUIZ_ID = "osakidetza-tel-2026";
const DEFAULT_SECOND_QUIZ_ID = "osakidetza-comun";

export default function ExamModeSetup({ quizList, onStart, onBack }) {
  // First quiz
  const [quizId1, setQuizId1] = useState("");
  const [questionCount1, setQuestionCount1] = useState(88);
  const [totalQuestions1, setTotalQuestions1] = useState(0);
  const [loading1, setLoading1] = useState(false);

  // Second quiz
  const [quizId2, setQuizId2] = useState("");
  const [questionCount2, setQuestionCount2] = useState(22);
  const [totalQuestions2, setTotalQuestions2] = useState(0);
  const [loading2, setLoading2] = useState(false);

  // Options
  const [shuffle, setShuffle] = useState(true);
  const [shuffleAnswers, setShuffleAnswers] = useState(false);

  const [error, setError] = useState("");

  // Load first quiz when selected
  useEffect(() => {
    if (!quizId1) {
      setTotalQuestions1(0);
      return;
    }
    setLoading1(true);
    fetchQuizById(quizId1)
      .then((data) => {
        const total = data.questions?.length ?? 0;
        setTotalQuestions1(total);
        setQuestionCount1(Math.min(88, total));
      })
      .catch(() => setError("No se pudieron cargar las preguntas del primer test."))
      .finally(() => setLoading1(false));
  }, [quizId1]);

  // Load second quiz when selected
  useEffect(() => {
    if (!quizId2) {
      setTotalQuestions2(0);
      return;
    }
    setLoading2(true);
    fetchQuizById(quizId2)
      .then((data) => {
        const total = data.questions?.length ?? 0;
        setTotalQuestions2(total);
        setQuestionCount2(Math.min(22, total));
      })
      .catch(() => setError("No se pudieron cargar las preguntas del segundo test."))
      .finally(() => setLoading2(false));
  }, [quizId2]);

  function handleStart() {
    setError("");

    if (!quizId1) {
      setError("Por favor, selecciona el primer test.");
      return;
    }

    if (!quizId2) {
      setError("Por favor, selecciona el segundo test.");
      return;
    }

    if (questionCount1 < 1 || questionCount1 > totalQuestions1) {
      setError(
        `El número de preguntas del primer test debe estar entre 1 y ${totalQuestions1}.`
      );
      return;
    }

    if (questionCount2 < 1 || questionCount2 > totalQuestions2) {
      setError(
        `El número de preguntas del segundo test debe estar entre 1 y ${totalQuestions2}.`
      );
      return;
    }

    onStart({
      quizId1,
      questionCount1,
      quizId2,
      questionCount2,
      shuffle,
      shuffleAnswers,
    });
  }

  return (
    <div className="exam-mode-setup">
      <button className="exam-mode-setup__back" onClick={onBack}>
        ← Volver
      </button>

      <h1 className="exam-mode-setup__title">Modo Examen</h1>
      <p className="exam-mode-setup__subtitle">
        Combina dos tests en una única sesión
      </p>

      {error && <p className="exam-mode-setup__error">{error}</p>}

      {/* First quiz row */}
      <div className="exam-mode-setup__row">
        <div className="exam-mode-setup__field">
          <label className="exam-mode-setup__label" htmlFor="quiz1-select">
            Primer Test
          </label>
          <select
            id="quiz1-select"
            className="exam-mode-setup__select"
            value={quizId1}
            onChange={(e) => {
              setQuizId1(e.target.value);
              setError("");
            }}
          >
            <option value="">— Elige un test —</option>
            {quizList.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>

        <div className="exam-mode-setup__field">
          <label className="exam-mode-setup__label" htmlFor="count1-input">
            Preguntas
          </label>
          <input
            id="count1-input"
            type="number"
            className="exam-mode-setup__input"
            min={1}
            max={totalQuestions1 || 88}
            value={questionCount1}
            onChange={(e) => setQuestionCount1(Number(e.target.value))}
            disabled={!quizId1 || loading1}
          />
        </div>
      </div>

      {quizId1 && totalQuestions1 > 0 && (
        <p className="exam-mode-setup__info">
          Disponibles: <strong>{totalQuestions1}</strong> preguntas
        </p>
      )}

      {/* Second quiz row */}
      <div className="exam-mode-setup__row">
        <div className="exam-mode-setup__field">
          <label className="exam-mode-setup__label" htmlFor="quiz2-select">
            Segundo Test
          </label>
          <select
            id="quiz2-select"
            className="exam-mode-setup__select"
            value={quizId2}
            onChange={(e) => {
              setQuizId2(e.target.value);
              setError("");
            }}
          >
            <option value="">— Elige un test —</option>
            {quizList.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>

        <div className="exam-mode-setup__field">
          <label className="exam-mode-setup__label" htmlFor="count2-input">
            Preguntas
          </label>
          <input
            id="count2-input"
            type="number"
            className="exam-mode-setup__input"
            min={1}
            max={totalQuestions2 || 22}
            value={questionCount2}
            onChange={(e) => setQuestionCount2(Number(e.target.value))}
            disabled={!quizId2 || loading2}
          />
        </div>
      </div>

      {quizId2 && totalQuestions2 > 0 && (
        <p className="exam-mode-setup__info">
          Disponibles: <strong>{totalQuestions2}</strong> preguntas
        </p>
      )}

      {/* Checkboxes */}
      <div className="exam-mode-setup__shuffle">
        <label className="exam-mode-setup__label" htmlFor="shuffle">
          <input
            id="shuffle"
            type="checkbox"
            className="exam-mode-setup__checkbox"
            checked={shuffle}
            onChange={(e) => setShuffle(e.target.checked)}
          />
          Mezclar preguntas
        </label>
      </div>

      <div className="exam-mode-setup__shuffle">
        <label className="exam-mode-setup__label" htmlFor="shuffle-answers">
          <input
            id="shuffle-answers"
            type="checkbox"
            className="exam-mode-setup__checkbox"
            checked={shuffleAnswers}
            onChange={(e) => setShuffleAnswers(e.target.checked)}
          />
          Mezclar respuestas
        </label>
      </div>

      {/* Start button */}
      <button className="exam-mode-setup__start" onClick={handleStart}>
        Iniciar test
      </button>
    </div>
  );
}
