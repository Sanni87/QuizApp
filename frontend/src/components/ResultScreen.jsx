
import React from "react";
import "./ResultScreen.css";

export default function ResultScreen({ score, total, onRestart, onHome }) {
  const pct = Math.round((score / total) * 100);

  const getMessage = () => {
    if (pct === 100) return { text: "Perfecto.", sub: "Sin un solo fallo. Impecable." };
    if (pct >= 80)  return { text: "Muy bien.", sub: "Dominas el tema a un nivel alto." };
    if (pct >= 60)  return { text: "Bien.", sub: "Sólido, pero hay margen de mejora." };
    if (pct >= 40)  return { text: "Regular.", sub: "Repasa los conceptos y vuelve a intentarlo." };
    return          { text: "A repasar.", sub: "No pasa nada, para eso están los tests." };
  };

  const { text, sub } = getMessage();

  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="resultscreen-container">
      <svg width="140" height="140" viewBox="0 0 140 140" className="resultscreen-svg">
        <circle cx="70" cy="70" r="52" fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx="70" cy="70" r="52"
          fill="none"
          stroke={pct >= 60 ? "var(--correct)" : pct >= 40 ? "var(--accent)" : "var(--wrong)"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <text
          x="70" y="66"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontFamily: "Syne, sans-serif", fontSize: "2rem", fontWeight: 800, fill: "var(--text)" }}
        >
          {score}
        </text>
        <text
          x="70" y="90"
          textAnchor="middle"
          style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", fill: "var(--text-muted)" }}
        >
          de {total}
        </text>
      </svg>

      <h2 className="resultscreen-title">
        {text}
      </h2>
      <p className="resultscreen-sub">{sub}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <button
          onClick={onRestart}
          className="resultscreen-btn primary"
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dark)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
        >
          Repetir test
        </button>
        <button
          onClick={onHome}
          className="resultscreen-btn secondary"
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-muted)"; e.currentTarget.style.color = "var(--text)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          Volver a los tests
        </button>
      </div>
    </div>
  );
}
