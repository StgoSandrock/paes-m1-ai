import type { Question } from "../types";
import { editions, formatNumber, makeQuestion, money, type RecipeMeta } from "./helpers";

const axis = "ALGEBRA_FUNCTIONS" as const;

function expressionQuestion(pattern: number, edition: number): Question {
  const family = `alg-exp-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Expresiones algebraicas",
    topic: "Productos notables, factorización y operatoria",
    skill: "SOLVE",
    difficulty: 3,
    context: "MATHEMATICAL",
    resource: "TEXT",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const a = [2, 3, 4, 5][edition];
    const b = [3, 2, 5, 4][edition];
    return makeQuestion(meta(), edition, {
      statement: `¿Cuál expresión es equivalente a (${a}x - ${b})²?`,
      correct: `${a ** 2}x² - ${2 * a * b}x + ${b ** 2}`,
      distractors: [`${a ** 2}x² + ${b ** 2}`, `${a ** 2}x² - ${a * b}x + ${b ** 2}`, `${a}x² - ${2 * a * b}x + ${b}`],
      solution: `(u-v)² = u²-2uv+v²; con u=${a}x y v=${b}, resulta ${a ** 2}x²-${2 * a * b}x+${b ** 2}.`,
    });
  }

  if (pattern === 1) {
    const common = [4, 6, 5, 7][edition];
    const p = [3, 2, 4, 3][edition];
    const q = [5, 7, 2, 6][edition];
    return makeQuestion(meta(), edition, {
      statement: `¿Cuál es la factorización por factor común de ${common * p}x² + ${common * q}x?`,
      correct: `${common}x(${p}x + ${q})`,
      distractors: [`${common}(${p}x² + ${q}x)`, `x(${common * p}x + ${q})`, `${common * p}x(x + ${common * q})`],
      solution: `Ambos términos contienen ${common}x: ${common * p}x² + ${common * q}x = ${common}x(${p}x + ${q}).`,
    });
  }

  if (pattern === 2) {
    const a = [5, 7, 4, 6][edition];
    const b = [3, 2, 5, 4][edition];
    const c = [4, 6, 3, 5][edition];
    const coefficient = a - b;
    const constant = b * c;
    return makeQuestion(meta(), edition, {
      statement: `Simplifica ${a}x - ${b}(x - ${c}).`,
      correct: `${coefficient}x + ${constant}`,
      distractors: [`${a + b}x - ${constant}`, `${coefficient}x - ${constant}`, `${a - b * c}x`],
      solution: `${a}x - ${b}x + ${b * c} = ${coefficient}x + ${constant}.`,
    });
  }

  if (pattern === 3) {
    const a = [2, 3, 4, 5][edition];
    const b = [5, 4, 7, 6][edition];
    const divisor = [3, 2, 5, 4][edition];
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 2 }), edition, {
      statement: `¿Cuál expresión representa “la ${divisor === 2 ? "mitad" : `${divisor}ª parte`} de la suma entre ${a} veces un número x y ${b}”?`,
      correct: `(${a}x + ${b}) / ${divisor}`,
      distractors: [`${a}x + ${b}/${divisor}`, `${divisor}(${a}x + ${b})`, `${a}(x + ${b})/${divisor}`],
      solution: `La suma completa es ${a}x+${b}; tomar su ${divisor}ª parte exige dividir todo el paréntesis por ${divisor}.`,
    });
  }

  if (pattern === 4) {
    const a = [3, 4, 5, 2][edition];
    const b = [2, 3, 4, 5][edition];
    const c = [6, 5, 3, 4][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Al desarrollar ${a}x(${b}x + ${c}), se obtiene en un paso ${a * b}x² + ${c}x. ¿Cuál es el error?`,
      correct: `En el segundo término se omitió multiplicar ${c} por ${a}.`,
      distractors: ["El primer término debería tener exponente 3.", "La distributividad no puede aplicarse con variables.", `El segundo término debería ser ${a * c} sin x.`],
      solution: `${a}x·${b}x = ${a * b}x² y ${a}x·${c} = ${a * c}x.`,
    });
  }

  if (pattern === 5) {
    const extra = [3, 5, 4, 6][edition];
    return makeQuestion(meta({ context: "DAILY_LIFE", skill: "MODEL" }), edition, {
      statement: `Un rectángulo tiene ancho x metros y largo (2x + ${extra}) metros. ¿Qué expresión representa su perímetro?`,
      correct: `6x + ${2 * extra}`,
      distractors: [`2x² + ${extra}x`, `3x + ${extra}`, `4x + ${2 * extra}`],
      solution: `P = 2[x + (2x+${extra})] = 2(3x+${extra}) = 6x+${2 * extra}.`,
      distractorReasons: ["Calcula el área.", "Suma sólo un ancho y un largo.", "Cuenta dos lados largos, pero omite parte de los anchos."],
    });
  }

  if (pattern === 6) {
    const x = [2, -2, 3, -3][edition];
    const a = [2, 3, 2, 4][edition];
    const b = [5, 4, 7, 3][edition];
    const correct = a * x ** 2 - b * x + 1;
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `Si x = ${x}, ¿cuál es el valor de ${a}x² - ${b}x + 1?`,
      correct,
      distractors: [correct - 1, a * x ** 2 + b * x + 1, a * x ** 2 - b + 1],
      solution: `${a}·(${x})² - ${b}·(${x}) + 1 = ${correct}.`,
    });
  }

  if (pattern === 7) {
    const n = [5, 7, 3, 6][edition];
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `¿Cuál es el resultado de (x + ${n})(x - ${n})?`,
      correct: `x² - ${n ** 2}`,
      distractors: [`x² + ${n ** 2}`, `x² - ${2 * n}x + ${n ** 2}`, `x² - ${n}`],
      solution: `Es una suma por diferencia: (x+${n})(x-${n}) = x²-${n ** 2}.`,
    });
  }

  const start = [2, 3, 4, 5][edition];
  const increments = [3, 4, 5, 6][edition];
  const values = [start, start + increments, start + 2 * increments, start + 3 * increments];
  return makeQuestion(meta({ skill: "REPRESENT", resource: "DIAGRAM", difficulty: 3 }), edition, {
    statement: `Una secuencia de casillas aumenta siempre en ${increments}. Si las tres primeras muestran ${values.slice(0, 3).join(", ")}, ¿qué expresión entrega el término de posición n?`,
    correct: `${increments}n + ${start - increments}`,
    distractors: [`${start}n + ${increments}`, `${increments}n + ${start}`, `${increments}(n + ${start})`],
    solution: `Una secuencia aritmética con primer término ${start} y diferencia ${increments} cumple aₙ=${start}+${increments}(n-1)=${increments}n+${start - increments}.`,
    visualData: { values, caption: "Primeros términos de la secuencia" },
  });
}

function proportionalityQuestion(pattern: number, edition: number): Question {
  const family = `alg-prop-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Proporcionalidad",
    topic: "Proporción directa e inversa",
    skill: "SOLVE",
    difficulty: 3,
    context: "DAILY_LIFE",
    resource: "TEXT",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const per = [7, 9, 12, 15][edition];
    const quantity = [8, 6, 11, 9][edition];
    const correct = per * quantity;
    return makeQuestion(meta({ resource: "TABLE", skill: "REPRESENT", difficulty: 2 }), edition, {
      statement: `La tabla muestra una relación directamente proporcional. Si una unidad corresponde a ${per}, ¿qué valor corresponde a ${quantity} unidades?`,
      correct,
      distractors: [per + quantity, per * (quantity - 1), Math.round(quantity / per)],
      solution: `La constante de proporcionalidad es ${per}; entonces ${per}·${quantity}=${correct}.`,
      visualData: { labels: ["1", `${quantity}`], values: [per, 0], caption: "Relación proporcional" },
    });
  }

  if (pattern === 1) {
    const workers = [4, 6, 8, 5][edition];
    const days = [18, 15, 12, 20][edition];
    const newWorkers = [6, 9, 12, 10][edition];
    const correct = workers * days / newWorkers;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `${workers} personas realizan una tarea en ${days} días al mismo ritmo. ¿Cuántos días tardarán ${newWorkers} personas?`,
      correct: `${correct} días`,
      distractors: [`${days * newWorkers / workers} días`, `${days + newWorkers - workers} días`, `${days - workers} días`],
      solution: `En proporcionalidad inversa, personas·días es constante: ${workers}·${days}=${newWorkers}·d, por lo que d=${correct}.`,
      distractorReasons: ["Usa proporcionalidad directa.", "Suma la diferencia de personas al tiempo.", "Resta personas al número de días como si fueran magnitudes comparables."],
    });
  }

  if (pattern === 2) {
    const servings = [6, 8, 10, 12][edition];
    const grams = [450, 640, 750, 900][edition];
    const target = [10, 14, 16, 20][edition];
    const correct = grams * target / servings;
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `Una receta para ${servings} porciones usa ${grams} g de harina. Manteniendo la proporción, ¿cuántos gramos se necesitan para ${target} porciones?`,
      correct: `${correct} g`,
      distractors: [`${grams + target - servings} g`, `${grams * servings / target} g`, `${grams + grams * (target - servings) / 100} g`],
      solution: `${grams}/${servings} = x/${target}; x=${grams}·${target}/${servings}=${correct}.`,
    });
  }

  if (pattern === 3) {
    const q1 = [3, 4, 5, 6][edition];
    const p1 = [4200, 6800, 8500, 10800][edition];
    const q2 = [5, 6, 8, 9][edition];
    const p2 = [6500, 9600, 12800, 15300][edition];
    const unit1 = p1 / q1;
    const unit2 = p2 / q2;
    const correct = unit1 < unit2 ? "La primera oferta tiene menor precio por unidad." : unit1 > unit2 ? "La segunda oferta tiene menor precio por unidad." : "Ambas ofertas tienen el mismo precio por unidad.";
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Una tienda ofrece ${q1} unidades por ${money(p1)} y otra ${q2} unidades por ${money(p2)}. ¿Cuál afirmación está respaldada por una comparación proporcional?`,
      correct,
      distractors: ["La oferta con más unidades siempre es más conveniente.", "La oferta con menor precio total siempre es más conveniente.", "No se pueden comparar porque las cantidades son distintas."],
      solution: `Los precios unitarios son ${money(unit1)} y ${money(unit2)}, respectivamente.`,
    });
  }

  if (pattern === 4) {
    const k = [12, 18, 25, 32][edition];
    return makeQuestion(meta({ skill: "MODEL", difficulty: 2 }), edition, {
      statement: `El costo y es directamente proporcional a una cantidad x, con un valor de ${money(k)} por unidad. ¿Qué modelo corresponde?`,
      correct: `y = ${k}x`,
      distractors: [`y = x + ${k}`, `y = ${k}/x`, `y = x/${k}`],
      solution: `En una proporción directa y=kx, la constante k es el costo por unidad.`,
    });
  }

  if (pattern === 5) {
    const a = [4, 6, 8, 5][edition];
    const b = [10, 15, 12, 20][edition];
    const target = [25, 30, 18, 28][edition];
    const correct = b * target / a;
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Para resolver ${a}/${b} = ${target}/x, una persona calcula x = ${a}·${target}/${b}. ¿Cuál es la corrección?`,
      correct: `x debe ser ${b}·${target}/${a} = ${formatNumber(correct)}.`,
      distractors: [`x debe ser ${a}·${b}/${target}.`, "El procedimiento es correcto.", `x debe ser ${target}-${b}+${a}.`],
      solution: `Al multiplicar cruzado: ${a}x=${b}·${target}, luego x=${b}·${target}/${a}=${formatNumber(correct)}.`,
    });
  }

  if (pattern === 6) {
    const total = [54000, 84000, 96000, 126000][edition];
    const ratioA = [2, 3, 5, 4][edition];
    const ratioB = [3, 4, 3, 5][edition];
    const correct = total * ratioA / (ratioA + ratioB);
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Un premio de ${money(total)} se reparte entre Ana y Bruno en razón ${ratioA}:${ratioB}. ¿Cuánto recibe Ana?`,
      correct: money(correct),
      distractors: [money(total * ratioA / ratioB), money(total / ratioA), money(total * ratioB / (ratioA + ratioB))],
      solution: `Ana recibe ${ratioA} de ${ratioA + ratioB} partes: ${money(total)}·${ratioA}/${ratioA + ratioB}=${money(correct)}.`,
    });
  }

  if (pattern === 7) {
    const k = [3, 4, 5, 6][edition];
    const xs = [1, 2, 3, 4];
    const values = xs.map((x) => k * x);
    return makeQuestion(meta({ skill: "REPRESENT", resource: "LINE_CHART", difficulty: 3 }), edition, {
      statement: `Los datos representados corresponden a y = ${k}x. ¿Qué característica confirma que es una proporción directa?`,
      correct: `El cociente y/x es constante e igual a ${k}.`,
      distractors: [`La diferencia y-x es siempre ${k}.`, "La gráfica no pasa por el origen.", "El producto x·y es constante."],
      solution: `Para cada par, y/x=${k}; además, el modelo tiene intercepto cero.`,
      visualData: { labels: xs.map(String), values, caption: "Valores de x e y" },
    });
  }

  const distance = [180, 240, 315, 420][edition];
  const time = [3, 4, 5, 6][edition];
  const newTime = [7, 9, 8, 10][edition];
  const correct = distance / time * newTime;
  return makeQuestion(meta({ context: "SCIENTIFIC", skill: "MODEL", difficulty: 3 }), edition, {
    statement: `Un móvil recorre ${distance} km en ${time} h a rapidez constante. ¿Qué distancia recorrerá en ${newTime} h?`,
    correct: `${correct} km`,
    distractors: [`${distance * time / newTime} km`, `${distance + newTime - time} km`, `${distance / time} km`],
    solution: `La rapidez es ${distance}/${time}=${distance / time} km/h; en ${newTime} h recorre ${correct} km.`,
  });
}

function equationQuestion(pattern: number, edition: number): Question {
  const family = `alg-eq-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Ecuaciones e inecuaciones de primer grado",
    topic: "Resolución, modelación e interpretación",
    skill: "SOLVE",
    difficulty: 3,
    context: "MATHEMATICAL",
    resource: "TEXT",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const solution = [7, 9, 6, 8][edition];
    const coefficient = [3, 4, 5, 6][edition];
    const constant = [5, 7, 4, 9][edition];
    const result = coefficient * solution + constant;
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `¿Cuál es la solución de ${coefficient}x + ${constant} = ${result}?`,
      correct: `x = ${solution}`,
      distractors: [`x = ${solution + 1}`, `x = ${solution - 1}`, `x = ${result - constant}`],
      solution: `${coefficient}x=${result - constant}; x=${result - constant}/${coefficient}=${solution}.`,
    });
  }

  if (pattern === 1) {
    const fixed = [4500, 6000, 7500, 9000][edition];
    const per = [1200, 1500, 1800, 2000][edition];
    const quantity = [8, 10, 12, 9][edition];
    const total = fixed + per * quantity;
    return makeQuestion(meta({ context: "DAILY_LIFE", skill: "MODEL" }), edition, {
      statement: `Un servicio cobra ${money(fixed)} fijos y ${money(per)} por unidad. Si la cuenta fue ${money(total)}, ¿cuántas unidades se contrataron?`,
      correct: quantity,
      distractors: [Math.round(total / per), quantity + 1, Math.round((total + fixed) / per)],
      solution: `${fixed}+${per}x=${total}; x=(${total}-${fixed})/${per}=${quantity}.`,
    });
  }

  if (pattern === 2) {
    const budget = [62000, 85000, 98000, 125000][edition];
    const fixed = [14000, 25000, 18000, 35000][edition];
    const per = [8000, 10000, 16000, 15000][edition];
    const max = Math.floor((budget - fixed) / per);
    return makeQuestion(meta({ context: "DAILY_LIFE", difficulty: 3 }), edition, {
      statement: `Se dispone de ${money(budget)}. Tras pagar ${money(fixed)} fijos, cada entrada cuesta ${money(per)}. ¿Qué inecuación y resultado describen la cantidad máxima x de entradas?`,
      correct: `${fixed} + ${per}x ≤ ${budget}; x ≤ ${max}`,
      distractors: [`${fixed} + ${per}x ≥ ${budget}; x ≥ ${max}`, `${per}x ≤ ${budget}; x ≤ ${Math.floor(budget / per)}`, `${fixed}x + ${per} ≤ ${budget}; x ≤ ${Math.floor((budget - per) / fixed)}`],
      solution: `El total no puede superar el presupuesto: ${fixed}+${per}x≤${budget}. Al despejar, x≤${formatNumber((budget - fixed) / per)}, por lo que como máximo son ${max}.`,
    });
  }

  if (pattern === 3) {
    const unit = [2500, 3200, 4500, 1800][edition];
    const extra = [4000, 6000, 3500, 5000][edition];
    const count = [7, 9, 6, 12][edition];
    const total = unit * count + extra;
    return makeQuestion(meta({ context: "DAILY_LIFE", skill: "REPRESENT", difficulty: 2 }), edition, {
      statement: `Se compran x artículos de ${money(unit)} cada uno y se paga además un despacho de ${money(extra)}. El total es ${money(total)}. ¿Qué ecuación modela la situación?`,
      correct: `${unit}x + ${extra} = ${total}`,
      distractors: [`${unit} + ${extra}x = ${total}`, `${unit}x = ${total} + ${extra}`, `${unit}(x + ${extra}) = ${total}`],
      solution: `El costo variable es ${unit}x y el despacho fijo se suma: ${unit}x+${extra}=${total}.`,
    });
  }

  if (pattern === 4) {
    const a = [4, 5, 6, 3][edition];
    const x = [8, 7, 9, 12][edition];
    const b = [6, 4, 8, 5][edition];
    const result = a * x - b;
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Para resolver ${a}x - ${b} = ${result}, se suma ${b} a ambos lados y se obtiene ${a}x = ${result + b}. Luego se concluye x = ${result + b - a}. ¿Dónde está el error?`,
      correct: `En el último paso: se debe dividir ${result + b} por ${a}.`,
      distractors: [`Al sumar ${b} a ambos lados.`, `La ecuación no tiene solución.`, `Se debía restar ${b} nuevamente.`],
      solution: `Desde ${a}x=${result + b}, corresponde x=(${result + b})/${a}=${x}.`,
    });
  }

  if (pattern === 5) {
    const threshold = [18, 24, 15, 30][edition];
    const a = [3, 4, 5, 6][edition];
    const b = [6, 8, 10, 12][edition];
    const right = a * threshold + b;
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 3 }), edition, {
      statement: `¿Qué intervalo describe las soluciones de ${a}x + ${b} < ${right}?`,
      correct: `x < ${threshold}`,
      distractors: [`x > ${threshold}`, `x ≤ ${threshold}`, `x < ${right - b}`],
      solution: `${a}x<${right - b}; como ${a}>0, x<${(right - b) / a}=${threshold}.`,
    });
  }

  if (pattern === 6) {
    const final = [73, 91, 64, 115][edition];
    const multiplier = [4, 5, 3, 6][edition];
    const addition = [9, 11, 7, 13][edition];
    const start = (final - addition) / multiplier;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `A un número se lo multiplica por ${multiplier} y luego se le suma ${addition}, obteniéndose ${final}. ¿Cuál era el número?`,
      correct: start,
      distractors: [(final + addition) / multiplier, final / multiplier + addition, final * multiplier - addition],
      solution: `Se deshacen las operaciones en orden inverso: (${final}-${addition})/${multiplier}=${start}.`,
    });
  }

  if (pattern === 7) {
    const fixedA = [6000, 9000, 12000, 7500][edition];
    const perA = [1200, 1000, 800, 1500][edition];
    const perB = [2000, 1800, 1600, 2250][edition];
    const threshold = fixedA / (perB - perA);
    return makeQuestion(meta({ context: "DAILY_LIFE", skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `El plan A cuesta ${money(fixedA)} más ${money(perA)} por uso; el plan B cuesta ${money(perB)} por uso, sin cargo fijo. ¿Desde qué cantidad entera de usos A deja de ser más caro que B?`,
      correct: `${Math.ceil(threshold)} usos`,
      distractors: [`${Math.floor(fixedA / perB)} usos`, `${Math.ceil(fixedA / (perA + perB))} usos`, `${Math.ceil(threshold) + 1} usos`],
      solution: `${fixedA}+${perA}x≤${perB}x implica ${fixedA}≤${perB - perA}x, luego x≥${formatNumber(threshold)}.`,
    });
  }

  const middle = [12, 18, 21, 27][edition];
  const total = 3 * middle;
  return makeQuestion(meta({ context: "MATHEMATICAL", skill: "MODEL", difficulty: 3 }), edition, {
    statement: `La suma de tres enteros consecutivos es ${total}. ¿Cuál es el mayor de ellos?`,
    correct: middle + 1,
    distractors: [middle, middle - 1, total - 1],
    solution: `Si el central es n, (n-1)+n+(n+1)=3n=${total}; n=${middle}. El mayor es ${middle + 1}.`,
  });
}

export function buildAlgebraCoreBank() {
  return [
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => expressionQuestion(pattern, edition))).flat(),
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => proportionalityQuestion(pattern, edition))).flat(),
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => equationQuestion(pattern, edition))).flat(),
  ];
}
