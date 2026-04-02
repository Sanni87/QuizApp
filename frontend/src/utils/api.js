// src/utils/api.js
// Centralized API utilities for QuizApp

export const API = import.meta.env.VITE_API_URL ?? "/api";

// Fetch quiz list
export async function fetchQuizList() {
  const res = await fetch(`${API}/quizzes`);
  if (!res.ok) throw new Error("No se pudo cargar los tests. ¿Está el backend corriendo?");
  return res.json();
}

// Fetch quiz by ID
export async function fetchQuizById(id) {
  const res = await fetch(`${API}/quizzes/${id}`);
  if (!res.ok) throw new Error("Error cargando el quiz. Intenta de nuevo.");
  return res.json();
}

// Fetch quiz answer
export async function fetchQuizAnswer(quizId, questionId, selectedIndex) {
  const res = await fetch(`${API}/quizzes/${quizId}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, selectedIndex }),
  });
  if (!res.ok) throw new Error("Error comprobando la respuesta.");
  return res.json();
}
