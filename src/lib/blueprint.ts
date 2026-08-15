import type { Axis, BlueprintSlot, ResourceType, Skill } from "./types";

const axes: Axis[] = ["NUMBERS", "ALGEBRA_FUNCTIONS", "GEOMETRY", "PROBABILITY_STATISTICS"];
const skills: Skill[] = ["SOLVE", "MODEL", "REPRESENT", "ARGUE"];
const resources: ResourceType[] = ["TEXT", "TABLE", "TEXT", "CARTESIAN", "GEOMETRIC_FIGURE", "BAR_CHART", "TEXT", "LINE_CHART", "DIAGRAM", "BOX_PLOT"];
const difficulties = [1, 2, 2, 3, 3, 3, 4, 4, 5] as const;

export function generateExamBlueprint(): BlueprintSlot[] {
  return Array.from({ length: 65 }, (_, index) => ({
    position: index + 1,
    axis: axes[(index * 3 + Math.floor(index / 7)) % axes.length],
    skill: skills[(index * 5 + Math.floor(index / 5)) % skills.length],
    difficulty: difficulties[(index * 7) % difficulties.length],
    resourceType: resources[(index * 3) % resources.length]
  }));
}
