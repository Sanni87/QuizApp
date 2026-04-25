// src/utils/api.js
// Centralized API utilities for QuizApp

import { getCachedData, setCache } from "./cache/localStorageCache";

export const API = import.meta.env.VITE_API_URL ?? "/api";

// mientras el tiempo de la cache no llegue a este valor, se obtiene de cache sin llamar al backend
const SOFT_TTL = 5 * 60 * 60 * 1000; // 5 horas en ms

// mientras el tiempo de la cache no llegue a este valor, se obtiene de cache pero se llama al backend para refrescar la cache en segundo plano
const HARD_TTL = 7 * 24 * 60 * 60 * 1000; // 1 semana en ms

// si supera SOFT_TTL y HARD_TTL, se borra la cache y se obtiene del backend

// Fetch quiz list
export async function fetchQuizList() {
  const url = `${API}/quizzes`;
  
  let result = await getCachedData(
    url,
    () => fetchQuizListFromService(url),
    { softTtlMs: SOFT_TTL, hardTtlMs: HARD_TTL }
  );

  // Si por lo que sea el resultado no es válido
  if (!(result?.length > 0)) {
    result = await fetchQuizListFromService(url);
    await setCache(url, result, SOFT_TTL, HARD_TTL);
  }

  return result;
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

export function wakeUpBackend() {
  // Llamada simple para despertar el backend
  fetch(`${API}/quizzes`)
    .then(() => console.log("Backend despertado"))
    .catch(() => console.warn("No se pudo despertar el backend"));
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

// ── Authentication Functions ──────────────────────────────────────────────

/**
 * Save auth token to localStorage
 */
export function saveAuthToken(token) {
  localStorage.setItem("auth_token", token);
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken() {
  return localStorage.getItem("auth_token");
}

/**
 * Clear auth token from localStorage
 */
export function clearAuthToken() {
  localStorage.removeItem("auth_token");
}

/**
 * Login user with email and password
 * Returns: { user, session } on success
 * Throws: Error on failure
 */
export async function loginUser(email, password) {
  const url = `${API}/auth/login`;
  
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al iniciar sesión");
  }

  const data = await res.json();
  
  // Save token if present (assuming backend returns session.access_token or similar)
  if (data.session?.access_token) {
    saveAuthToken(data.session.access_token);
  }

  return data;
}

/**
 * Update the correct answer for a quiz question
 * Requires: answerId, authToken
 * Returns: { success: true, ...result }
 * Throws: Error on failure
 */
export async function updateCorrectAnswer(answerId, authToken) {
  const url = `${API}/quizzes/answer/${answerId}/set-correct`;
  
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al actualizar la respuesta correcta");
  }

  return res.json();
}