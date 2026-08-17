import type { Question } from "../types";
import { editions, formatNumber, makeQuestion, money, type RecipeMeta } from "./helpers";

const axis = "ALGEBRA_FUNCTIONS" as const;

function systemsQuestion(pattern: number, edition: number): Question {
  const family = `alg-sys-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Sistemas de ecuaciones lineales (2x2)",
    topic: "Resolución, modelación e interpretación",
    skill: "SOLVE",
    difficulty: 3,
    context: "MATHEMATICAL",
    resource: "TEXT",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const x = [4, 6, 5, 8][edition];
    const y = [7, 3, 9, 5][edition];
    const first = x + y;
    const second = 2 * x - y;
    return makeQuestion(meta(), edition, {
      statement: `Si x + y = ${first} y 2x - y = ${second}, ¿cuánto vale x - y?`,
      correct: x - y,
      distractors: [x + y, x, y - x],
      solution: `Al sumar las ecuaciones, 3x=${first + second}, entonces x=${x}. Luego y=${first}-${x}=${y}; x-y=${x - y}.`,
    });
  }

  if (pattern === 1) {
    const adultPrice = [7000, 8500, 9000, 12000][edition];
    const childPrice = [4000, 5000, 6000, 7500][edition];
    const adults = [8, 6, 9, 7][edition];
    const children = [5, 10, 4, 8][edition];
    const totalTickets = adults + children;
    const revenue = adults * adultPrice + children * childPrice;
    return makeQuestion(meta({ context: "DAILY_LIFE", skill: "MODEL", difficulty: 4 }), edition, {
      statement: `Se vendieron ${totalTickets} entradas: las de adulto a ${money(adultPrice)} y las infantiles a ${money(childPrice)}. La recaudación fue ${money(revenue)}. ¿Cuántas entradas de adulto se vendieron?`,
      correct: adults,
      distractors: [children, totalTickets, Math.round(revenue / adultPrice)],
      solution: `Con a+c=${totalTickets} y ${adultPrice}a+${childPrice}c=${revenue}, al sustituir c=${totalTickets}-a se obtiene a=${adults}.`,
    });
  }

  if (pattern === 2) {
    const boxesA = [12, 15, 18, 20][edition];
    const boxesB = [8, 10, 6, 12][edition];
    const capacityA = [3, 4, 5, 6][edition];
    const capacityB = [7, 6, 8, 9][edition];
    const totalBoxes = boxesA + boxesB;
    const totalItems = boxesA * capacityA + boxesB * capacityB;
    return makeQuestion(meta({ context: "DAILY_LIFE", difficulty: 4 }), edition, {
      statement: `Se completaron ${totalBoxes} cajas. Un tipo contiene ${capacityA} unidades y el otro ${capacityB}; en total hay ${totalItems} unidades. ¿Cuántas cajas del segundo tipo se usaron?`,
      correct: boxesB,
      distractors: [boxesA, Math.round(totalItems / capacityB), totalBoxes - capacityA],
      solution: `Si a+b=${totalBoxes} y ${capacityA}a+${capacityB}b=${totalItems}, al resolver se obtiene b=${boxesB}.`,
    });
  }

  if (pattern === 3) {
    const total = [28, 36, 42, 50][edition];
    const difference = [6, 8, 10, 12][edition];
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 2 }), edition, {
      statement: `Dos cantidades x e y suman ${total}, y x es ${difference} unidades mayor que y. ¿Qué sistema modela la situación?`,
      correct: `x + y = ${total}; x - y = ${difference}`,
      distractors: [`x + y = ${difference}; x - y = ${total}`, `xy = ${total}; x + y = ${difference}`, `x + y = ${total}; y - x = ${difference}`],
      solution: `“Suman ${total}” se traduce como x+y=${total}; “x es ${difference} mayor” como x-y=${difference}.`,
    });
  }

  if (pattern === 4) {
    const productA = [10, 12, 8, 14][edition];
    const productB = [6, 5, 9, 7][edition];
    const metalA1 = [2, 3, 4, 2][edition];
    const metalB1 = [5, 4, 2, 6][edition];
    const metalA2 = [3, 2, 5, 4][edition];
    const metalB2 = [1, 5, 3, 2][edition];
    const stock1 = productA * metalA1 + productB * metalB1;
    const stock2 = productA * metalA2 + productB * metalB2;
    return makeQuestion(meta({ context: "SCIENTIFIC", resource: "TABLE", skill: "MODEL", difficulty: 4 }), edition, {
      statement: `Dos productos A y B consumen los materiales indicados en la tabla. Si se usaron exactamente ${stock1} kg del material 1 y ${stock2} kg del material 2, ¿cuántos productos B se fabricaron?`,
      correct: productB,
      distractors: [productA, productA + productB, Math.abs(productA - productB) + 1],
      solution: `El sistema ${metalA1}A+${metalB1}B=${stock1}, ${metalA2}A+${metalB2}B=${stock2} tiene solución A=${productA}, B=${productB}.`,
      visualData: { labels: ["A: material 1", "B: material 1", "A: material 2", "B: material 2"], values: [metalA1, metalB1, metalA2, metalB2], caption: "Kilogramos por producto" },
    });
  }

  if (pattern === 5) {
    const x = [5, 7, 4, 6][edition];
    const y = [3, 2, 8, 5][edition];
    const sum = x + y;
    const relation = 2 * x + y;
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 5 }), edition, {
      statement: `Para resolver x+y=${sum} y 2x+y=${relation}, una persona resta la primera ecuación de la segunda y escribe x+2y=${relation - sum}. ¿Cuál es el error?`,
      correct: `Al restar, los términos y se anulan; debe quedar x = ${relation - sum}.`,
      distractors: ["Las ecuaciones no se pueden restar.", `Debe quedar 3x+2y=${relation + sum}.`, "No existe solución porque ambas ecuaciones contienen y."],
      solution: `(2x+y)-(x+y)=x y ${relation}-${sum}=${relation - sum}; por tanto, x=${x}.`,
    });
  }

  if (pattern === 6) {
    const x = [3, 4, 5, 6][edition];
    const slopeA = [2, 3, 4, 5][edition];
    const interceptA = [1, -2, 3, -4][edition];
    const slopeB = [slopeA - 1, slopeA + 1, slopeA - 2, slopeA + 2][edition];
    const y = slopeA * x + interceptA;
    const interceptB = y - slopeB * x;
    return makeQuestion(meta({ skill: "REPRESENT", resource: "CARTESIAN", difficulty: 3 }), edition, {
      statement: `Las rectas y=${slopeA}x${interceptA >= 0 ? "+" : ""}${interceptA} e y=${slopeB}x${interceptB >= 0 ? "+" : ""}${interceptB} se intersectan en (a,b). ¿Cuánto vale a+b?`,
      correct: x + y,
      distractors: [x, y, y - x],
      solution: `Al igualar ambas expresiones se obtiene x=${x}; al reemplazar, y=${y}. Entonces a+b=${x + y}.`,
      visualData: { points: [[x, y]], caption: "Intersección de dos rectas" },
    });
  }

  if (pattern === 7) {
    const tens = [4, 5, 6, 7][edition];
    const ones = [2, 3, 1, 4][edition];
    const number = 10 * tens + ones;
    const digitSum = tens + ones;
    const difference = tens - ones;
    return makeQuestion(meta({ skill: "MODEL", difficulty: 4 }), edition, {
      statement: `Un número de dos cifras vale ${number}. Si x es la cifra de las decenas e y la de las unidades, ¿qué sistema permite recuperar las cifras usando además que su diferencia es ${difference}?`,
      correct: `10x + y = ${number}; x - y = ${difference}`,
      distractors: [`x + 10y = ${number}; x - y = ${difference}`, `x + y = ${number}; x - y = ${difference}`, `10x + y = ${digitSum}; x + y = ${number}`],
      solution: `El valor posicional es 10x+y=${number}, y la diferencia indicada es x-y=${difference}.`,
    });
  }

  const a = [2, 3, 4, 5][edition];
  const b = [3, 2, 5, 4][edition];
  const c = [12, 15, 18, 21][edition];
  return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
    statement: `Considera ${a}x + ${b}y = ${c} y ${2 * a}x + ${2 * b}y = ${2 * c + 1}. ¿Cómo se clasifica el sistema?`,
    correct: "No tiene solución, porque los lados izquierdos son proporcionales pero los términos independientes no.",
    distractors: ["Tiene una única solución.", "Tiene infinitas soluciones.", "Siempre tiene la solución x=0, y=0."],
    solution: `Duplicar la primera ecuación produciría término independiente ${2 * c}, no ${2 * c + 1}; las rectas son paralelas distintas.`,
  });
}

function linearQuestion(pattern: number, edition: number): Question {
  const family = `alg-lin-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Función lineal y afín",
    topic: "Tablas, gráficos, pendientes e interceptos",
    skill: "SOLVE",
    difficulty: 3,
    context: "MATHEMATICAL",
    resource: "TEXT",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const slope = [2, -3, 4, -2][edition];
    const x1 = [1, 2, -1, 3][edition];
    const y1 = [4, 5, 2, 7][edition];
    const x2 = x1 + 3;
    const y2 = y1 + slope * 3;
    return makeQuestion(meta({ resource: "CARTESIAN", skill: "REPRESENT" }), edition, {
      statement: `Una recta pasa por (${x1},${y1}) y (${x2},${y2}). ¿Cuál es su pendiente?`,
      correct: slope,
      distractors: [Math.round(1 / slope * 100) / 100, y2 - y1, x2 - x1],
      solution: `m=(${y2}-${y1})/(${x2}-${x1})=${y2 - y1}/3=${slope}.`,
      visualData: { points: [[x1, y1], [x2, y2]], caption: "Dos puntos de la recta" },
    });
  }

  if (pattern === 1) {
    const fixed = [5000, 8000, 12000, 6500][edition];
    const rate = [900, 1200, 750, 1500][edition];
    return makeQuestion(meta({ context: "DAILY_LIFE", skill: "MODEL", difficulty: 2 }), edition, {
      statement: `Un servicio se modela por C(x) = ${fixed} + ${rate}x, donde x es la cantidad de usos. ¿Qué representa ${fixed}?`,
      correct: `El cobro fijo, aunque no se realice ningún uso.`,
      distractors: [`El precio de cada uso.`, `La cantidad máxima de usos.`, `El descuento aplicado al total.`],
      solution: `C(0)=${fixed}; por eso es el intercepto o costo fijo.`,
    });
  }

  if (pattern === 2) {
    const slope = [3, 4, -2, 5][edition];
    const intercept = [2, -1, 8, 3][edition];
    const xs = [0, 1, 2, 3];
    const values = xs.map((x) => slope * x + intercept);
    return makeQuestion(meta({ resource: "TABLE", skill: "REPRESENT", difficulty: 2 }), edition, {
      statement: `¿Qué función corresponde a los valores de la tabla?`,
      correct: `f(x) = ${slope}x ${intercept >= 0 ? "+" : "-"} ${Math.abs(intercept)}`,
      distractors: [`f(x) = ${intercept}x ${slope >= 0 ? "+" : "-"} ${Math.abs(slope)}`, `f(x) = ${slope}x`, `f(x) = x ${intercept >= 0 ? "+" : "-"} ${Math.abs(intercept)}`],
      solution: `La variación por cada unidad de x es ${slope} y f(0)=${intercept}.`,
      visualData: { labels: xs.map((x) => `x=${x}`), values, caption: "Valores de f(x)" },
    });
  }

  if (pattern === 3) {
    const slope = [2, -2, 3, -1][edition];
    const intercept = [1, 6, -2, 5][edition];
    const points: [number, number][] = [[0, intercept], [2, 2 * slope + intercept]];
    return makeQuestion(meta({ resource: "CARTESIAN", skill: "REPRESENT" }), edition, {
      statement: `La gráfica de una función afín pasa por los puntos mostrados. ¿Qué expresión la representa?`,
      correct: `y = ${slope}x ${intercept >= 0 ? "+" : "-"} ${Math.abs(intercept)}`,
      distractors: [`y = ${intercept}x ${slope >= 0 ? "+" : "-"} ${Math.abs(slope)}`, `y = ${slope}x`, `y = ${slope + intercept}x`],
      solution: `La pendiente es ${slope} y el corte con el eje y es ${intercept}.`,
      visualData: { points, caption: "Puntos de una función afín" },
    });
  }

  if (pattern === 4) {
    const fixedA = [4000, 6000, 9000, 5000][edition];
    const rateA = [1000, 1400, 800, 1600][edition];
    const fixedB = [10000, 12000, 15000, 14000][edition];
    const rateB = [500, 900, 400, 700][edition];
    const threshold = (fixedB - fixedA) / (rateA - rateB);
    return makeQuestion(meta({ context: "DAILY_LIFE", skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Los costos de dos planes son A(x)=${fixedA}+${rateA}x y B(x)=${fixedB}+${rateB}x. ¿Para qué cantidad x cuestan lo mismo?`,
      correct: formatNumber(threshold),
      distractors: [formatNumber((fixedB + fixedA) / (rateA - rateB)), formatNumber((fixedB - fixedA) / (rateA + rateB)), formatNumber(threshold + 1)],
      solution: `Se igualan los modelos: ${fixedA}+${rateA}x=${fixedB}+${rateB}x; x=${formatNumber(threshold)}.`,
    });
  }

  if (pattern === 5) {
    const initial = [120, 85, 200, 150][edition];
    const change = [-4, 6, -8, 5][edition];
    return makeQuestion(meta({ context: "SCIENTIFIC", skill: "MODEL", difficulty: 3 }), edition, {
      statement: `Una magnitud se modela por M(t)=${initial}${change >= 0 ? "+" : ""}${change}t. ¿Qué interpreta correctamente el coeficiente de t?`,
      correct: `La magnitud cambia ${Math.abs(change)} unidades por período${change < 0 ? ", disminuyendo" : ", aumentando"}.`,
      distractors: [`La magnitud inicial es ${Math.abs(change)}.`, `La magnitud final siempre es ${initial + change}.`, `El tiempo máximo es ${Math.abs(change)} períodos.`],
      solution: `El coeficiente ${change} es la tasa de variación por unidad de tiempo.`,
    });
  }

  if (pattern === 6) {
    const slope = [3, -2, 4, -5][edition];
    const intercept = [7, 9, -3, 6][edition];
    const x = [4, -3, 2, -2][edition];
    const correct = slope * x + intercept;
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 3 }), edition, {
      statement: `Para evaluar f(x)=${slope}x${intercept >= 0 ? "+" : ""}${intercept} en x=${x}, se calcula f(${x})=${slope}+${x}${intercept >= 0 ? "+" : ""}${intercept}. ¿Cuál es el error?`,
      correct: `Se sumó ${slope} y ${x}, pero debían multiplicarse; f(${x})=${correct}.`,
      distractors: ["No se debe reemplazar x por un número negativo.", `El término independiente debería multiplicarse por x.`, "La evaluación propuesta es correcta."],
      solution: `Se reemplaza x y se respeta el producto: ${slope}·(${x})${intercept >= 0 ? "+" : ""}${intercept}=${correct}.`,
    });
  }

  if (pattern === 7) {
    const slope = [4, 5, 3, 6][edition];
    const intercept = [7, 2, 8, 5][edition];
    const x = [6, 8, 10, 7][edition];
    const target = slope * x + intercept;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Si f(x)=${slope}x+${intercept}, ¿para qué valor de x se cumple f(x)=${target}?`,
      correct: x,
      distractors: [target - intercept, formatNumber(target / slope), x + 1],
      solution: `${slope}x+${intercept}=${target}; x=(${target}-${intercept})/${slope}=${x}.`,
    });
  }

  const slope = [3, 5, 2, 4][edition];
  const intercept = [4, -3, 7, 1][edition];
  return makeQuestion(meta({ skill: "ARGUE", difficulty: 3 }), edition, {
    statement: `Respecto de f(x)=${slope}x${intercept >= 0 ? "+" : ""}${intercept}, ¿cuál afirmación es verdadera?`,
    correct: `Es una función afín y no una proporción directa porque f(0)=${intercept}.`,
    distractors: [`Es una proporción directa porque su pendiente es ${slope}.`, "Es cuadrática porque contiene dos términos.", `Es constante porque f(0)=${intercept}.`],
    solution: `Una proporción directa tiene forma f(x)=kx y pasa por el origen. Aquí el intercepto es ${intercept}≠0.`,
  });
}

function quadraticQuestion(pattern: number, edition: number): Question {
  const family = `alg-quad-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Función cuadrática",
    topic: "Ecuaciones, gráficos y puntos especiales",
    skill: "SOLVE",
    difficulty: 4,
    context: "MATHEMATICAL",
    resource: "TEXT",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const r1 = [2, -3, 4, -2][edition];
    const r2 = [5, 2, -1, 6][edition];
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `¿Cuáles son las soluciones de (x ${r1 >= 0 ? "-" : "+"} ${Math.abs(r1)})(x ${r2 >= 0 ? "-" : "+"} ${Math.abs(r2)}) = 0?`,
      correct: `x = ${r1} o x = ${r2}`,
      distractors: [`x = ${-r1} o x = ${-r2}`, `x = ${r1 + r2}`, `x = ${r1 * r2}`],
      solution: `Por producto nulo, cada factor puede ser cero; las raíces son ${r1} y ${r2}.`,
    });
  }

  if (pattern === 1) {
    const h = [3, -2, 4, -1][edition];
    const k = [-5, 6, -3, 8][edition];
    return makeQuestion(meta({ skill: "REPRESENT", resource: "CARTESIAN", difficulty: 3 }), edition, {
      statement: `¿Cuál es el vértice de f(x)=(x ${h >= 0 ? "-" : "+"} ${Math.abs(h)})² ${k >= 0 ? "+" : "-"} ${Math.abs(k)}?`,
      correct: `(${h}, ${k})`,
      distractors: [`(${-h}, ${k})`, `(${h}, ${-k})`, `(${-h}, ${-k})`],
      solution: `En la forma (x-h)²+k, el vértice es (h,k); aquí es (${h},${k}).`,
      visualData: { points: [[h, k]], caption: "Vértice de la parábola" },
    });
  }

  if (pattern === 2) {
    const r1 = [1, -2, 3, -1][edition];
    const r2 = [4, 5, -2, 6][edition];
    const yIntercept = r1 * r2;
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 4 }), edition, {
      statement: `La función f(x)=(x-${r1})(x-${r2}) tiene ceros en ${r1} y ${r2}. ¿Cuál es su intersección con el eje y?`,
      correct: `(0, ${yIntercept})`,
      distractors: [`(0, ${r1 + r2})`, `(${yIntercept}, 0)`, `(0, ${-yIntercept})`],
      solution: `En el eje y, x=0: f(0)=(-${r1})(-${r2})=${yIntercept}.`,
    });
  }

  if (pattern === 3) {
    const a = [2, -1, 3, -2][edition];
    const b = [3, 4, -2, 5][edition];
    const c = [1, -3, 6, 4][edition];
    const x = [2, -2, 3, -1][edition];
    const correct = a * x ** 2 + b * x + c;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Si f(x)=${a}x²${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c}, ¿cuánto vale f(${x})?`,
      correct,
      distractors: [a * x + b * x + c, a * x ** 2 - b * x + c, a * x ** 2 + b * x],
      solution: `f(${x})=${a}·(${x})²${b >= 0 ? "+" : ""}${b}·(${x})${c >= 0 ? "+" : ""}${c}=${correct}.`,
    });
  }

  if (pattern === 4) {
    const a = [2, -3, 0.5, -0.25][edition];
    return makeQuestion(meta({ skill: "ARGUE", resource: "CARTESIAN", difficulty: 5 }), edition, {
      statement: `Para f(x)=${formatNumber(a)}x², ¿qué afirmación describe correctamente el efecto del parámetro principal?`,
      correct: `${a > 0 ? "La parábola abre hacia arriba" : "La parábola abre hacia abajo"} y ${Math.abs(a) > 1 ? "es más estrecha que y=x²" : "es más ancha que y=x²"}.`,
      distractors: [`La parábola abre ${a > 0 ? "hacia abajo" : "hacia arriba"} y conserva el mismo ancho.`, "El parámetro sólo desplaza horizontalmente la gráfica.", "La gráfica se transforma en una recta."],
      solution: `El signo de a determina la apertura y |a| compara la dilatación vertical con y=x².`,
    });
  }

  if (pattern === 5) {
    const vertexTime = [3, 4, 5, 2][edition];
    const maxHeight = [36, 48, 60, 28][edition];
    const coefficient = [-4, -3, -2, -5][edition];
    return makeQuestion(meta({ context: "SCIENTIFIC", skill: "MODEL", difficulty: 4 }), edition, {
      statement: `La altura de un objeto se modela por h(t)=${coefficient}(t-${vertexTime})²+${maxHeight}. ¿Qué altura máxima alcanza y cuándo?`,
      correct: `${maxHeight} m a los ${vertexTime} s`,
      distractors: [`${vertexTime} m a los ${maxHeight} s`, `${maxHeight + Math.abs(coefficient)} m a los ${vertexTime} s`, `0 m a los ${vertexTime} s`],
      solution: `Como el coeficiente es negativo, el vértice (${vertexTime},${maxHeight}) es un máximo.`,
    });
  }

  if (pattern === 6) {
    const r1 = [2, -3, 1, -4][edition];
    const r2 = [6, 4, -5, 3][edition];
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 3 }), edition, {
      statement: `¿Qué ecuación cuadrática tiene soluciones x=${r1} y x=${r2}?`,
      correct: `(x ${r1 >= 0 ? "-" : "+"} ${Math.abs(r1)})(x ${r2 >= 0 ? "-" : "+"} ${Math.abs(r2)}) = 0`,
      distractors: [`(x ${r1 >= 0 ? "+" : "-"} ${Math.abs(r1)})(x ${r2 >= 0 ? "+" : "-"} ${Math.abs(r2)}) = 0`, `x² = ${r1 + r2}`, `x² + ${r1 * r2} = 0`],
      solution: `Una ecuación con raíces r₁ y r₂ se construye como (x-r₁)(x-r₂)=0.`,
    });
  }

  if (pattern === 7) {
    const r1 = [2, 3, -2, 4][edition];
    const r2 = [5, -1, 6, -3][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Al resolver (x-${r1})(x-${r2})=0, una persona multiplica los factores, obtiene una cuadrática y concluye que x=${r1 + r2}. ¿Qué principio debía aplicar?`,
      correct: `El producto nulo: x-${r1}=0 o x-${r2}=0.`,
      distractors: ["Sumar los factores e igualar la suma a cero.", "Dividir ambos factores por x.", "Tomar la raíz cuadrada de cada término por separado."],
      solution: `Un producto es cero cuando al menos uno de sus factores es cero; las soluciones son ${r1} y ${r2}.`,
    });
  }

  const h = [2, -1, 3, 0][edition];
  const k = [-4, 5, -2, 3][edition];
  const xs = [h - 2, h - 1, h, h + 1, h + 2];
  const values = xs.map((x) => (x - h) ** 2 + k);
  return makeQuestion(meta({ skill: "REPRESENT", resource: "TABLE", difficulty: 3 }), edition, {
    statement: `La tabla muestra valores simétricos de una función cuadrática. ¿Cuál es su vértice?`,
    correct: `(${h}, ${k})`,
    distractors: [`(${k}, ${h})`, `(${h + 1}, ${k})`, `(${h}, ${k + 1})`],
    solution: `El menor valor ${k} ocurre en x=${h} y los valores a igual distancia son iguales; el vértice es (${h},${k}).`,
    visualData: { labels: xs.map((x) => `x=${x}`), values, caption: "Valores de la función cuadrática" },
  });
}

export function buildAlgebraFunctionsBank() {
  return [
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => systemsQuestion(pattern, edition))).flat(),
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => linearQuestion(pattern, edition))).flat(),
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => quadraticQuestion(pattern, edition))).flat(),
  ];
}
