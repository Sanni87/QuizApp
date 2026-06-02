
import React, { useState, useRef } from "react";
import "./QuizCard.css";

import { fetchQuizAnswer } from "../utils/api";

const ANSWER_DELAY = 1500; // tiempo de retraso para mostrar la respuesta

export default function QuizCard({ quizId, question, index, total, onNext }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [waitingOptionId, setWaitingOptionId] = useState(null);
  const timeoutRef = useRef(null);

  const handleSelectWithDelay = (optionIndex) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setWaitingOptionId(optionIndex);
    timeoutRef.current = setTimeout(() => {
      setWaitingOptionId(null);
      handleSelect(optionIndex);
    }, ANSWER_DELAY);
  };

  const handleSelect = async (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setLoading(true);

    try {
      const data = await fetchQuizAnswer(quizId, question.id, optionIndex);
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getOptionClass = (idx) => {
    let cls = "quizcard-option";
    if (waitingOptionId === idx) return cls + " waiting";
    if (result) {
      if (idx === result.correctIndex) return cls + " correct";
      if (idx === selected && !result.correct) return cls + " wrong";
    }
    if (idx === selected) return cls + " selected";
    if (selected !== null) return cls + " inactive";
    return cls;
  };

  const getIcon = (idx) => {
    if (idx === waitingOptionId) return <span className="quizcard-icon">⏳</span>;
    if (!result || selected === null) {
      const letters = ["A", "B", "C", "D"];
      return (
        <span className="quizcard-icon">{letters[idx]}</span>
      );
    }
    if (idx === result.correctIndex) return <span className="quizcard-icon">✓</span>;
    if (idx === selected && !result.correct) return <span className="quizcard-icon">✗</span>;
    const letters = ["A", "B", "C", "D"];
    return (
      <span className="quizcard-icon" style={{ opacity: 0.4 }}>{letters[idx]}</span>
    );
  };

  return (
    <div style={{ animation: "fadeUp 0.35s ease both" }}>
      <p className="quizcard-question">{question.text}</p>

      <div className="quizcard-options">
        {question.answers.map((opt, idx) => (
          <button
            key={opt.id}
            className={getOptionClass(opt.id)}
            onClick={() => handleSelectWithDelay(opt.id)}
            onMouseEnter={(e) => {
              if (selected === null) {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "var(--bg3)";
              }
            }}
            onMouseLeave={(e) => {
              if (selected === null) {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--bg2)";
              }
            }}
          >
            {getIcon(opt.id)}
            {opt.text}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Comprobando...
        </div>
      )}

      {result && (
        <div className={`quizcard-feedback${result.correct ? '' : ' wrong'}`}>
          <p className="quizcard-feedback-title" style={{ color: result.correct ? "var(--correct)" : "var(--wrong)" }}>
            {result.correct ? "✓ CORRECTO" : "✗ INCORRECTO"}
          </p>
          <p className="quizcard-feedback-text">
            {result.explanation}
          </p>
        </div>
      )}

      {result && (
        <button
          onClick={() => onNext(result?.correct)}
          className="quizcard-next-btn"
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
        >
          {index + 1 < total ? "Siguiente pregunta →" : "Ver resultados →"}
        </button>
      )}
    </div>
  );
}
