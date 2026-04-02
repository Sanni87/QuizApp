// src/utils/api.js
// Centralized API utilities for QuizApp

import { getCachedData } from "./cache/localStorageCache";

export const API = import.meta.env.VITE_API_URL ?? "/api";

// mientras el tiempo de la cache no llegue a este valor, se obtiene de cache sin llamar al backend
const SOFT_TTL = 5 * 60 * 60 * 1000; // 5 horas en ms

// mientras el tiempo de la cache no llegue a este valor, se obtiene de cache pero se llama al backend para refrescar la cache en segundo plano
const HARD_TTL = 7 * 24 * 60 * 60 * 1000; // 1 semana en ms

// si supera SOFT_TTL y HARD_TTL, se borra la cache y se obtiene del backend

// Fetch quiz list
export function fetchQuizList() {
  const url = `${API}/quizzes`;
  return getCachedData(
    url,
    () => fetchQuizListFromService(url),
    { softTtlMs: SOFT_TTL, hardTtlMs: HARD_TTL }
  );
}

// Fetch quiz by ID
export function fetchQuizById(id) {
  const url = `${API}/quizzes/${id}`;
  return getCachedData(
    url,
    () => fetchQuizByIdFromService(url),
    { softTtlMs: SOFT_TTL, hardTtlMs: HARD_TTL }
  );
}

// Fetch quiz answer
export function fetchQuizAnswer(quizId, questionId, selectedIndex) {
  const key = `${quizId}-${questionId}-${selectedIndex}`;
  return getCachedData(
    key,
    () => fetchQuizAnswerFromService(`${API}/quizzes/${quizId}/answer`, { questionId, selectedIndex }),
    { softTtlMs: SOFT_TTL, hardTtlMs: HARD_TTL }
  );
}


//#region private functions

const fetchQuizListFromService = async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("No se pudo cargar los tests. ¿Está el backend corriendo?");
      return res.json();
};

const fetchQuizByIdFromService = async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error cargando el quiz. Intenta de nuevo.");
      return res.json();
};

const fetchQuizAnswerFromService = async (url, body) => {
      const res = await fetch(url, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Error comprobando la respuesta.");
      return res.json();
};

//#endregion private functions