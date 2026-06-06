import "./Home.css";
import AdvancedButton from "./AdvancedButton";
import ExamModeButton from "./ExamModeButton";

export default function Home({ quizList, loadingQuiz, error, startQuiz, onAdvancedClick, onExamModeClick }) {
  return (
    <>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 className="home-title">
          Pon a prueba<br />
          <span className="home-title-accent">lo que sabes.</span>
        </h1>
        <p className="home-desc">
          Elige un test y obtén feedback inmediato en cada respuesta.
        </p>
      </div>

      {error && (
        <div className="home-error">{error}</div>
      )}

      <div className="home-list">
        {!error && (
          <>
            <AdvancedButton onClick={() => onAdvancedClick()} />
            <ExamModeButton onClick={() => onExamModeClick()} />
          </>
        )}

        {quizList.length === 0 && !error && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Cargando tests...</p>
        )}
        {quizList.map((quiz) => (
          <button
            key={quiz.id}
            onClick={() => startQuiz(quiz.id)}
            disabled={loadingQuiz}
            className="home-btn"
          >
            <div className="home-btn-content">
              <div>
                <p className="home-btn-title">{quiz.title}</p>
                <p className="home-btn-desc">{quiz.description}</p>
              </div>
              <span className="home-btn-count">{quiz.questionCount} preg.</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
