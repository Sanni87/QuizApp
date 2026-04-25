
import React from "react";
import "./Header.css";

export default function Header({ view, activeQuiz, onHome, onMenuToggle }) {
  return (
    <header className="header">
      <button className="header-menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <span
        onClick={onHome}
        className="header-title"
      >
        QUIZ<span className="header-accent">.</span>
      </span>
      {view === "quiz" && activeQuiz && (
        <span className="header-quiz-title">
          {activeQuiz.title}
        </span>
      )}
    </header>
  );
}
