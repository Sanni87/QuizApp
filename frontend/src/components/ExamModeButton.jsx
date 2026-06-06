import "./ExamModeButton.css";

export default function ExamModeButton({ onClick }) {
  return (
    <button className="exam-mode-button" onClick={onClick}>
      <div className="exam-mode-button__content">
        <div>
          <p className="exam-mode-button__title">📝 Modo examen</p>
          <p className="exam-mode-button__desc">Contesta preguntas de varios temas combinados</p>
        </div>
        <span className="exam-mode-button__arrow">→</span>
      </div>
    </button>
  );
}
