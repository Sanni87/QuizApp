import React from "react";

export default function Header({ view, activeQuiz, onHome }) {
  return (
    <header style={{ marginBottom: "3rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span
        onClick={onHome}
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "1.1rem",
          cursor: "pointer",
          letterSpacing: "-0.02em",
        }}
      >
        QUIZ<span style={{ color: "var(--accent)" }}>.</span>
      </span>
      {view === "quiz" && activeQuiz && (
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "Syne, sans-serif" }}>
          {activeQuiz.title}
        </span>
      )}
    </header>
  );
}
