import { describe, expect, it } from "vitest";
import { generateExamBlueprint } from "./blueprint";
import { buildQuestionBank } from "./questions";
import { selectUnseenQuestions } from "./selection";

describe("antirrepetición estructural", () => {
  it("crea dos ensayos de 65 sin reutilizar familias", () => {
    const bank = buildQuestionBank();
    const first = selectUnseenQuestions(bank, new Set(), generateExamBlueprint("primero"), "primero");
    const second = selectUnseenQuestions(bank, new Set(first.map((question) => question.id)), generateExamBlueprint("segundo"), "segundo");
    const firstFingerprints = new Set(first.map((question) => question.structuralFingerprint));
    const secondFingerprints = new Set(second.map((question) => question.structuralFingerprint));

    expect(first).toHaveLength(65);
    expect(second).toHaveLength(65);
    expect(firstFingerprints.size).toBe(65);
    expect(secondFingerprints.size).toBe(65);
    expect([...secondFingerprints].filter((fingerprint) => firstFingerprints.has(fingerprint))).toEqual([]);
    expect(new Set(second.map((question) => question.id)).size).toBe(65);
  });

  it("respeta las cuotas curriculares por unidad", () => {
    const bank = buildQuestionBank();
    const blueprint = generateExamBlueprint("cuotas");
    const selected = selectUnseenQuestions(bank, new Set(), blueprint, "cuotas");
    const selectedCounts = selected.reduce<Record<string, number>>((counts, question) => ({ ...counts, [question.unit]: (counts[question.unit] ?? 0) + 1 }), {});
    const blueprintCounts = blueprint.reduce<Record<string, number>>((counts, slot) => ({ ...counts, [slot.unit]: (counts[slot.unit] ?? 0) + 1 }), {});
    expect(selectedCounts).toEqual(blueprintCounts);
    expect(selected.map((question) => question.difficulty).toSorted()).toEqual(blueprint.map((slot) => slot.difficulty).toSorted());
  });
});
