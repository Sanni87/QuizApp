import "./AdvancedButton.css";

export default function AdvancedButton({ onClick }) {
  return (
    <button className="home-btn" style={{background: "darkgray"}} onClick={onClick}>
      <div className="home-btn-content">
        <div>
          <p className="home-btn-title" style={{color: "#111111"}}>⚙️ Modo Avanzado</p>
          <p className="home-btn-desc" style={{color: "#333333"}}>Elige las preguntas exactas que quieres practicar</p>
        </div>
        <span className="home-btn-count">→</span>
      </div>
    </button>
  );
}
