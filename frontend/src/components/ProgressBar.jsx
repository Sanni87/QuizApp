import React from "react";

export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "Syne, sans-serif", fontWeight: 600, letterSpacing: "0.05em" }}>
          PREGUNTA {current} DE {total}
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--accent)", fontFamily: "Syne, sans-serif", fontWeight: 700 }}>
          {pct}%
        </span>
      </div>
      <div
        style={{
          height: "3px",
          background: "var(--border)",
          borderRadius: "99px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "var(--accent)",
            borderRadius: "99px",
            transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
}
