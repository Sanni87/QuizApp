import React from "react";
import ProgressBar from "./ProgressBar";
import QuizCard from "./QuizCard";

export default function Quiz({
  activeQuiz,
  questionIndex,
  handleNext
}) {
  if (!activeQuiz) return null;
  const question = activeQuiz.questions[questionIndex];
  const quizId = question.quizSource ?? activeQuiz.id; //cuando mezclamos preguntas de varios tests, cada pregunta tiene su quizSource para saber de dónde viene.
  return (
    <>
      <ProgressBar current={questionIndex + 1} total={activeQuiz.questions.length} />
      <QuizCard
        key={question.id}
        quizId={quizId}
        question={question}
        index={questionIndex}
        total={activeQuiz.questions.length}
        onNext={handleNext}
      />
    </>
  );
}
