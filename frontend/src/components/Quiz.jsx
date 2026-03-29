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
  return (
    <>
      <ProgressBar current={questionIndex + 1} total={activeQuiz.questions.length} />
      <QuizCard
        key={question.id}
        quizId={activeQuiz.id}
        question={question}
        index={questionIndex}
        total={activeQuiz.questions.length}
        onNext={handleNext}
      />
    </>
  );
}
