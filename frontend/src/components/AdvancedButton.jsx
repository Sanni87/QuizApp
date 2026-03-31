import "./AdvancedButton.css";

export default function AdvancedButton({ onClick }) {
  return (
    <button className="advanced-button" onClick={onClick}>
      <div className="advanced-button__content">
        <div>
          <p className="advanced-button__title">⚙️ Modo Avanzado</p>
          <p className="advanced-button__desc">Elige las preguntas exactas que quieres practicar</p>
        </div>
        <span className="advanced-button__arrow">→</span>
      </div>
    </button>
  );
}
