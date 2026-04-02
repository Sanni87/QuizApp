import { useState, useEffect } from "react";
import "./AdvancedSetup.css";

import { fetchQuizById } from "../utils/api";

export default function AdvancedSetup({ quizList, onStart, onBack }) {
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [mode, setMode] = useState("range"); // "range" | "exact"

  // Range mode
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(1);

  // Exact mode
  const [exactInput, setExactInput] = useState("");
  const [exactError, setExactError] = useState("");

  //Shuffle
  const [shuffle, setShuffle] = useState(false);

  //Shuffle answers
  const [shuffleAnswers, setShuffleAnswers] = useState(false);

  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedQuizId) return;
    setLoadingQuiz(true);
    fetchQuizById(selectedQuizId)
      .then((data) => {
        const total = data.questions?.length ?? 0;
        setTotalQuestions(total);
        setRangeFrom(1);
        setRangeTo(total);
        setExactInput("");
        setExactError("");
      })
      .catch(() => setError("No se pudieron cargar las preguntas del test."))
      .finally(() => setLoadingQuiz(false));
  }, [selectedQuizId]);

  function parseExactInput(input, total) {
    const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
    const numbers = parts.map(Number);
    if (numbers.some(isNaN)) return null;
    if (numbers.some((n) => n < 1 || n > total)) return null;
    if (new Set(numbers).size !== numbers.length) return null;
    return numbers.sort((a, b) => a - b);
  }

  function handleStart() {
    if (!selectedQuizId) {
      setError("Por favor, selecciona un test.");
      return;
    }

    let questionIndices = [];

    if (mode === "range") {
      if (rangeFrom < 1 || rangeTo > totalQuestions || rangeFrom > rangeTo) {
        setError("El rango de preguntas no es válido.");
        return;
      }
      for (let i = rangeFrom; i <= rangeTo; i++) {
        questionIndices.push(i);
      }
    } else {
      const parsed = parseExactInput(exactInput, totalQuestions);
      if (!parsed || parsed.length === 0) {
        setExactError(
          `Introduce números válidos entre 1 y ${totalQuestions}, separados por comas y sin repetir.`
        );
        return;
      }
      questionIndices = parsed;
    }

    setError("");
    setExactError("");
    onStart({ quizId: selectedQuizId, questionIndices, shuffle, shuffleAnswers });
  }

  function handleExactChange(e) {
    setExactInput(e.target.value);
    setExactError("");
  }

  return (
    <div className="advanced-setup">
      <button className="advanced-setup__back" onClick={onBack}>
        ← Volver
      </button>

      <h1 className="advanced-setup__title">Modo Avanzado</h1>
      <p className="advanced-setup__subtitle">
        Personaliza qué preguntas quieres responder
      </p>

      {error && <p className="advanced-setup__error">{error}</p>}

      {/* Selector de test */}
      <div className="advanced-setup__field">
        <label className="advanced-setup__label" htmlFor="quiz-select">
          Test
        </label>
        <select
          id="quiz-select"
          className="advanced-setup__select"
          value={selectedQuizId}
          onChange={(e) => {
            setSelectedQuizId(e.target.value);
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

      {selectedQuizId && !loadingQuiz && totalQuestions > 0 && (
        <>
          <p className="advanced-setup__total">
            Este test tiene <strong>{totalQuestions}</strong> preguntas.
          </p>

          {/* Selector de modo */}
          <div className="advanced-setup__mode-tabs">
            <button
              className={`advanced-setup__mode-tab ${mode === "range" ? "advanced-setup__mode-tab--active" : ""}`}
              onClick={() => setMode("range")}
            >
              Rango de preguntas
            </button>
            <button
              className={`advanced-setup__mode-tab ${mode === "exact" ? "advanced-setup__mode-tab--active" : ""}`}
              onClick={() => setMode("exact")}
            >
              Preguntas exactas
            </button>
          </div>

          {/* Modo rango */}
          {mode === "range" && (
            <div className="advanced-setup__range">
              <div className="advanced-setup__field">
                <label className="advanced-setup__label" htmlFor="range-from">
                  Desde la pregunta
                </label>
                <input
                  id="range-from"
                  type="number"
                  className="advanced-setup__input"
                  min={1}
                  max={totalQuestions}
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(Number(e.target.value))}
                />
              </div>
              <div className="advanced-setup__field">
                <label className="advanced-setup__label" htmlFor="range-to">
                  Hasta la pregunta
                </label>
                <input
                  id="range-to"
                  type="number"
                  className="advanced-setup__input"
                  min={1}
                  max={totalQuestions}
                  value={rangeTo}
                  onChange={(e) => setRangeTo(Number(e.target.value))}
                />
              </div>
              <p className="advanced-setup__range-info">
                Se responderán{" "}
                <strong>
                  {rangeFrom <= rangeTo ? rangeTo - rangeFrom + 1 : 0}
                </strong>{" "}
                preguntas.
              </p>
            </div>
          )}

          {/* Modo exacto */}
          {mode === "exact" && (
            <div className="advanced-setup__exact">
              <div className="advanced-setup__field">
                <label className="advanced-setup__label" htmlFor="exact-input">
                  Números de pregunta (separados por coma)
                </label>
                <input
                  id="exact-input"
                  type="text"
                  className={`advanced-setup__input ${exactError ? "advanced-setup__input--error" : ""}`}
                  placeholder={`Ej.: 2, 6, 7`}
                  value={exactInput}
                  onChange={handleExactChange}
                />
                {exactError && (
                  <p className="advanced-setup__field-error">{exactError}</p>
                )}
              </div>
            </div>
          )}

          <div className="advanced-setup__shuffle">
            <label className="advanced-setup__label" htmlFor="shuffle">
              <input
                id="shuffle"
                type="checkbox"
                className="advanced-setup__checkbox"
                checked={shuffle}
                onChange={(e) => setShuffle(e.target.checked)}
              />
              Mezclar preguntas
            </label>
          </div>

          <div className="advanced-setup__shuffle">
            <label className="advanced-setup__label" htmlFor="shuffle-answers">
              <input
                id="shuffle-answers"
                type="checkbox"
                className="advanced-setup__checkbox"
                checked={shuffleAnswers}
                onChange={(e) => setShuffleAnswers(e.target.checked)}
              />
              Mezclar respuestas
            </label>
          </div>

          <button className="advanced-setup__start" onClick={handleStart}>
            Iniciar test
          </button>
        </>
      )}

      {loadingQuiz && (
        <p className="advanced-setup__loading">Cargando preguntas…</p>
      )}
    </div>
  );
}
