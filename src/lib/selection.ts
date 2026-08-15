import type { BlueprintSlot, Question } from "./types";

export function selectUnseenQuestions(bank: Question[], exposedIds: Set<string>, blueprint: BlueprintSlot[]) {
  const remaining = bank.filter((question) => !exposedIds.has(question.id));
  const used = new Set<string>();
  return blueprint.map((slot) => {
    const exact = remaining.find((question) => !used.has(question.id) && question.axis === slot.axis && question.difficulty === slot.difficulty);
    const fallback = remaining.find((question) => !used.has(question.id) && question.axis === slot.axis) ?? remaining.find((question) => !used.has(question.id));
    const selected = exact ?? fallback;
    if (!selected) return null;
    used.add(selected.id);
    return selected;
  }).filter((question): question is Question => question !== null);
}
