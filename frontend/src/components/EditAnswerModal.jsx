import React, { useState } from "react";
import "./EditAnswerModal.css";

export default function EditAnswerModal({ question, onSave, onCancel, loading, error }) {
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);

  const handleSave = () => {
    if (selectedAnswerId !== null) {
      onSave(selectedAnswerId);
    }
  };

  if (!question) return null;

  const answerLetters = ["A", "B", "C", "D"];

  return (
    <>
      {/* Backdrop overlay */}
      <div className="modal-overlay" onClick={onCancel}></div>

      {/* Modal */}
      <div className="edit-answer-modal">
        <div className="modal-header">
          <h2 className="modal-title">Editar Respuesta Correcta</h2>
          <button
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Cerrar modal"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-question">{question.text}</p>

          <div className="modal-answers">
            {question.answers.map((answer, idx) => (
              <label key={answer.id} className="answer-option">
                <input
                  type="radio"
                  name="correct-answer"
                  value={answer.id}
                  checked={selectedAnswerId === answer.id}
                  onChange={() => setSelectedAnswerId(answer.id)}
                  disabled={loading}
                  className="answer-radio"
                />
                <span className="answer-letter">{answerLetters[idx]}</span>
                <span className="answer-text">{answer.text}</span>
              </label>
            ))}
          </div>

          {error && (
            <div className="modal-error">
              <span>✕</span>
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="modal-cancel-btn"
            onClick={onCancel}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = "1")}
          >
            Cancelar
          </button>
          <button
            className="modal-save-btn"
            onClick={handleSave}
            disabled={loading || selectedAnswerId === null}
            onMouseEnter={(e) => !loading && selectedAnswerId !== null && (e.currentTarget.style.background = "var(--accent-dark)")}
            onMouseLeave={(e) => !loading && selectedAnswerId !== null && (e.currentTarget.style.background = "var(--accent)")}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </>
  );
}
