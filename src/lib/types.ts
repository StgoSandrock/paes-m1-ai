export type Axis = "NUMBERS" | "ALGEBRA_FUNCTIONS" | "GEOMETRY" | "PROBABILITY_STATISTICS";
export type Skill = "SOLVE" | "MODEL" | "REPRESENT" | "ARGUE";
export type AnswerKey = "A" | "B" | "C" | "D";
export type ResourceType = "TEXT" | "TABLE" | "BAR_CHART" | "LINE_CHART" | "BOX_PLOT" | "CARTESIAN" | "GEOMETRIC_FIGURE" | "DIAGRAM";

export interface Question {
  id: string;
  axis: Axis;
  unit: string;
  topic: string;
  primarySkill: Skill;
  difficulty: 1 | 2 | 3 | 4 | 5;
  contextType: "MATHEMATICAL" | "DAILY_LIFE" | "SCIENTIFIC";
  resourceType: ResourceType;
  statement: string;
  options: Record<AnswerKey, string>;
  correctAnswer: AnswerKey;
  solution: string;
  distractorReasoning: Partial<Record<AnswerKey, string>>;
  visualData?: {
    labels?: string[];
    values?: number[];
    points?: [number, number][];
    boxPlots?: Array<{ label: string; values: number[] }>;
    caption?: string;
  };
  structuralFingerprint: string;
}

export type PublicQuestion = Omit<Question, "correctAnswer" | "solution" | "distractorReasoning" | "structuralFingerprint">;
export interface BlueprintSlot { position: number; axis: Axis; unit: string; skill: Skill; difficulty: 1 | 2 | 3 | 4 | 5; resourceType: ResourceType; }
