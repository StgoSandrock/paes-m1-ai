import { buildAlgebraCoreBank } from "./question-bank/algebra-core";
import { buildAlgebraFunctionsBank } from "./question-bank/algebra-functions";
import { buildGeometryBank } from "./question-bank/geometry";
import { buildNumbersBank } from "./question-bank/numbers";
import { buildStatisticsBank } from "./question-bank/statistics";
import type { Question } from "./types";

let cachedBank: Question[] | undefined;

function calibratedDifficulty(question: Question): Question["difficulty"] {
  const match = question.structuralFingerprint.match(/-(\d{2})$/);
  const pattern = Number(match?.[1] ?? 1);
  if (question.structuralFingerprint.startsWith("num-")) {
    if (pattern <= 2) return 1;
    if (pattern <= 5) return 2;
    if (pattern <= 8) return 3;
    if (pattern <= 10) return 4;
    return 5;
  }
  if (pattern === 1) return 1;
  if (pattern <= 3) return 2;
  if (pattern <= 6) return 3;
  if (pattern <= 8) return 4;
  return 5;
}

/**
 * Banco curricular original: 153 familias estructurales y cuatro ediciones
 * numéricas verificables por familia. Las ediciones comparten fingerprint para
 * que el selector nunca las trate como preguntas distintas frente al sistema
 * antirrepetición.
 */
export function buildQuestionBank(): Question[] {
  if (!cachedBank) {
    cachedBank = [
      ...buildNumbersBank(),
      ...buildAlgebraCoreBank(),
      ...buildAlgebraFunctionsBank(),
      ...buildGeometryBank(),
      ...buildStatisticsBank(),
    ].map((question) => ({ ...question, difficulty: calibratedDifficulty(question) }));
  }
  return cachedBank;
}
