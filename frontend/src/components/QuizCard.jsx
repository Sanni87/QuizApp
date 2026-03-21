import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "/api";

export default function QuizCard({ quizId, question, index, total, onNext }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setLoading(true);

    try {
      const res = await fetch(`${API}/quizzes/${quizId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, selectedIndex: optionIndex }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getOptionStyle = (idx) => {
    const base = {
      width: "100%",
      textAlign: "left",
      padding: "1rem 1.25rem",
      borderRadius: "var(--radius-sm)",
      border: "1.5px solid var(--border)",
      background: "var(--bg2)",
      color: "var(--text)",
      fontSize: "0.95rem",
      lineHeight: 1.5,
      cursor: selected !== null ? "default" : "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      fontFamily: "'DM Sans', sans-serif",
    };

    if (selected === null) {
      return {
        ...base,
        ":hover": { borderColor: "var(--accent)" },
      };
    }

    if (result) {
      if (idx === result.correctIndex) {
        return { ...base, border: "1.5px solid var(--correct)", background: "var(--correct-bg)", color: "var(--correct)" };
      }
      if (idx === selected && !result.correct) {
        return { ...base, border: "1.5px solid var(--wrong)", background: "var(--wrong-bg)", color: "var(--wrong)" };
      }
    }

    if (idx === selected) {
      return { ...base, border: "1.5px solid var(--accent)", opacity: 0.6 };
    }

    return { ...base, opacity: 0.4 };
  };

  const getIcon = (idx) => {
    if (!result || selected === null) {
      const letters = ["A", "B", "C", "D"];
      return (
        <span style={{
          minWidth: "1.6rem",
          height: "1.6rem",
          borderRadius: "50%",
          border: "1.5px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          color: "var(--text-muted)",
        }}>
          {letters[idx]}
        </span>
      );
    }
    if (idx === result.correctIndex) return <span style={{ minWidth: "1.6rem", textAlign: "center" }}>✓</span>;
    if (idx === selected && !result.correct) return <span style={{ minWidth: "1.6rem", textAlign: "center" }}>✗</span>;
    const letters = ["A", "B", "C", "D"];
    return (
      <span style={{
        minWidth: "1.6rem",
        height: "1.6rem",
        borderRadius: "50%",
        border: "1.5px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.75rem",
        fontFamily: "Syne, sans-serif",
        fontWeight: 700,
        color: "var(--text-muted)",
        opacity: 0.4,
      }}>
        {letters[idx]}
      </span>
    );
  };

  return (
    <div style={{ animation: "fadeUp 0.35s ease both" }}>
      <p style={{
        fontSize: "1.15rem",
        fontWeight: 500,
        marginBottom: "1.5rem",
        lineHeight: 1.55,
        color: "var(--text)",
      }}>
        {question.text}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            style={getOptionStyle(idx)}
            onClick={() => handleSelect(idx)}
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
            {getIcon(idx)}
            {opt}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Comprobando...
        </div>
      )}

      {result && (
        <div style={{
          marginTop: "1.25rem",
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-sm)",
          border: `1.5px solid ${result.correct ? "var(--correct)" : "var(--wrong)"}`,
          background: result.correct ? "var(--correct-bg)" : "var(--wrong-bg)",
          animation: "fadeUp 0.3s ease both",
        }}>
          <p style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: result.correct ? "var(--correct)" : "var(--wrong)",
            marginBottom: "0.4rem",
            letterSpacing: "0.04em",
          }}>
            {result.correct ? "✓ CORRECTO" : "✗ INCORRECTO"}
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
            {result.explanation}
          </p>
        </div>
      )}

      {result && (
        <button
          onClick={onNext}
          style={{
            marginTop: "1.25rem",
            width: "100%",
            padding: "0.9rem",
            background: "var(--accent)",
            color: "#0e0e0f",
            borderRadius: "var(--radius-sm)",
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            letterSpacing: "0.03em",
            transition: "background 0.2s",
            animation: "fadeUp 0.3s 0.1s ease both",
            opacity: 0,
            animationFillMode: "forwards",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
        >
          {index + 1 < total ? "Siguiente pregunta →" : "Ver resultados →"}
        </button>
      )}
    </div>
  );
}
