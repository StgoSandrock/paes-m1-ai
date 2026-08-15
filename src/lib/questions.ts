import { generateExamBlueprint } from "./blueprint";
import type { AnswerKey, Question } from "./types";

const keys: AnswerKey[] = ["A", "B", "C", "D"];

function choices(correct: number, distractors: number[], offset: number) {
  const unique = [correct];
  distractors.forEach((value, index) => { let candidate = value; while (unique.includes(candidate)) candidate += index + 1; unique.push(candidate); });
  const raw = unique.map(String);
  const values = raw.map((_, index) => raw[(index + offset) % 4]);
  return {
    options: Object.fromEntries(keys.map((key, index) => [key, values[index]])) as Record<AnswerKey, string>,
    correctAnswer: keys[values.indexOf(String(correct))]
  };
}

export function buildQuestionBank(): Question[] {
  const blueprint = generateExamBlueprint();
  return blueprint.map((slot, index) => {
    const n = Math.floor(index / 13) + 2;
    const kind = index % 13;
    let unit = "";
    let topic = "";
    let statement = "";
    let solution = "";
    let correct = 0;
    let distractors: number[] = [];
    let visualData: Question["visualData"];

    if (kind === 0) {
      unit = "Enteros y racionales"; topic = "Operaciones"; correct = 9 - n;
      statement = `El saldo de una campaña parte en ${n + 5}, disminuye ${2 * n + 4} y luego aumenta ${n}. ¿Cuál es el saldo final?`;
      solution = `${n + 5} - ${2 * n + 4} + ${n} = ${correct}.`; distractors = [-correct, correct + n, correct - n];
    } else if (kind === 1) {
      const price = (n + 3) * 10000; const rate = 10 + n * 5;
      unit = "Porcentaje"; topic = "Aumentos"; correct = price * (100 + rate) / 100;
      statement = `Un equipo cuesta $${price.toLocaleString("es-CL")} y aumenta un ${rate} %. ¿Cuál es su nuevo precio, en pesos?`;
      solution = `${price} · ${(100 + rate) / 100} = ${correct}.`; distractors = [price * rate / 100, price - price * rate / 100, price + rate];
    } else if (kind === 2) {
      unit = "Potencias y raíces"; topic = "Potencias"; correct = 2 ** (n + 1);
      statement = `¿Cuál es el valor de 2 elevado a ${n + 1}?`; solution = `Multiplicar 2 por sí mismo ${n + 1} veces da ${correct}.`; distractors = [2 * (n + 1), 2 ** n, 4 ** n];
    } else if (kind === 3) {
      unit = "Expresiones algebraicas"; topic = "Evaluación"; correct = 4 * n + 7;
      statement = `Si x = ${n}, ¿cuál es el valor de 4x + 7?`; solution = `4 · ${n} + 7 = ${correct}.`; distractors = [4 + n + 7, 4 * (n + 7), 4 * n - 7];
    } else if (kind === 4) {
      unit = "Proporcionalidad"; topic = "Proporción directa"; correct = (n + 3) * (n + 6);
      statement = `Cada bandeja contiene ${n + 6} plantas. ¿Cuántas plantas hay en ${n + 3} bandejas iguales?`; solution = `${n + 3} · ${n + 6} = ${correct}.`; distractors = [2 * n + 9, correct - n - 6, n + 6];
    } else if (kind === 5) {
      unit = "Ecuaciones de primer grado"; topic = "Resolución"; correct = n + 2;
      statement = `¿Cuál es la solución de 3x + ${n} = ${4 * n + 6}?`; solution = `3x = ${3 * n + 6}; entonces x = ${correct}.`; distractors = [n + 1, n + 3, 3 * n + 6];
    } else if (kind === 6) {
      unit = "Función lineal y afín"; topic = "Pendiente"; correct = n + 1;
      statement = `La cantidad de agua se modela por A(t) = ${100 + n * 10} - ${n + 1}t. ¿Cuántos litros disminuye por minuto?`; solution = `La pendiente es -${n + 1}; su magnitud es ${correct}.`; distractors = [100 + n * 10, 99 + n * 9, n];
    } else if (kind === 7) {
      const base = n + 5; const height = n + 3;
      unit = "Figuras geométricas"; topic = "Área de triángulo"; correct = base * height / 2;
      statement = `Un triángulo tiene base ${base} cm y altura ${height} cm. ¿Cuál es su área en cm²?`; solution = `${base} · ${height} / 2 = ${correct}.`; distractors = [base * height, 2 * (base + height), base + height]; visualData = { values: [base, height], caption: `Base ${base} cm · altura ${height} cm` };
    } else if (kind === 8) {
      const side = n + 1; unit = "Cuerpos geométricos"; topic = "Volumen"; correct = side ** 3;
      statement = `Un cubo tiene arista de ${side} cm. ¿Cuál es su volumen en cm³?`; solution = `${side}³ = ${correct}.`; distractors = [side ** 2, 6 * side ** 2, 3 * side];
    } else if (kind === 9) {
      unit = "Transformaciones isométricas"; topic = "Traslación"; correct = (n + 3) * 100 + n;
      statement = `El punto P(${n}, ${n + 2}) se traslada según el vector (3, -2). Si P' = (a, b), ¿cuánto vale 100a + b?`; solution = `P' = (${n + 3}, ${n}); el valor pedido es ${correct}.`; distractors = [(n - 3) * 100 + n + 4, n * 100 + n + 2, (n - 2) * 100 + n + 5]; visualData = { points: [[n, n + 2], [n + 3, n]], caption: "Punto original e imagen" };
    } else if (kind === 10) {
      const values = [n + 2, n + 4, n + 6]; unit = "Representación de datos"; topic = "Promedio"; correct = n + 4;
      statement = `Una tabla registra ${values.join(", ")} préstamos diarios. ¿Cuál es el promedio?`; solution = `(${values.join(" + ")}) / 3 = ${correct}.`; distractors = [n + 3, n + 5, values.reduce((a, b) => a + b)]; visualData = { labels: ["Lun", "Mar", "Mié"], values, caption: "Préstamos diarios" };
    } else if (kind === 11) {
      const values = [n, n + 2, n + 4, n + 6, n + 8]; unit = "Medidas de posición"; topic = "Mediana"; correct = n + 4;
      statement = `Los datos ordenados son ${values.join(", ")}. ¿Cuál es su mediana?`; solution = `El dato central es ${correct}.`; distractors = [n + 2, n + 6, n + 8]; visualData = { values, caption: "Datos ordenados" };
    } else {
      const total = 10 + n; const favorable = 2 + n; unit = "Reglas de probabilidad"; topic = "Probabilidad simple"; correct = Math.round(favorable / total * 100);
      statement = `Una bolsa contiene ${total} fichas equiprobables y ${favorable} son azules. Al porcentaje entero más cercano, ¿cuál es la probabilidad de extraer una azul?`; solution = `${favorable}/${total} · 100 ≈ ${correct} %.`; distractors = [Math.round((total - favorable) / total * 100), favorable, total];
    }
    const answerSet = choices(correct, distractors, (index * 3) % 4);
    return {
      id: `m1-${String(index + 1).padStart(3, "0")}`, axis: slot.axis, unit, topic, primarySkill: slot.skill, difficulty: slot.difficulty,
      contextType: kind % 3 === 0 ? "DAILY_LIFE" : kind % 3 === 1 ? "SCIENTIFIC" : "MATHEMATICAL",
      resourceType: visualData ? (slot.resourceType === "TEXT" ? "DIAGRAM" : slot.resourceType) : "TEXT",
      statement, ...answerSet, solution, visualData,
      distractorReasoning: Object.fromEntries(keys.filter((key) => key !== answerSet.correctAnswer).map((key) => [key, "Error frecuente de cálculo o interpretación."])),
      structuralFingerprint: `${unit}:${topic}:${kind}:${n}`
    };
  });
}
