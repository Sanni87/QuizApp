import React from "react";

export default function Home({ quizList, loadingQuiz, error, startQuiz }) {
  return (
    <>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "clamp(2rem, 6vw, 3rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: "0.75rem",
          letterSpacing: "-0.03em",
        }}>
          Pon a prueba<br />
          <span style={{ color: "var(--accent)" }}>lo que sabes.</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Elige un test y obtén feedback inmediato en cada respuesta.
        </p>
      </div>

      {error && (
        <div style={{
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-sm)",
          border: "1.5px solid var(--wrong)",
          background: "var(--wrong-bg)",
          color: "var(--wrong)",
          marginBottom: "1.5rem",
          fontSize: "0.9rem",
        }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {quizList.length === 0 && !error && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Cargando tests...</p>
        )}
        {quizList.map((quiz) => (
          <button
            key={quiz.id}
            onClick={() => startQuiz(quiz.id)}
            disabled={loadingQuiz}
            style={{
              textAlign: "left",
              padding: "1.25rem 1.5rem",
              borderRadius: "var(--radius)",
              border: "1.5px solid var(--border)",
              background: "var(--bg2)",
              color: "var(--text)",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.background = "var(--bg3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "var(--bg2)";
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1rem",
            }}>
              <div>
                <p style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  marginBottom: "0.3rem",
                }}>
                  {quiz.title}
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {quiz.description}
                </p>
              </div>
              <span style={{
                minWidth: "fit-content",
                padding: "0.25rem 0.6rem",
                borderRadius: "99px",
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                fontSize: "0.75rem",
                fontFamily: "Syne, sans-serif",
                fontWeight: 600,
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
              }}>
                {quiz.questionCount} preg.
              </span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
