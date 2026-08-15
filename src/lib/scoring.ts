import type { AnswerKey, PublicQuestion, Question } from "./types";

export function scoreExam(questions: Question[], answers: Record<string, AnswerKey>) {
  const rows = questions.map((question) => ({
    id: question.id,
    axis: question.axis,
    skill: question.primarySkill,
    difficulty: question.difficulty,
    selected: answers[question.id] ?? null,
    correctAnswer: question.correctAnswer,
    isCorrect: answers[question.id] === question.correctAnswer,
    solution: question.solution
  }));
  const correct = rows.filter((row) => row.isCorrect).length;
  const unanswered = rows.filter((row) => !row.selected).length;
  return { correct, incorrect: rows.length - correct - unanswered, unanswered, total: rows.length, percentage: Math.round((correct / rows.length) * 100), rows };
}

export function sanitizeQuestion({ correctAnswer: _a, solution: _s, distractorReasoning: _d, structuralFingerprint: _f, ...question }: Question): PublicQuestion {
  void _a; void _s; void _d; void _f;
  return question;
}
