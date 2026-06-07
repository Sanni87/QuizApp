
import React, { useState } from "react";
import "./QuizCard.css";

import { fetchQuizAnswer } from "../utils/api";

const SHOW_ANSWER_DELAY = 1000; //ms

export default function QuizCard({ quizId, question, index, total, onNext }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (optionIndex) => {
    //if (selected !== null) return;
    setSelected(optionIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selected === null) return;
    setLoading(true);

    try {
      const data = await fetchQuizAnswer(quizId, question.id, selected);
      setResult(data);
      
      setTimeout(() => {
        onNext(data.correct);
      }, SHOW_ANSWER_DELAY);
    } catch {
      setResult(null);
      setLoading(false);
    }
  };

  const getOptionClass = (idx) => {
    let cls = "quizcard-option";
    if (result) {
      if (idx === result.correctIndex) return cls + " correct";
      if (idx === selected && !result.correct) return cls + " wrong";
    }
    if (idx === selected) return cls + " selected";
    //if (selected !== null && !result) return cls + " inactive";
    return cls;
  };

  const getIcon = (idx) => {
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
            onClick={() => handleSelect(opt.id)}
          >
            {getIcon(opt.id)}
            {opt.text}
          </button>
        ))}
      </div>

      {loading && !result && (
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

      {!result && selected !== null && (
        <button
          onClick={handleSubmitAnswer}
          className="quizcard-next-btn"
          disabled={loading}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "var(--accent-dark)";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = "var(--accent)";
          }}
        >
          Comprobar →
        </button>
      )}
    </div>
  );
}
