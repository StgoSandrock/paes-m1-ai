import { describe, expect, it } from "vitest";
import { generateExamBlueprint } from "./blueprint";

function counts<T extends string | number>(values: T[]) {
  return values.reduce<Record<string, number>>((result, value) => ({ ...result, [String(value)]: (result[String(value)] ?? 0) + 1 }), {});
}

describe("blueprint", () => {
  it("crea 65 posiciones con las cuotas objetivo", () => {
    const slots = generateExamBlueprint("balance");
    expect(slots).toHaveLength(65);
    expect(counts(slots.map((slot) => slot.axis))).toEqual({ NUMBERS: 18, ALGEBRA_FUNCTIONS: 22, GEOMETRY: 13, PROBABILITY_STATISTICS: 12 });
    expect(counts(slots.map((slot) => slot.skill))).toEqual({ SOLVE: 25, MODEL: 15, REPRESENT: 15, ARGUE: 10 });
    expect(counts(slots.map((slot) => slot.difficulty))).toEqual({ 1: 10, 2: 18, 3: 20, 4: 12, 5: 5 });
    expect(counts(slots.map((slot) => slot.resourceType))).toEqual({ TEXT: 31, TABLE: 10, BAR_CHART: 5, LINE_CHART: 3, BOX_PLOT: 3, CARTESIAN: 4, GEOMETRIC_FIGURE: 5, DIAGRAM: 4 });
  });
});
