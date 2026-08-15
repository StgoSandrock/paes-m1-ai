import type { AnswerKey, PublicQuestion } from "./types";

export interface StoredExam { id: string; startedAt: string; submittedAt?: string; status: "ACTIVE" | "SUBMITTED"; questions: PublicQuestion[]; answers: Record<string, AnswerKey>; result?: ExamResult; }
export interface ExamResult { correct: number; incorrect: number; unanswered: number; total: number; percentage: number; rows: Array<{ id: string; axis: string; skill: string; difficulty: number; selected: AnswerKey | null; correctAnswer: AnswerKey; isCorrect: boolean; solution: string; }>; }

const key = "savia-paes-exams";
export function readExams(): StoredExam[] { if (typeof window === "undefined") return []; try { return JSON.parse(localStorage.getItem(key) ?? "[]"); } catch { return []; } }
export function saveExam(exam: StoredExam) { const exams = readExams().filter((item) => item.id !== exam.id); localStorage.setItem(key, JSON.stringify([exam, ...exams])); }
export function getExam(id: string) { return readExams().find((exam) => exam.id === id); }
