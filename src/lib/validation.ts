import type { Question } from "./types";

const unitsByAxis: Record<Question["axis"], Set<string>> = {
  NUMBERS: new Set(["Enteros y racionales", "Porcentaje", "Potencias y raíces enésimas"]),
  ALGEBRA_FUNCTIONS: new Set(["Expresiones algebraicas", "Proporcionalidad", "Ecuaciones e inecuaciones de primer grado", "Sistemas de ecuaciones lineales (2x2)", "Función lineal y afín", "Función cuadrática"]),
  GEOMETRY: new Set(["Figuras geométricas", "Cuerpos geométricos", "Transformaciones isométricas", "Semejanza y proporcionalidad de figuras"]),
  PROBABILITY_STATISTICS: new Set(["Representación de datos a través de tablas y gráficos", "Medidas de posición", "Reglas de las probabilidades"]),
};

export function validateQuestion(question: Question) {
  const values = Object.values(question.options);
  const errors: string[] = [];
  if (question.statement.trim().length < 12) errors.push("El enunciado es demasiado breve.");
  if (values.length !== 4 || new Set(values).size !== 4) errors.push("Las alternativas deben ser cuatro y distintas.");
  if (!question.options[question.correctAnswer]) errors.push("La clave correcta no pertenece a las alternativas.");
  if (!question.solution.trim()) errors.push("Falta solución matemática.");
  if (!question.structuralFingerprint.trim()) errors.push("Falta huella estructural.");
  if (!unitsByAxis[question.axis].has(question.unit)) errors.push("La unidad no corresponde al eje curricular.");
  if (Object.keys(question.distractorReasoning).length !== 3) errors.push("Deben justificarse los tres distractores.");
  if (question.visualData?.labels && question.visualData.values && question.visualData.labels.length !== question.visualData.values.length) errors.push("Las etiquetas y valores del recurso no coinciden.");
  if (question.visualData?.boxPlots?.some((item) => item.values.length !== 5 || item.values.some((value, index) => index > 0 && value < item.values[index - 1]))) errors.push("El diagrama de caja requiere cinco valores ordenados.");
  return { valid: errors.length === 0, errors };
}
