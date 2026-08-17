import type { BlueprintSlot, Question } from "./types";

function seededNoise(value: string) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

export function selectUnseenQuestions(
  bank: Question[],
  exposedIds: Set<string>,
  blueprint: BlueprintSlot[],
  seed = "savia-m1",
) {
  const fingerprintById = new Map(bank.map((question) => [question.id, question.structuralFingerprint]));
  const exposedFingerprints = new Set(
    [...exposedIds]
      .map((id) => fingerprintById.get(id))
      .filter((fingerprint): fingerprint is string => Boolean(fingerprint)),
  );
  const usedIds = new Set<string>();
  const usedFingerprints = new Set<string>();

  return blueprint.map((slot) => {
    const available = (allowExposed: boolean, match: "unit" | "axis" | "any") => bank.filter((question) => {
      if (usedIds.has(question.id) || usedFingerprints.has(question.structuralFingerprint)) return false;
      if (!allowExposed && exposedFingerprints.has(question.structuralFingerprint)) return false;
      if (match === "unit") return question.axis === slot.axis && question.unit === slot.unit;
      if (match === "axis") return question.axis === slot.axis;
      return true;
    });

    const candidates = available(false, "unit").length
      ? available(false, "unit")
      : available(false, "axis").length
        ? available(false, "axis")
        : available(false, "any").length
          ? available(false, "any")
          : available(true, "unit").length
            ? available(true, "unit")
            : available(true, "axis").length
              ? available(true, "axis")
              : available(true, "any");

    const selected = candidates.toSorted((left, right) => {
      const score = (question: Question) =>
        (question.unit === slot.unit ? 100 : question.axis === slot.axis ? 50 : 0)
        + (question.primarySkill === slot.skill ? 24 : 0)
        + (question.difficulty === slot.difficulty ? 60 : Math.max(0, 20 - Math.abs(question.difficulty - slot.difficulty) * 8))
        + (question.resourceType === slot.resourceType ? 12 : 0)
        + seededNoise(`${seed}:${slot.position}:${question.id}`);
      return score(right) - score(left);
    })[0];

    if (!selected) return null;
    usedIds.add(selected.id);
    usedFingerprints.add(selected.structuralFingerprint);
    return selected;
  }).filter((question): question is Question => question !== null);
}
