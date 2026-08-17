import { describe, expect, it } from "vitest";
import { buildQuestionBank } from "./questions";
import { sanitizeQuestion } from "./scoring";
import { validateQuestion } from "./validation";

describe("banco original", () => {
  it("contiene 612 preguntas válidas en 153 familias", () => {
    const bank = buildQuestionBank();
    const fingerprints = new Map<string, number>();
    bank.forEach((question) => fingerprints.set(question.structuralFingerprint, (fingerprints.get(question.structuralFingerprint) ?? 0) + 1));

    expect(bank).toHaveLength(612);
    expect(new Set(bank.map((question) => question.id)).size).toBe(612);
    expect(fingerprints.size).toBe(153);
    expect([...fingerprints.values()].every((count) => count === 4)).toBe(true);
    expect(bank.filter((question) => !validateQuestion(question).valid)).toEqual([]);
    expect(new Set(bank.map((question) => question.axis)).size).toBe(4);
    expect(new Set(bank.map((question) => question.primarySkill)).size).toBe(4);
  });

  it("no filtra claves, soluciones ni huellas al cliente", () => {
    const item = sanitizeQuestion(buildQuestionBank()[0]);
    expect("correctAnswer" in item).toBe(false);
    expect("solution" in item).toBe(false);
    expect("distractorReasoning" in item).toBe(false);
    expect("structuralFingerprint" in item).toBe(false);
  });
});
