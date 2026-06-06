import React from "react";
import "./SideBar.css";

export default function SideBar({ isOpen, onClose, quizList, onHomeClick, onAdvancedClick, onExamModeClick, activeQuizId }) {
  return (
    <>
      {/* Overlay para cerrar el menú en móvil */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Navegación</h3>
            <button className="sidebar-link" onClick={() => { onHomeClick(); onClose(); }}>
              🏠 Inicio
            </button>
            <button className="sidebar-link" onClick={() => { onAdvancedClick(); onClose(); }}>
              ⚙️ Modo Avanzado
            </button>
            <button className="sidebar-link" onClick={() => { onExamModeClick(); onClose(); }}>
              📝 Modo examen
            </button>
          </div>

          {quizList.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">Tests Disponibles</h3>
              <ul className="sidebar-quiz-list">
                {quizList.map((quiz) => (
                  <li key={quiz.id}>
                    <button 
                      className={`sidebar-quiz-item ${activeQuizId === quiz.id ? "active" : ""}`}
                      onClick={() => { onHomeClick(); onClose(); }}
                      title={quiz.description}
                    >
                      {quiz.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
