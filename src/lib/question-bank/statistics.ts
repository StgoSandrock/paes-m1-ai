import type { Question } from "../types";
import { editions, formatNumber, makeQuestion, type RecipeMeta } from "./helpers";

const axis = "PROBABILITY_STATISTICS" as const;

function dataQuestion(pattern: number, edition: number): Question {
  const family = `stat-data-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Representación de datos a través de tablas y gráficos",
    topic: "Frecuencias, gráficos y promedio",
    skill: "SOLVE",
    difficulty: 3,
    context: "DAILY_LIFE",
    resource: "TABLE",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const center = [12, 18, 25, 30][edition];
    const values = [center - 4, center - 2, center, center + 2, center + 4];
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `Los valores registrados son ${values.join(", ")}. ¿Cuál es su promedio?`,
      correct: center,
      distractors: [center - 2, center + 2, values.reduce((sum, value) => sum + value, 0)],
      solution: `La suma es ${values.reduce((sum, value) => sum + value, 0)} y hay 5 datos; el promedio es ${center}.`,
      visualData: { labels: ["1", "2", "3", "4", "5"], values, caption: "Valores registrados" },
    });
  }

  if (pattern === 1) {
    const scores = [[2, 4, 6], [3, 5, 7], [4, 6, 8], [5, 7, 9]][edition];
    const frequencies = [[2, 3, 5], [4, 2, 4], [3, 5, 2], [5, 3, 2]][edition];
    const total = frequencies.reduce((sum, value) => sum + value, 0);
    const weighted = scores.reduce((sum, value, index) => sum + value * frequencies[index], 0);
    const correct = weighted / total;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `En una tabla, los valores ${scores.join(", ")} tienen frecuencias ${frequencies.join(", ")}, respectivamente. ¿Cuál es el promedio?`,
      correct: formatNumber(correct),
      distractors: [formatNumber(scores[0] + scores[2]), formatNumber(weighted / scores.length), formatNumber(total / scores.length)],
      solution: `Promedio ponderado = (${scores.map((value, index) => `${value}·${frequencies[index]}`).join("+")})/${total}=${formatNumber(correct)}.`,
      visualData: { labels: scores.map(String), values: frequencies, caption: "Frecuencia por valor" },
    });
  }

  if (pattern === 2) {
    const total = [80, 120, 160, 200][edition];
    const frequency = [20, 36, 56, 90][edition];
    const correct = frequency / total;
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 2 }), edition, {
      statement: `Una categoría aparece ${frequency} veces en un total de ${total} observaciones. ¿Cuál es su frecuencia relativa?`,
      correct: formatNumber(correct),
      distractors: [formatNumber(correct * 100), formatNumber((total - frequency) / total), formatNumber(total / frequency)],
      solution: `Frecuencia relativa = ${frequency}/${total}=${formatNumber(correct)}.`,
      distractorReasons: ["Expresa el porcentaje sin convertirlo a frecuencia relativa decimal.", "Calcula la frecuencia de la categoría complementaria.", "Invierte el cociente."],
    });
  }

  if (pattern === 3) {
    const contexts = ["la evolución mensual de una temperatura", "la distribución de preferencias entre categorías", "la relación entre dos variables numéricas", "la mediana y los cuartiles de dos grupos"][edition];
    const correct = ["Gráfico de líneas", "Gráfico de barras", "Gráfico de dispersión", "Diagrama de cajón"][edition];
    const pool = ["Gráfico de barras", "Gráfico de líneas", "Diagrama de cajón", "Tabla sin ordenar"].filter((value) => value !== correct);
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 2, resource: "TEXT" }), edition, {
      statement: `¿Qué representación es más apropiada para comunicar ${contexts}?`,
      correct,
      distractors: [pool[0], pool[1], pool[2]],
      solution: `${correct} permite mostrar con claridad ${contexts}.`,
      distractorReasons: ["No destaca la relación principal que se desea comunicar.", "Oculta parte de la variación relevante.", "No es la representación más directa para este tipo de datos."],
    });
  }

  if (pattern === 4) {
    const values = [[18, 24, 30, 28], [35, 20, 25, 40], [42, 38, 46, 34], [55, 60, 50, 65]][edition];
    const labels = ["A", "B", "C", "D"];
    const maximum = Math.max(...values);
    const maxLabel = labels[values.indexOf(maximum)];
    const total = values.reduce((sum, value) => sum + value, 0);
    return makeQuestion(meta({ skill: "ARGUE", resource: "BAR_CHART", difficulty: 3 }), edition, {
      statement: `Según el gráfico, ¿cuál afirmación está respaldada por los datos?`,
      correct: `La categoría ${maxLabel} presenta la mayor frecuencia, con ${maximum}.`,
      distractors: [`Todas las categorías suman ${maximum}.`, `La categoría A representa exactamente el 50 % del total.`, `La menor frecuencia es ${total}.`],
      solution: `Al comparar las alturas/valores, el máximo es ${maximum} y corresponde a ${maxLabel}.`,
      visualData: { labels, values, caption: "Frecuencia por categoría" },
    });
  }

  if (pattern === 5) {
    const mean = [14, 20, 25, 32][edition];
    const known = [[10, 12, 15, 17], [16, 18, 21, 24], [20, 24, 27, 28], [28, 30, 34, 35]][edition];
    const missing = mean * 5 - known.reduce((sum, value) => sum + value, 0);
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Cinco mediciones tienen promedio ${mean}. Cuatro de ellas son ${known.join(", ")}. ¿Cuál es la quinta medición?`,
      correct: missing,
      distractors: [mean * 4 - known.reduce((sum, value) => sum + value, 0), mean, known.reduce((sum, value) => sum + value, 0) / 4],
      solution: `La suma total debe ser 5·${mean}=${5 * mean}. La suma conocida es ${known.reduce((sum, value) => sum + value, 0)}; falta ${missing}.`,
    });
  }

  if (pattern === 6) {
    const mean = [18, 24, 30, 36][edition];
    const count = [5, 6, 8, 10][edition];
    const added = [30, 36, 46, 58][edition];
    const newMean = (mean * count + added) / (count + 1);
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4, resource: "TEXT" }), edition, {
      statement: `Un conjunto de ${count} datos tiene promedio ${mean}. Se agrega el dato ${added}. ¿Cuál es el nuevo promedio?`,
      correct: formatNumber(newMean),
      distractors: [formatNumber((mean + added) / 2), formatNumber(mean + added / (count + 1)), formatNumber(mean * count / (count + 1))],
      solution: `La suma original es ${mean}·${count}=${mean * count}. El nuevo promedio es (${mean * count}+${added})/${count + 1}=${formatNumber(newMean)}.`,
    });
  }

  if (pattern === 7) {
    const values = [[12, 27, 18, 9], [24, 16, 30, 20], [35, 42, 28, 39], [48, 36, 52, 44]][edition];
    const labels = ["Norte", "Sur", "Este", "Oeste"];
    const maximum = Math.max(...values);
    const minimum = Math.min(...values);
    return makeQuestion(meta({ skill: "REPRESENT", resource: "BAR_CHART", difficulty: 2 }), edition, {
      statement: `¿Cuál es la diferencia entre la mayor y la menor cantidad mostrada en el gráfico?`,
      correct: maximum - minimum,
      distractors: [maximum + minimum, maximum, minimum],
      solution: `El máximo es ${maximum} y el mínimo ${minimum}; la diferencia es ${maximum - minimum}.`,
      visualData: { labels, values, caption: "Cantidad por zona" },
    });
  }

  const values = [[10, 14, 13, 19, 22], [25, 23, 28, 31, 30], [40, 44, 49, 47, 55], [60, 58, 63, 69, 72]][edition];
  const changes = values.slice(1).map((value, index) => value - values[index]);
  const maxChange = Math.max(...changes);
  const period = changes.indexOf(maxChange) + 1;
  const otherPeriods = [1, 2, 3, 4].filter((value) => value !== period).slice(0, 2);
  return makeQuestion(meta({ skill: "REPRESENT", resource: "LINE_CHART", difficulty: 3 }), edition, {
    statement: `El gráfico registra cinco períodos consecutivos. ¿Entre qué períodos ocurrió el mayor aumento?`,
    correct: `Entre los períodos ${period} y ${period + 1}`,
    distractors: [`Entre los períodos ${otherPeriods[0]} y ${otherPeriods[0] + 1}`, `Entre los períodos ${otherPeriods[1]} y ${otherPeriods[1] + 1}`, `No hubo aumentos`],
    solution: `Las variaciones son ${changes.join(", ")}; la mayor es ${maxChange}, entre ${period} y ${period + 1}.`,
    visualData: { labels: ["1", "2", "3", "4", "5"], values, caption: "Evolución por período" },
  });
}

function positionQuestion(pattern: number, edition: number): Question {
  const family = `stat-pos-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Medidas de posición",
    topic: "Mediana, cuartiles, percentiles y diagramas de cajón",
    skill: "SOLVE",
    difficulty: 3,
    context: "MATHEMATICAL",
    resource: "TEXT",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const center = [14, 20, 27, 35][edition];
    const values = [center - 7, center - 3, center, center + 2, center + 8];
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `Los datos ordenados son ${values.join(", ")}. ¿Cuál es la mediana?`,
      correct: center,
      distractors: [center - 3, center + 2, values[4]],
      solution: `Hay cinco datos; la mediana es el tercero, ${center}.`,
    });
  }

  if (pattern === 1) {
    const start = [4, 8, 12, 20][edition];
    const values = Array.from({ length: 8 }, (_, index) => start + index * 2);
    const q1 = (values[1] + values[2]) / 2;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Para los ocho datos ordenados ${values.join(", ")}, ¿cuál es el primer cuartil Q1?`,
      correct: q1,
      distractors: [values[1], values[2], (values[3] + values[4]) / 2],
      solution: `La mitad inferior es ${values.slice(0, 4).join(", ")}; su mediana es (${values[1]}+${values[2]})/2=${q1}.`,
    });
  }

  if (pattern === 2) {
    const total = [100, 200, 80, 120][edition];
    const percentile = [25, 40, 75, 60][edition];
    const correct = total * percentile / 100;
    return makeQuestion(meta({ context: "DAILY_LIFE", skill: "REPRESENT" }), edition, {
      statement: `En un grupo de ${total} resultados ordenados, un valor está en el percentil ${percentile}. Aproximadamente, ¿cuántos resultados están en o bajo esa posición?`,
      correct,
      distractors: [total - correct, formatNumber(percentile / 100), Math.round(total / percentile)],
      solution: `P${percentile} ubica aproximadamente al ${percentile} % de ${total}: ${total}·${percentile}/100=${correct}.`,
    });
  }

  if (pattern === 3) {
    const summaries = [
      { a: [2, 5, 8, 11, 14], b: [1, 4, 8, 12, 16] },
      { a: [10, 14, 18, 22, 26], b: [8, 13, 18, 23, 28] },
      { a: [20, 24, 30, 36, 40], b: [18, 25, 30, 35, 42] },
      { a: [30, 36, 42, 48, 54], b: [28, 34, 42, 50, 56] },
    ][edition];
    const iqrA = summaries.a[3] - summaries.a[1];
    const iqrB = summaries.b[3] - summaries.b[1];
    const correct = iqrA === iqrB ? "Ambos grupos tienen el mismo rango intercuartílico." : iqrA > iqrB ? "El grupo A tiene mayor rango intercuartílico." : "El grupo B tiene mayor rango intercuartílico.";
    return makeQuestion(meta({ skill: "ARGUE", resource: "BOX_PLOT", difficulty: 5 }), edition, {
      statement: `Los resúmenes (mínimo, Q1, mediana, Q3, máximo) son A: ${summaries.a.join(", ")} y B: ${summaries.b.join(", ")}. ¿Qué afirmación es correcta?`,
      correct,
      distractors: ["El grupo con mayor máximo siempre tiene mayor rango intercuartílico.", "Ambos grupos tienen necesariamente el mismo promedio.", "No se puede calcular el rango intercuartílico con estos datos."],
      solution: `RIC(A)=${summaries.a[3]}-${summaries.a[1]}=${iqrA}; RIC(B)=${summaries.b[3]}-${summaries.b[1]}=${iqrB}.`,
      visualData: { boxPlots: [{ label: "A", values: summaries.a }, { label: "B", values: summaries.b }], caption: "Resumen de cinco números" },
    });
  }

  if (pattern === 4) {
    const center = [20, 30, 40, 50][edition];
    const values = [center - 4, center - 2, center, center + 2, center + 4];
    const outlier = [100, 150, 200, 300][edition];
    const newValues = [...values, outlier].sort((a, b) => a - b);
    const newMedian = (newValues[2] + newValues[3]) / 2;
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `El conjunto ${values.join(", ")} tiene mediana ${center}. Se agrega el valor ${outlier}. ¿Cuál es la nueva mediana?`,
      correct: newMedian,
      distractors: [center, outlier, values[4]],
      solution: `Ordenados los seis datos, los centrales son ${newValues[2]} y ${newValues[3]}; la mediana es ${newMedian}.`,
    });
  }

  if (pattern === 5) {
    const median = [15, 22, 30, 42][edition];
    const lower = [median - 8, median - 3];
    const upper = [median + 5, median + 10];
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Cinco datos ordenados son ${lower[0]}, ${lower[1]}, x, ${upper[0]}, ${upper[1]}. Si la mediana es ${median}, ¿cuánto vale x?`,
      correct: median,
      distractors: [lower[1], upper[0], (lower[1] + upper[0]) / 2],
      solution: `Con cinco datos ordenados, la mediana es el tercero; por tanto, x=${median}.`,
    });
  }

  if (pattern === 6) {
    const q1 = [12, 18, 25, 32][edition];
    const q3 = [28, 42, 55, 68][edition];
    const correct = q3 - q1;
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `En un diagrama de cajón, Q1=${q1} y Q3=${q3}. ¿Cuál es el rango intercuartílico?`,
      correct,
      distractors: [q3 + q1, q3, q1],
      solution: `RIC=Q3-Q1=${q3}-${q1}=${correct}.`,
    });
  }

  if (pattern === 7) {
    const q1 = [20, 25, 30, 40][edition];
    const median = [35, 40, 50, 60][edition];
    const q3 = [50, 60, 70, 80][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 3 }), edition, {
      statement: `Un conjunto tiene Q1=${q1}, mediana=${median} y Q3=${q3}. ¿Cuál afirmación es válida?`,
      correct: `Aproximadamente el 50 % central de los datos está entre ${q1} y ${q3}.`,
      distractors: [`Todos los datos están entre ${q1} y ${q3}.`, `El promedio necesariamente es ${median}.`, `Exactamente el 75 % de los datos es menor que ${q1}.`],
      solution: `Por definición, entre Q1 y Q3 se ubica el 50 % central de la distribución.`,
    });
  }

  const summary = [[2, 6, 10, 14, 20], [5, 10, 16, 22, 30], [8, 15, 24, 31, 40], [12, 20, 32, 44, 56]][edition];
  return makeQuestion(meta({ skill: "REPRESENT", resource: "BOX_PLOT", difficulty: 3 }), edition, {
    statement: `¿Qué resumen de cinco números describe el diagrama de cajón indicado?`,
    correct: `Mín=${summary[0]}, Q1=${summary[1]}, Mediana=${summary[2]}, Q3=${summary[3]}, Máx=${summary[4]}`,
    distractors: [`Mín=${summary[1]}, Q1=${summary[0]}, Mediana=${summary[2]}, Q3=${summary[4]}, Máx=${summary[3]}`, `Mín=${summary[0]}, Q1=${summary[2]}, Mediana=${summary[1]}, Q3=${summary[3]}, Máx=${summary[4]}`, `Mín=${summary[0]}, Q1=${summary[1]}, Mediana=${summary[3]}, Q3=${summary[2]}, Máx=${summary[4]}`],
    solution: `De izquierda a derecha se leen mínimo, Q1, mediana, Q3 y máximo.`,
    visualData: { boxPlots: [{ label: "Datos", values: summary }], caption: "Diagrama de cajón" },
  });
}

function probabilityQuestion(pattern: number, edition: number): Question {
  const family = `stat-prob-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Reglas de las probabilidades",
    topic: "Eventos, regla aditiva y multiplicativa",
    skill: "SOLVE",
    difficulty: 3,
    context: "MATHEMATICAL",
    resource: "TEXT",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const total = [12, 15, 20, 24][edition];
    const favorable = [3, 5, 8, 6][edition];
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `Una bolsa contiene ${total} fichas equiprobables y ${favorable} son verdes. ¿Cuál es la probabilidad de extraer una verde?`,
      correct: `${favorable}/${total}`,
      distractors: [`${total - favorable}/${total}`, `${favorable}/${total - favorable}`, `${favorable}/${total + favorable}`],
      solution: `P=casos favorables/casos posibles=${favorable}/${total}.`,
    });
  }

  if (pattern === 1) {
    const probability = [0.2, 0.35, 0.4, 0.65][edition];
    const complement = 1 - probability;
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 2 }), edition, {
      statement: `La probabilidad de que ocurra un evento A es ${formatNumber(probability)}. ¿Cuál es la probabilidad de que A no ocurra?`,
      correct: formatNumber(complement),
      distractors: [formatNumber(probability), formatNumber(1 + probability), formatNumber(probability ** 2)],
      solution: `P(Aᶜ)=1-P(A)=1-${formatNumber(probability)}=${formatNumber(complement)}.`,
    });
  }

  if (pattern === 2) {
    const red = [3, 4, 5, 6][edition];
    const blue = [5, 6, 7, 8][edition];
    const other = [4, 5, 8, 10][edition];
    const total = red + blue + other;
    const favorable = red + blue;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Una caja contiene ${red} fichas rojas, ${blue} azules y ${other} blancas. ¿Cuál es la probabilidad de extraer una roja o una azul?`,
      correct: `${favorable}/${total}`,
      distractors: [`${red * blue}/${total}`, `${other}/${total}`, `${favorable}/${red * blue}`],
      solution: `Como los colores son eventos excluyentes, se suman casos favorables: (${red}+${blue})/${total}=${favorable}/${total}.`,
    });
  }

  if (pattern === 3) {
    const sides = [6, 8, 10, 12][edition];
    const favorable = [2, 3, 4, 5][edition];
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Se realizan dos selecciones independientes. En cada una, la probabilidad de éxito es ${favorable}/${sides}. ¿Cuál es la probabilidad de obtener éxito en ambas?`,
      correct: `${favorable ** 2}/${sides ** 2}`,
      distractors: [`${2 * favorable}/${sides}`, `${favorable}/${sides ** 2}`, `${favorable ** 2}/${2 * sides}`],
      solution: `Por independencia se multiplican: (${favorable}/${sides})·(${favorable}/${sides})=${favorable ** 2}/${sides ** 2}.`,
    });
  }

  if (pattern === 4) {
    const total = [10, 12, 15, 20][edition];
    const favorable = [4, 5, 6, 8][edition];
    const numerator = favorable * (favorable - 1);
    const denominator = total * (total - 1);
    return makeQuestion(meta({ difficulty: 4 }), edition, {
      statement: `Una bolsa tiene ${total} fichas, ${favorable} de ellas premiadas. Se extraen dos sin reposición. ¿Cuál es la probabilidad de que ambas sean premiadas?`,
      correct: `${favorable}/${total} · ${favorable - 1}/${total - 1}`,
      distractors: [`${favorable}/${total} · ${favorable}/${total}`, `${2 * favorable}/${total}`, `${total - favorable}/${total} · ${total - favorable - 1}/${total - 1}`],
      solution: `Sin reposición, tras un éxito quedan ${favorable - 1} favorables entre ${total - 1}: P=${numerator}/${denominator}.`,
    });
  }

  if (pattern === 5) {
    const target = [7, 8, 9, 10][edition];
    let favorable = 0;
    for (let first = 1; first <= 6; first += 1) for (let second = 1; second <= 6; second += 1) if (first + second === target) favorable += 1;
    return makeQuestion(meta({ resource: "TABLE", difficulty: 3 }), edition, {
      statement: `Se lanzan dos dados comunes. ¿Cuál es la probabilidad de que la suma sea ${target}?`,
      correct: `${favorable}/36`,
      distractors: [`${target}/36`, `${favorable}/12`, `${36 - favorable}/36`],
      solution: `Hay 36 pares ordenados equiprobables y ${favorable} suman ${target}; P=${favorable}/36.`,
      visualData: { labels: ["Favorables", "Otros"], values: [favorable, 36 - favorable], caption: "Resultados de dos dados" },
    });
  }

  if (pattern === 6) {
    const pA = [0.5, 0.4, 0.25, 0.6][edition];
    const pB = [0.3, 0.5, 0.4, 0.2][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Dos eventos independientes tienen probabilidades ${formatNumber(pA)} y ${formatNumber(pB)}. Para hallar la probabilidad de que ambos ocurran, una persona las suma. ¿Cuál es la corrección?`,
      correct: `Debe multiplicarlas y obtener ${formatNumber(pA * pB)}.`,
      distractors: [`Debe restarlas y obtener ${formatNumber(Math.abs(pA - pB))}.`, `La suma es correcta y da ${formatNumber(pA + pB)}.`, `Debe calcular 1-${formatNumber(pA + pB)}.`],
      solution: `Para la intersección de eventos independientes, P(A∩B)=P(A)·P(B)=${formatNumber(pA * pB)}.`,
    });
  }

  if (pattern === 7) {
    const gameAWin = [3, 4, 5, 2][edition];
    const gameATotal = [6, 8, 10, 4][edition];
    const gameBWin = [5, 6, 7, 4][edition];
    const gameBTotal = [10, 12, 14, 8][edition];
    const pA = gameAWin / gameATotal;
    const pB = gameBWin / gameBTotal;
    const correct = pA === pB ? "Ambos juegos ofrecen la misma probabilidad de ganar." : pA > pB ? "El juego A ofrece mayor probabilidad de ganar." : "El juego B ofrece mayor probabilidad de ganar.";
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `En el juego A hay ${gameAWin} resultados ganadores de ${gameATotal}; en B hay ${gameBWin} de ${gameBTotal}. ¿Cuál afirmación es correcta?`,
      correct,
      distractors: ["Conviene el juego con más resultados ganadores sin considerar el total.", "Conviene el juego con menos resultados posibles.", "No se pueden comparar fracciones con denominadores distintos."],
      solution: `P(A)=${gameAWin}/${gameATotal}=${formatNumber(pA)} y P(B)=${gameBWin}/${gameBTotal}=${formatNumber(pB)}.`,
    });
  }

  const choicesA = [3, 4, 5, 6][edition];
  const choicesB = [2, 3, 4, 5][edition];
  const choicesC = [4, 2, 3, 4][edition];
  const correct = choicesA * choicesB * choicesC;
  return makeQuestion(meta({ skill: "REPRESENT", resource: "DIAGRAM", difficulty: 3 }), edition, {
    statement: `Un experimento tiene tres etapas: ${choicesA} opciones en la primera, ${choicesB} en la segunda y ${choicesC} en la tercera. ¿Cuántas rutas distintas tiene su diagrama de árbol?`,
    correct,
    distractors: [choicesA + choicesB + choicesC, choicesA * choicesB + choicesC, choicesA + choicesB * choicesC],
    solution: `Por la regla multiplicativa, las rutas son ${choicesA}·${choicesB}·${choicesC}=${correct}.`,
    visualData: { values: [choicesA, choicesB, choicesC], caption: "Opciones en cada etapa" },
  });
}

export function buildStatisticsBank() {
  return [
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => dataQuestion(pattern, edition))).flat(),
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => positionQuestion(pattern, edition))).flat(),
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => probabilityQuestion(pattern, edition))).flat(),
  ];
}
