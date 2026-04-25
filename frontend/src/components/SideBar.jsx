import React from "react";
import "./SideBar.css";

export default function SideBar({
  isOpen,
  onClose,
  quizList,
  onHomeClick,
  onAdvancedClick,
  activeQuizId,
  isAuthenticated,
  user,
  onLoginClick,
  onLogoutClick,
  activeQuestion,
  onEditAnswerClick,
}) {
  return (
    <>
      {/* Overlay para cerrar el menú en móvil */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <nav className="sidebar-nav">
          {/* Authentication Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Autenticación</h3>
            {!isAuthenticated ? (
              <button className="sidebar-link sidebar-link-auth" onClick={() => { onLoginClick(); onClose(); }}>
                🔐 Iniciar Sesión
              </button>
            ) : (
              <>
                <div className="sidebar-user-info">
                  <span className="sidebar-user-email">👤 {user?.email}</span>
                </div>
                <button className="sidebar-link sidebar-link-logout" onClick={() => { onLogoutClick(); onClose(); }}>
                  🚪 Cerrar Sesión
                </button>
              </>
            )}
          </div>

          {/* Edit Answer Section - Only visible if authenticated and viewing a question */}
          {isAuthenticated && activeQuestion && (
            <div className="sidebar-section sidebar-section-edit">
              <h3 className="sidebar-title">Editar Quiz</h3>
              <button className="sidebar-link sidebar-link-edit" onClick={() => { onEditAnswerClick(); onClose(); }}>
                ✏️ Cambiar Respuesta Correcta
              </button>
            </div>
          )}

          {/* Navigation Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Navegación</h3>
            <button className="sidebar-link" onClick={() => { onHomeClick(); onClose(); }}>
              🏠 Inicio
            </button>
            <button className="sidebar-link" onClick={() => { onAdvancedClick(); onClose(); }}>
              ⚙️ Modo Avanzado
            </button>
          </div>

          {/* Available Quizzes Section */}
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
