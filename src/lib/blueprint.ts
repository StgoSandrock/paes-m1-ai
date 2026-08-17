import type { Axis, BlueprintSlot, ResourceType, Skill } from "./types";

const unitDistribution: Array<{ axis: Axis; unit: string; count: number }> = [
  { axis: "NUMBERS", unit: "Enteros y racionales", count: 6 },
  { axis: "NUMBERS", unit: "Porcentaje", count: 6 },
  { axis: "NUMBERS", unit: "Potencias y raíces enésimas", count: 6 },
  { axis: "ALGEBRA_FUNCTIONS", unit: "Expresiones algebraicas", count: 4 },
  { axis: "ALGEBRA_FUNCTIONS", unit: "Proporcionalidad", count: 4 },
  { axis: "ALGEBRA_FUNCTIONS", unit: "Ecuaciones e inecuaciones de primer grado", count: 4 },
  { axis: "ALGEBRA_FUNCTIONS", unit: "Sistemas de ecuaciones lineales (2x2)", count: 4 },
  { axis: "ALGEBRA_FUNCTIONS", unit: "Función lineal y afín", count: 3 },
  { axis: "ALGEBRA_FUNCTIONS", unit: "Función cuadrática", count: 3 },
  { axis: "GEOMETRY", unit: "Figuras geométricas", count: 4 },
  { axis: "GEOMETRY", unit: "Cuerpos geométricos", count: 3 },
  { axis: "GEOMETRY", unit: "Transformaciones isométricas", count: 3 },
  { axis: "GEOMETRY", unit: "Semejanza y proporcionalidad de figuras", count: 3 },
  { axis: "PROBABILITY_STATISTICS", unit: "Representación de datos a través de tablas y gráficos", count: 4 },
  { axis: "PROBABILITY_STATISTICS", unit: "Medidas de posición", count: 4 },
  { axis: "PROBABILITY_STATISTICS", unit: "Reglas de las probabilidades", count: 4 },
];

function randomFromSeed(seed: string) {
  let state = 2166136261;
  for (const character of seed) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], seed: string) {
  const random = randomFromSeed(seed);
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function repeat<T>(value: T, count: number) {
  return Array.from({ length: count }, () => value);
}

export function generateExamBlueprint(seed = "savia-m1") : BlueprintSlot[] {
  let fourSlotUnit = 0;
  const units = shuffle(unitDistribution.flatMap((item) => {
    let profile: Array<1 | 2 | 3 | 4 | 5>;
    if (item.count === 6) profile = [1, 2, 2, 3, 4, 5];
    else if (item.count === 3) profile = [1, 3, 4];
    else {
      profile = fourSlotUnit < 2 ? [1, 2, 3, 5] : fourSlotUnit < 6 ? [2, 2, 3, 4] : [2, 3, 3, 3];
      fourSlotUnit += 1;
    }
    return shuffle(profile, `${seed}:${item.unit}:difficulty`).map((difficulty) => ({ axis: item.axis, unit: item.unit, difficulty }));
  }), `${seed}:units`);
  const skills = shuffle<Skill>([
    ...repeat<Skill>("SOLVE", 25),
    ...repeat<Skill>("MODEL", 15),
    ...repeat<Skill>("REPRESENT", 15),
    ...repeat<Skill>("ARGUE", 10),
  ], `${seed}:skills`);
  const resources = shuffle<ResourceType>([
    ...repeat<ResourceType>("TEXT", 31),
    ...repeat<ResourceType>("TABLE", 10),
    ...repeat<ResourceType>("BAR_CHART", 5),
    ...repeat<ResourceType>("LINE_CHART", 3),
    ...repeat<ResourceType>("BOX_PLOT", 3),
    ...repeat<ResourceType>("CARTESIAN", 4),
    ...repeat<ResourceType>("GEOMETRIC_FIGURE", 5),
    ...repeat<ResourceType>("DIAGRAM", 4),
  ], `${seed}:resources`);

  return units.map((item, index) => ({
    position: index + 1,
    axis: item.axis,
    unit: item.unit,
    skill: skills[index],
    difficulty: item.difficulty,
    resourceType: resources[index],
  }));
}
