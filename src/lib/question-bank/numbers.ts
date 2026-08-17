import type { Question } from "../types";
import { editions, formatNumber, makeQuestion, money, type RecipeMeta } from "./helpers";

const axis = "NUMBERS" as const;

function integerQuestion(pattern: number, edition: number): Question {
  const family = `num-int-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Enteros y racionales",
    topic: "Operaciones, orden y problemas",
    skill: "SOLVE",
    difficulty: 2,
    context: "DAILY_LIFE",
    resource: "TEXT",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const start = [14, 18, 11, 22][edition];
    const down = [23, 31, 19, 35][edition];
    const up = [7, 9, 12, 8][edition];
    const correct = start - down + up;
    return makeQuestion(meta(), edition, {
      statement: `Una cámara térmica comienza a ${start} °C, baja ${down} °C y luego sube ${up} °C. ¿Qué temperatura alcanza?`,
      correct: `${correct} °C`,
      distractors: [`${start - down - up} °C`, `${down - start + up} °C`, `${start + down - up} °C`],
      solution: `${start} - ${down} + ${up} = ${correct}.`,
      distractorReasons: ["Suma el último cambio con signo negativo.", "Invierte el orden del primer cambio.", "Trata el descenso como un aumento."],
    });
  }

  if (pattern === 1) {
    const final = [86, 124, 73, 155][edition];
    const incoming = [28, 45, 19, 62][edition];
    const outgoing = [37, 31, 26, 48][edition];
    const correct = final - incoming + outgoing;
    return makeQuestion(meta({ skill: "MODEL", difficulty: 3 }), edition, {
      statement: `Al terminar el día quedan ${final} cajas en una bodega. Durante el día ingresaron ${incoming} y salieron ${outgoing}. ¿Cuántas cajas había al comenzar?`,
      correct,
      distractors: [final + incoming - outgoing, final - incoming - outgoing, final + incoming + outgoing],
      solution: `Si x es la cantidad inicial, x + ${incoming} - ${outgoing} = ${final}; por tanto, x = ${correct}.`,
      distractorReasons: ["Reconstruye los cambios en el mismo sentido, no en sentido inverso.", "Resta tanto entradas como salidas.", "Suma todos los datos sin modelar el balance."],
    });
  }

  if (pattern === 2) {
    const total = [48, 60, 72, 96][edition];
    const firstDenominator = [4, 5, 6, 8][edition];
    const secondDenominator = [3, 4, 3, 4][edition];
    const afterFirst = total - total / firstDenominator;
    const correct = afterFirst - afterFirst / secondDenominator;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `De un rollo de ${total} m se usa primero 1/${firstDenominator} del total. Después se usa 1/${secondDenominator} de lo que quedó. ¿Cuántos metros quedan?`,
      correct: `${correct} m`,
      distractors: [`${total - total / firstDenominator - total / secondDenominator} m`, `${afterFirst / secondDenominator} m`, `${total} m`],
      solution: `Tras el primer uso quedan ${afterFirst} m; el segundo uso es ${afterFirst / secondDenominator} m. Quedan ${correct} m.`,
      distractorReasons: ["Calcula ambas fracciones sobre el total inicial.", "Entrega lo usado en la segunda etapa.", "No descuenta ninguno de los dos usos."],
    });
  }

  if (pattern === 3) {
    const budget = [185000, 228000, 312000, 274000][edition];
    const fixed = [65000, 78000, 92000, 74000][edition];
    const variable = [24000, 30000, 44000, 40000][edition];
    const correct = Math.floor((budget - fixed) / variable);
    return makeQuestion(meta({ skill: "MODEL", difficulty: 3 }), edition, {
      statement: `Para organizar una feria se pagan ${money(fixed)} fijos y ${money(variable)} por cada módulo. Con un presupuesto de ${money(budget)}, ¿cuál es la mayor cantidad de módulos que se puede contratar sin excederlo?`,
      correct,
      distractors: [Math.floor(budget / variable), correct - 1, Math.floor((budget + fixed) / variable)],
      solution: `Debe cumplirse ${money(fixed)} + ${money(variable)}·m ≤ ${money(budget)}. Así, m ≤ ${formatNumber((budget - fixed) / variable)} y el máximo entero es ${correct}.`,
      distractorReasons: ["Ignora el costo fijo.", "Descarta un módulo que sí cabe en el presupuesto.", "Suma el costo fijo al presupuesto disponible."],
    });
  }

  if (pattern === 4) {
    const rates = [15, 18, 24, 30][edition];
    const minutes = [8, 15, 12, 14][edition];
    const correct = rates * minutes;
    return makeQuestion(meta({ skill: "REPRESENT", resource: "TABLE" }), edition, {
      statement: `Una máquina procesa ${rates} piezas cada minuto. La relación se mantiene constante. ¿Qué entrada completa correctamente la tabla para ${minutes} minutos?`,
      correct: `${correct} piezas`,
      distractors: [`${rates + minutes} piezas`, `${Math.round(rates / minutes)} piezas`, `${rates * (minutes - 1)} piezas`],
      solution: `La cantidad es proporcional al tiempo: ${rates}·${minutes} = ${correct}.`,
      visualData: { labels: ["1 min", `${minutes} min`], values: [rates, 0], caption: "Tiempo y cantidad procesada" },
      distractorReasons: ["Suma magnitudes que deben multiplicarse.", "Invierte la tasa.", "Cuenta un minuto menos."],
    });
  }

  if (pattern === 5) {
    const a = [6, 8, 5, 9][edition];
    const b = [3, 4, 7, 2][edition];
    const c = [5, 6, 4, 7][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4, context: "MATHEMATICAL" }), edition, {
      statement: `Para calcular ${a} - (-${b})·${c}, una estudiante hace: Paso 1: -(-${b}) = -${b}; Paso 2: (-${b})·${c} = -${b * c}; Paso 3: ${a} - (-${b * c}) = ${a + b * c}. ¿En cuál paso aparece el primer error?`,
      correct: "Paso 1",
      distractors: ["Paso 2", "Paso 3", "No hay error"],
      solution: `El opuesto de -${b} es +${b}; por eso el primer error está en el Paso 1.`,
      distractorReasons: ["El producto sería correcto si el Paso 1 lo fuera.", "La resta de un negativo está bien resuelta.", "Pasa por alto el cambio de signo incorrecto."],
    });
  }

  if (pattern === 6) {
    const first = [32, 45, 38, 50][edition];
    const changeA = [6, 8, 5, 9][edition];
    const changeB = [4, 5, 7, 6][edition];
    const totalA = first + changeA * 4;
    const totalB = first + changeB * 5;
    const correct = totalA === totalB ? "Ambos terminan con la misma cantidad." : totalA > totalB ? "El plan A termina con una cantidad mayor." : "El plan B termina con una cantidad mayor.";
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Dos planes comienzan con ${first} unidades. El plan A agrega ${changeA} unidades durante 4 etapas y el plan B agrega ${changeB} durante 5 etapas. ¿Qué afirmación es correcta?`,
      correct,
      distractors: ["El plan A siempre termina con una cantidad menor.", "El plan B siempre termina con una cantidad menor.", "No se puede comparar con la información dada."],
      solution: `Plan A: ${first} + 4·${changeA} = ${totalA}. Plan B: ${first} + 5·${changeB} = ${totalB}.`,
    });
  }

  if (pattern === 7) {
    const n = [4, 5, 7, 8][edition];
    return makeQuestion(meta({ skill: "REPRESENT", context: "MATHEMATICAL" }), edition, {
      statement: `¿Cuál expresión representa “la mitad de la diferencia entre el triple de ${n} y el sucesor de ${n}”?`,
      correct: `(3·${n} - (${n} + 1)) / 2`,
      distractors: [`3·${n} - (${n} + 1) / 2`, `(3·${n} - ${n}) + 1 / 2`, `2 / (3·${n} - (${n} + 1))`],
      solution: `Primero se forma la diferencia 3·${n} - (${n} + 1) y luego se toma su mitad.`,
      distractorReasons: ["Divide sólo el segundo término.", "No agrupa la diferencia y altera el sucesor.", "Invierte la operación de tomar la mitad."],
    });
  }

  if (pattern === 8) {
    const positives = [18, 22, 16, 25][edition];
    const negatives = [7, 9, 11, 8][edition];
    const bonus = [5, 4, 6, 3][edition];
    const correct = positives - negatives + bonus;
    return makeQuestion(meta({ skill: "REPRESENT", resource: "BAR_CHART", difficulty: 3 }), edition, {
      statement: `En un torneo se registran ${positives} puntos a favor, ${negatives} puntos de penalización y un bono de ${bonus} puntos. ¿Qué puntaje final corresponde a esos datos?`,
      correct,
      distractors: [positives + negatives + bonus, positives - negatives - bonus, positives + bonus],
      solution: `Los puntos a favor y el bono se suman, mientras la penalización se resta: ${positives} - ${negatives} + ${bonus} = ${correct}.`,
      visualData: { labels: ["A favor", "Penalización", "Bono"], values: [positives, negatives, bonus], caption: "Registro del torneo" },
      distractorReasons: ["Suma la penalización.", "Resta también el bono.", "Omite la penalización."],
    });
  }

  if (pattern === 9) {
    const departure = [21, 19, 23, 20][edition];
    const duration = [8, 11, 7, 14][edition];
    const offset = [3, -4, 5, -2][edition];
    const destinationHour = ((departure + duration + offset) % 24 + 24) % 24;
    const day = departure + duration + offset >= 24 ? "del día siguiente" : departure + duration + offset < 0 ? "del día anterior" : "del mismo día";
    return makeQuestion(meta({ difficulty: 4 }), edition, {
      statement: `Un viaje sale a las ${departure}:00, dura ${duration} horas y el destino tiene una diferencia horaria de ${offset >= 0 ? "+" : ""}${offset} horas respecto del origen. ¿A qué hora local llega?`,
      correct: `${String(destinationHour).padStart(2, "0")}:00 ${day}`,
      distractors: [`${String((departure + duration) % 24).padStart(2, "0")}:00`, `${String(((departure + offset) % 24 + 24) % 24).padStart(2, "0")}:00`, `${String(((departure - duration - offset) % 24 + 24) % 24).padStart(2, "0")}:00`],
      solution: `Hora local = ${departure}+${duration}${offset >= 0 ? "+" : ""}${offset}=${departure + duration + offset}; al ajustar el ciclo de 24 horas resulta ${destinationHour}:00 ${day}.`,
    });
  }

  if (pattern === 10) {
    const fractions = [["3/5", 3 / 5], ["7/10", 7 / 10], ["5/8", 5 / 8], ["11/20", 11 / 20]] as const;
    const second = [["2/3", 2 / 3], ["3/4", 3 / 4], ["7/12", 7 / 12], ["3/5", 3 / 5]] as const;
    const [labelA, valueA] = fractions[edition];
    const [labelB, valueB] = second[edition];
    const correct = valueA > valueB ? `${labelA} es mayor.` : valueA < valueB ? `${labelB} es mayor.` : "Son iguales.";
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 3, context: "MATHEMATICAL" }), edition, {
      statement: `Sin convertir a porcentaje, compara ${labelA} y ${labelB}. ¿Cuál afirmación es correcta?`,
      correct,
      distractors: [`${labelA} es mayor porque su numerador es mayor.`, `${labelB} es mayor porque su denominador es mayor.`, "No se pueden comparar fracciones de distinto denominador."],
      solution: `Al usar denominador común o producto cruzado se comparan ${formatNumber(valueA)} y ${formatNumber(valueB)}; por eso ${correct.toLowerCase()}`,
    });
  }

  const brands = [4, 5, 6, 3][edition];
  const models = [3, 4, 2, 5][edition];
  const colors = [5, 3, 4, 6][edition];
  const correct = brands * models * colors;
  return makeQuestion(meta({ skill: "MODEL", resource: "DIAGRAM", difficulty: 3 }), edition, {
    statement: `Un catálogo permite elegir entre ${brands} marcas, ${models} modelos por marca y ${colors} colores por modelo. ¿Cuántas configuraciones distintas hay?`,
    correct,
    distractors: [brands + models + colors, brands * models + colors, brands + models * colors],
    solution: `Por el principio multiplicativo: ${brands}·${models}·${colors}=${correct}.`,
    visualData: { values: [brands, models, colors], caption: "Opciones sucesivas de configuración" },
  });
}

function percentageQuestion(pattern: number, edition: number): Question {
  const family = `num-pct-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Porcentaje",
    topic: "Cálculo y aplicaciones de porcentaje",
    skill: "SOLVE",
    difficulty: 2,
    context: "DAILY_LIFE",
    resource: "TEXT",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const total = [480, 360, 640, 750][edition];
    const rate = [15, 35, 12.5, 24][edition];
    const correct = total * rate / 100;
    return makeQuestion(meta(), edition, {
      statement: `¿Qué cantidad corresponde al ${formatNumber(rate)} % de ${total}?`,
      correct: formatNumber(correct),
      distractors: [formatNumber(total * (100 - rate) / 100), formatNumber(total / rate), formatNumber(total + rate)],
      solution: `${formatNumber(rate / 100)}·${total} = ${formatNumber(correct)}.`,
    });
  }

  if (pattern === 1) {
    const part = [42, 75, 96, 54][edition];
    const rate = [30, 25, 40, 15][edition];
    const correct = part * 100 / rate;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `${part} corresponde al ${rate} % de una cantidad. ¿Cuál es esa cantidad?`,
      correct,
      distractors: [part * rate / 100, part * (100 - rate) / 100, part + rate],
      solution: `Si ${rate}/100·x = ${part}, entonces x = ${part}·100/${rate} = ${correct}.`,
      distractorReasons: ["Calcula el porcentaje de la parte conocida.", "Aplica el porcentaje complementario.", "Suma porcentaje y cantidad como si fueran comparables."],
    });
  }

  if (pattern === 2) {
    const price = [80000, 120000, 64000, 150000][edition];
    const first = [20, 25, 15, 30][edition];
    const second = [10, 20, 25, 10][edition];
    const correct = price * (1 - first / 100) * (1 - second / 100);
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Un producto de ${money(price)} recibe primero un ${first} % de descuento y luego otro ${second} % sobre el precio rebajado. ¿Cuál es el precio final?`,
      correct: money(correct),
      distractors: [money(price * (1 - (first + second) / 100)), money(price * (1 - first / 100) - second), money(price * (1 - second / 100))],
      solution: `${money(price)}·${formatNumber(1 - first / 100)}·${formatNumber(1 - second / 100)} = ${money(correct)}.`,
      distractorReasons: ["Suma descuentos aplicados sobre bases distintas.", "Resta el segundo porcentaje como una cantidad de pesos.", "Aplica sólo el segundo descuento."],
    });
  }

  if (pattern === 3) {
    const before = [28, 34, 41, 22][edition];
    const after = [43, 49, 56, 37][edition];
    const correct = after - before;
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 3 }), edition, {
      statement: `En una medición, el apoyo a una propuesta pasó de ${before} % a ${after} %. ¿En cuántos puntos porcentuales aumentó?`,
      correct: `${correct} puntos porcentuales`,
      distractors: [`${formatNumber((after - before) / before * 100)} %`, `${after + before} puntos porcentuales`, `${100 - after} puntos porcentuales`],
      solution: `La variación en puntos porcentuales es ${after} - ${before} = ${correct}.`,
      distractorReasons: ["Calcula el aumento relativo, no la diferencia en puntos.", "Suma ambos porcentajes.", "Calcula el complemento del valor final."],
    });
  }

  if (pattern === 4) {
    const total = [1200, 2500, 1800, 3200][edition];
    const groupRate = [40, 32, 25, 45][edition];
    const subgroupRate = [15, 20, 12, 30][edition];
    const correct = total * groupRate / 100 * subgroupRate / 100;
    return makeQuestion(meta({ difficulty: 4 }), edition, {
      statement: `De ${total} participantes, el ${groupRate} % pertenece a un grupo y el ${subgroupRate} % de ese grupo eligió la opción C. ¿Cuántas personas del total cumplen ambas condiciones?`,
      correct,
      distractors: [total * (groupRate + subgroupRate) / 100, total * subgroupRate / 100, total * groupRate / 100],
      solution: `${total}·${formatNumber(groupRate / 100)}·${formatNumber(subgroupRate / 100)} = ${correct}.`,
      distractorReasons: ["Suma porcentajes encadenados.", "Aplica el porcentaje del subgrupo al total.", "Cuenta a todo el primer grupo."],
    });
  }

  if (pattern === 5) {
    const price = [45000, 72000, 96000, 125000][edition];
    const rise = [12, 15, 20, 8][edition];
    const discount = [10, 25, 15, 20][edition];
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 3 }), edition, {
      statement: `El precio P = ${money(price)} aumenta un ${rise} % y luego se descuenta un ${discount} % sobre el nuevo precio. ¿Qué expresión representa el valor final?`,
      correct: `${price}·${formatNumber(1 + rise / 100)}·${formatNumber(1 - discount / 100)}`,
      distractors: [`${price}·${formatNumber(1 + (rise - discount) / 100)}`, `${price}·${formatNumber(rise / 100)}·${formatNumber(discount / 100)}`, `${price} + ${rise} - ${discount}`],
      solution: `Un aumento se representa con el factor ${formatNumber(1 + rise / 100)} y el descuento con ${formatNumber(1 - discount / 100)}.`,
      distractorReasons: ["Combina tasas aplicadas sobre bases diferentes.", "Usa sólo las tasas y pierde el valor restante.", "Confunde porcentajes con pesos."],
    });
  }

  if (pattern === 6) {
    const original = [50000, 80000, 120000, 64000][edition];
    const rate = [20, 15, 30, 25][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Para rebajar en ${rate} % un precio de ${money(original)}, se propone: Paso 1, calcular ${original}·${rate}/100; Paso 2, sumar ese resultado al precio original. ¿Qué evaluación es correcta?`,
      correct: "El Paso 2 es incorrecto porque en un descuento el monto calculado debe restarse.",
      distractors: ["El Paso 1 es incorrecto porque debe dividirse por el porcentaje.", "Ambos pasos son correctos.", "El Paso 2 es incorrecto porque el descuento debe restarse de 100 pesos."],
      solution: `El monto de descuento es ${money(original * rate / 100)} y el precio rebajado se obtiene restándolo a ${money(original)}.`,
    });
  }

  if (pattern === 7) {
    const price = [30000, 48000, 75000, 92000][edition];
    const percent = [20, 25, 12, 15][edition];
    const fixed = [7000, 10000, 9500, 15000][edition];
    const percentSaving = price * percent / 100;
    const correct = percentSaving > fixed ? `Conviene el descuento de ${percent} %.` : percentSaving < fixed ? `Conviene la rebaja fija de ${money(fixed)}.` : "Ambas promociones producen la misma rebaja.";
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Para un producto de ${money(price)} se puede elegir entre un ${percent} % de descuento o una rebaja fija de ${money(fixed)}. ¿Qué afirmación es correcta?`,
      correct,
      distractors: [`Siempre conviene el descuento de ${percent} %.`, `Siempre conviene la rebaja fija de ${money(fixed)}.`, "No es posible comparar porcentajes con dinero."],
      solution: `El ${percent} % de ${money(price)} equivale a ${money(percentSaving)}; se compara ese ahorro con ${money(fixed)}.`,
    });
  }

  if (pattern === 8) {
    const counts = [80, 120, 160, 200][edition];
    const favorable = [18, 33, 52, 74][edition];
    const correct = favorable / counts * 100;
    return makeQuestion(meta({ skill: "REPRESENT", resource: "BAR_CHART", difficulty: 3 }), edition, {
      statement: `En una encuesta respondieron ${counts} personas y ${favorable} eligieron la alternativa A. ¿Qué porcentaje representa esa elección?`,
      correct: `${formatNumber(correct)} %`,
      distractors: [`${formatNumber(favorable / 100)} %`, `${formatNumber((counts - favorable) / counts * 100)} %`, `${formatNumber(counts / favorable)} %`],
      solution: `${favorable}/${counts}·100 = ${formatNumber(correct)} %.`,
      visualData: { labels: ["Alternativa A", "Otras"], values: [favorable, counts - favorable], caption: "Respuestas registradas" },
    });
  }

  if (pattern === 9) {
    const finalPrice = [59500, 71400, 95200, 130900][edition];
    const tax = [19, 19, 19, 19][edition];
    const beforeTax = finalPrice / (1 + tax / 100);
    return makeQuestion(meta({ difficulty: 4 }), edition, {
      statement: `El precio final de un producto, después de agregar un ${tax} % de impuesto, es ${money(finalPrice)}. ¿Cuál era su precio antes del impuesto?`,
      correct: money(beforeTax),
      distractors: [money(finalPrice * (1 - tax / 100)), money(finalPrice - tax), money(finalPrice * tax / 100)],
      solution: `Si P·1,${tax}=${finalPrice}, entonces P=${finalPrice}/1,${tax}=${money(beforeTax)}.`,
    });
  }

  if (pattern === 10) {
    const initial = [1000, 800, 1200, 1500][edition];
    const rise = [20, 25, 10, 15][edition];
    const fall = [20, 25, 10, 15][edition];
    const final = initial * (1 + rise / 100) * (1 - fall / 100);
    const correct = (final - initial) / initial * 100;
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Una cantidad de ${initial} aumenta ${rise} % y luego disminuye ${fall} %. ¿Cuál es su variación porcentual total respecto del valor inicial?`,
      correct: `${formatNumber(correct)} %`,
      distractors: ["0 %", `${rise + fall} %`, `${rise - fall} puntos porcentuales`],
      solution: `Valor final=${initial}·${formatNumber(1 + rise / 100)}·${formatNumber(1 - fall / 100)}=${formatNumber(final)}; la variación es ${formatNumber(correct)} %.`,
      distractorReasons: ["Supone que porcentajes iguales se anulan aunque usan bases distintas.", "Suma las tasas.", "Resta tasas sin calcular el efecto compuesto."],
    });
  }

  const sales = [320000, 450000, 600000, 750000][edition];
  const threshold = [250000, 300000, 500000, 600000][edition];
  const baseRate = [4, 5, 3, 6][edition];
  const extraRate = [8, 10, 7, 12][edition];
  const commission = threshold * baseRate / 100 + (sales - threshold) * extraRate / 100;
  return makeQuestion(meta({ skill: "MODEL", difficulty: 5 }), edition, {
    statement: `Una comisión paga ${baseRate} % por los primeros ${money(threshold)} vendidos y ${extraRate} % sólo por lo que excede ese monto. Si se venden ${money(sales)}, ¿cuál es la comisión?`,
    correct: money(commission),
    distractors: [money(sales * extraRate / 100), money(sales * baseRate / 100), money(threshold * baseRate / 100 + sales * extraRate / 100)],
    solution: `Comisión=${money(threshold * baseRate / 100)}+${money((sales - threshold) * extraRate / 100)}=${money(commission)}.`,
  });
}

function powersQuestion(pattern: number, edition: number): Question {
  const family = `num-pow-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Potencias y raíces enésimas",
    topic: "Propiedades y aplicaciones",
    skill: "SOLVE",
    difficulty: 3,
    context: "MATHEMATICAL",
    resource: "TEXT",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const base = [2, 3, 4, 5][edition];
    const a = [7, 6, 5, 4][edition];
    const b = [3, 2, 1, 2][edition];
    const correctExponent = a - b;
    return makeQuestion(meta(), edition, {
      statement: `¿Cuál expresión equivale a ${base}^${a} ÷ ${base}^${b}?`,
      correct: `${base}^${correctExponent}`,
      distractors: [`${base}^${a + b}`, `${base}^${a * b}`, `${base * base}^${correctExponent}`],
      solution: `Al dividir potencias de igual base se restan los exponentes: ${a} - ${b} = ${correctExponent}.`,
    });
  }

  if (pattern === 1) {
    const initial = [25, 40, 60, 80][edition];
    const factor = [2, 3, 2, 2][edition];
    const periods = [5, 3, 4, 6][edition];
    const correct = initial * factor ** periods;
    return makeQuestion(meta({ context: "SCIENTIFIC", skill: "MODEL", difficulty: 3 }), edition, {
      statement: `Un cultivo comienza con ${initial} células y su cantidad se multiplica por ${factor} en cada período. ¿Cuántas habrá después de ${periods} períodos?`,
      correct,
      distractors: [initial * (factor + periods), initial * factor ** (periods - 1), (initial * factor) ** periods],
      solution: `El crecimiento repetido se modela por ${initial}·${factor}^${periods} = ${correct}.`,
    });
  }

  if (pattern === 2) {
    const largeExponent = [15, 18, 21, 24][edition];
    const smallExponent = [6, 9, 12, 15][edition];
    const correct = largeExponent - smallExponent;
    return makeQuestion(meta({ context: "SCIENTIFIC", skill: "REPRESENT" }), edition, {
      statement: `Una unidad A equivale a 10^${largeExponent} unidades básicas y una unidad B a 10^${smallExponent}. ¿Cuántas unidades B equivalen a una unidad A?`,
      correct: `10^${correct}`,
      distractors: [`10^${largeExponent + smallExponent}`, `10^${Math.round(largeExponent / smallExponent)}`, `${correct}^10`],
      solution: `10^${largeExponent}/10^${smallExponent} = 10^(${largeExponent}-${smallExponent}) = 10^${correct}.`,
    });
  }

  if (pattern === 3) {
    const base = [6, 10, 14, 18][edition];
    const factor = [2, 5, 7, 3][edition];
    const reduced = base / factor;
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 4 }), edition, {
      statement: `Si ${base} = ${factor}·${reduced}, ¿qué expresión es equivalente a ${base}^2?`,
      correct: `${factor}^2·${reduced}^2`,
      distractors: [`${factor}·${reduced}^2`, `${factor}^2+${reduced}^2`, `${factor * reduced * 2}`],
      solution: `(${factor}·${reduced})^2 = ${factor}^2·${reduced}^2.`,
    });
  }

  if (pattern === 4) {
    const base = [2, 3, 5, 4][edition];
    const outer = [3, 2, 3, 2][edition];
    const inner = [4, 5, 2, 3][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Para simplificar (${base}^${inner})^${outer}, se propone sumar los exponentes y obtener ${base}^${inner + outer}. ¿Cuál es la corrección adecuada?`,
      correct: `Se deben multiplicar los exponentes y obtener ${base}^${inner * outer}.`,
      distractors: [`Se debe multiplicar la base y obtener ${base * outer}^${inner}.`, `La propuesta es correcta.`, `Se deben restar los exponentes y obtener ${base}^${Math.abs(inner - outer)}.`],
      solution: `La potencia de una potencia conserva la base y multiplica exponentes: (${base}^${inner})^${outer} = ${base}^${inner * outer}.`,
    });
  }

  if (pattern === 5) {
    const factor = [2, 3, 2, 5][edition];
    const exponent = [6, 4, 8, 3][edition];
    const target = factor ** exponent;
    return makeQuestion(meta({ context: "SCIENTIFIC", difficulty: 4 }), edition, {
      statement: `Una población parte con una unidad y se multiplica por ${factor} cada hora. ¿Cuántas horas deben transcurrir para alcanzar ${target} unidades?`,
      correct: `${exponent} horas`,
      distractors: [`${factor * exponent} horas`, `${exponent - 1} horas`, `${target / factor} horas`],
      solution: `Se busca n tal que ${factor}^n = ${target}; como ${target} = ${factor}^${exponent}, n = ${exponent}.`,
    });
  }

  if (pattern === 6) {
    const outside = [3, 4, 5, 6][edition];
    const inside = [2, 3, 5, 7][edition];
    const radicand = outside ** 2 * inside;
    return makeQuestion(meta({ difficulty: 4 }), edition, {
      statement: `¿Cuál es la forma simplificada de √${radicand}?`,
      correct: `${outside}√${inside}`,
      distractors: [`${outside * inside}`, `${outside ** 2}√${inside}`, `${outside}√${inside ** 2}`],
      solution: `√${radicand} = √(${outside ** 2}·${inside}) = ${outside}√${inside}.`,
    });
  }

  if (pattern === 7) {
    const initial = [120, 250, 80, 300][edition];
    const rate = [10, 20, 25, 15][edition];
    const years = [4, 3, 5, 2][edition];
    return makeQuestion(meta({ context: "SCIENTIFIC", skill: "MODEL", difficulty: 4 }), edition, {
      statement: `La cantidad final se modela por C = ${initial}·(1 + ${rate}/100)^t. ¿Qué representa t al calcular la cantidad después de ${years} años?`,
      correct: `La cantidad de períodos transcurridos; en este caso, ${years}.`,
      distractors: [`La tasa de crecimiento; en este caso, ${rate}.`, `La cantidad inicial; en este caso, ${initial}.`, `El aumento total; en este caso, ${initial * rate / 100}.`],
      solution: `En un modelo exponencial, el exponente registra la cantidad de períodos en que actúa el factor de crecimiento.`,
    });
  }

  if (pattern === 8) {
    const base = [2, 3, 4, 5][edition];
    const exponents = [2, 3, 4, 5].map((value) => value + edition % 2);
    const values = exponents.map((value) => base ** value);
    const correct = Math.max(...values);
    return makeQuestion(meta({ skill: "REPRESENT", resource: "TABLE", difficulty: 3 }), edition, {
      statement: `La tabla relaciona exponentes con potencias de base ${base}. ¿Cuál es el mayor valor representado?`,
      correct,
      distractors: [Math.min(...values), values[1], values[2]],
      solution: `Como la base ${base} es mayor que 1, la potencia aumenta con el exponente. El mayor valor es ${correct}.`,
      visualData: { labels: exponents.map((value) => `e=${value}`), values, caption: `Potencias de base ${base}` },
    });
  }

  if (pattern === 9) {
    const base = [2, 3, 4, 5][edition];
    const exponentA = [8, 6, 5, 4][edition];
    const exponentB = [7, 5, 4, 3][edition];
    const factor = [2, 3, 4, 5][edition];
    const valueA = base ** exponentA;
    const valueB = factor * base ** exponentB;
    const correct = valueA === valueB ? "Las expresiones son iguales." : valueA > valueB ? `La primera expresión, ${base}^${exponentA}, es mayor.` : `La segunda expresión, ${factor}·${base}^${exponentB}, es mayor.`;
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Compara ${base}^${exponentA} y ${factor}·${base}^${exponentB}. ¿Cuál afirmación es correcta?`,
      correct,
      distractors: ["La expresión con más factores escritos siempre es mayor.", "No se pueden comparar sin calculadora.", "Son opuestas porque sus exponentes son distintos."],
      solution: `Los valores son ${valueA} y ${valueB}; por tanto, ${correct.toLowerCase()}`,
    });
  }

  if (pattern === 10) {
    const root = [4, 5, 6, 7][edition];
    const index = [2, 3, 2, 3][edition];
    const radicand = root ** index;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `¿Cuál es el valor de la raíz ${index === 2 ? "cuadrada" : "cúbica"} de ${radicand}?`,
      correct: root,
      distractors: [root ** 2, radicand / index, root + index],
      solution: `${root}^${index}=${radicand}; por eso la raíz ${index === 2 ? "cuadrada" : "cúbica"} es ${root}.`,
    });
  }

  const initialThickness = [0.1, 0.2, 0.25, 0.5][edition];
  const folds = [8, 7, 6, 5][edition];
  const finalThickness = initialThickness * 2 ** folds;
  return makeQuestion(meta({ context: "SCIENTIFIC", skill: "MODEL", difficulty: 4 }), edition, {
    statement: `Una lámina de ${formatNumber(initialThickness)} mm duplica su espesor en cada doblez. ¿Qué espesor alcanza después de ${folds} dobleces?`,
    correct: `${formatNumber(finalThickness)} mm`,
    distractors: [`${formatNumber(initialThickness * 2 * folds)} mm`, `${formatNumber(initialThickness * 2 ** (folds - 1))} mm`, `${formatNumber((initialThickness * 2) ** folds)} mm`],
    solution: `El modelo es ${formatNumber(initialThickness)}·2^${folds}=${formatNumber(finalThickness)} mm.`,
  });
}

export function buildNumbersBank() {
  return [
    ...Array.from({ length: 12 }, (_, pattern) => editions((edition) => integerQuestion(pattern, edition))).flat(),
    ...Array.from({ length: 12 }, (_, pattern) => editions((edition) => percentageQuestion(pattern, edition))).flat(),
    ...Array.from({ length: 12 }, (_, pattern) => editions((edition) => powersQuestion(pattern, edition))).flat(),
  ];
}
