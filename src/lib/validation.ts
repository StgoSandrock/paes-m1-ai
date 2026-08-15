import type { Question } from "./types";

export function validateQuestion(question: Question) {
  const values = Object.values(question.options);
  const errors: string[] = [];
  if (values.length !== 4 || new Set(values).size !== 4) errors.push("Las alternativas deben ser cuatro y distintas.");
  if (!question.solution.trim()) errors.push("Falta solución matemática.");
  if (!question.structuralFingerprint.trim()) errors.push("Falta huella estructural.");
  return { valid: errors.length === 0, errors };
}
