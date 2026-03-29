
import React from "react";
import "./Header.css";

export default function Header({ view, activeQuiz, onHome }) {
  return (
    <header className="header">
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
