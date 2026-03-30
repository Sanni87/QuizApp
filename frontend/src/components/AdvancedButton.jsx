import "./AdvancedButton.css";

export default function AdvancedButton({ onClick }) {
  return (
    <button className="advanced-button" onClick={onClick}>
      <span className="advanced-button__icon">⚙️</span>
      <span className="advanced-button__text">
        <strong>Modo Avanzado</strong>
        <small>Elige las preguntas exactas que quieres practicar</small>
      </span>
      <span className="advanced-button__arrow">→</span>
    </button>
  );
}
