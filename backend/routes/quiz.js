const express = require("express");
const router = express.Router();
const { quizzes } = require("../data/mocks");

// GET /api/quizzes — list all quizzes (no answers exposed)
router.get("/", (req, res) => {
  const list = quizzes.map(({ id, title, description, questions }) => ({
    id,
    title,
    description,
    questionCount: questions.length,
  }));
  res.json(list);
});

// GET /api/quizzes/:id — get a quiz with questions (no correct answers)
router.get("/:id", (req, res) => {
  const quiz = quizzes.find((q) => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });

  const sanitized = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    questions: quiz.questions.map(({ id, text, options }) => ({
      id,
      text,
      options,
    })),
  };
  res.json(sanitized);
});

// POST /api/quizzes/:quizId/answer — check a single answer
router.post("/:quizId/answer", (req, res) => {
  const { questionId, selectedIndex } = req.body;

  if (selectedIndex === undefined || questionId === undefined) {
    return res.status(400).json({ error: "questionId and selectedIndex are required" });
  }

  const quiz = quizzes.find((q) => q.id === req.params.quizId);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });

  const question = quiz.questions.find((q) => q.id === questionId);
  if (!question) return res.status(404).json({ error: "Question not found" });

  const correct = selectedIndex === question.correctIndex;

  res.json({
    correct,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
  });
});

module.exports = router;
