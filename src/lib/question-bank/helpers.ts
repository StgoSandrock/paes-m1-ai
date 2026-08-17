import type {
  AnswerKey,
  Axis,
  Question,
  ResourceType,
  Skill,
} from "../types";

export interface RecipeMeta {
  axis: Axis;
  unit: string;
  topic: string;
  skill: Skill;
  difficulty: 1 | 2 | 3 | 4 | 5;
  context: Question["contextType"];
  resource: ResourceType;
  family: string;
}

export interface QuestionDraft {
  statement: string;
  correct: string | number;
  distractors: [string | number, string | number, string | number];
  solution: string;
  distractorReasons?: [string, string, string];
  visualData?: Question["visualData"];
}

const keys: AnswerKey[] = ["A", "B", "C", "D"];

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits }).format(value);
}

export function money(value: number) {
  return `$${new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(value)}`;
}

export function makeQuestion(meta: RecipeMeta, edition: number, draft: QuestionDraft): Question {
  const id = `${meta.family}-v${edition + 1}`;
  const reasons = draft.distractorReasons ?? [
    "Omite una etapa necesaria del procedimiento.",
    "Aplica una relación correcta sobre una base equivocada.",
    "Corresponde a una interpretación alternativa, pero no a la solicitada.",
  ];
  const source = [
    { value: String(draft.correct), reason: "" },
    ...draft.distractors.map((value, index) => ({ value: String(value), reason: reasons[index] })),
  ];
  if (new Set(source.map((item) => item.value)).size !== 4) {
    throw new Error(`Alternativas repetidas en ${id}`);
  }
  const offset = hash(id) % 4;
  const ordered = source.map((_, index) => source[(index + offset) % 4]);
  const options = Object.fromEntries(keys.map((key, index) => [key, ordered[index].value])) as Record<AnswerKey, string>;
  const correctAnswer = keys[ordered.findIndex((item) => item.reason === "")];
  const distractorReasoning = Object.fromEntries(
    keys
      .map((key, index) => [key, ordered[index].reason] as const)
      .filter(([, reason]) => Boolean(reason)),
  ) as Partial<Record<AnswerKey, string>>;

  return {
    id,
    axis: meta.axis,
    unit: meta.unit,
    topic: meta.topic,
    primarySkill: meta.skill,
    difficulty: meta.difficulty,
    contextType: meta.context,
    resourceType: meta.resource,
    statement: draft.statement,
    options,
    correctAnswer,
    solution: draft.solution,
    distractorReasoning,
    visualData: draft.visualData,
    structuralFingerprint: meta.family,
  };
}

export function editions(build: (edition: number) => Question) {
  return Array.from({ length: 4 }, (_, edition) => build(edition));
}

export function rotate<T>(values: readonly T[], edition: number) {
  return values[edition % values.length];
}
