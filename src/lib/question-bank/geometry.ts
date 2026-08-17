import type { Question } from "../types";
import { editions, formatNumber, makeQuestion, type RecipeMeta } from "./helpers";

const axis = "GEOMETRY" as const;

function figuresQuestion(pattern: number, edition: number): Question {
  const family = `geo-fig-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Figuras geométricas",
    topic: "Pitágoras, perímetro y áreas",
    skill: "SOLVE",
    difficulty: 3,
    context: "MATHEMATICAL",
    resource: "GEOMETRIC_FIGURE",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const base = [12, 15, 18, 20][edition];
    const height = [7, 8, 9, 11][edition];
    const correct = base * height / 2;
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `Un triángulo tiene base ${base} cm y altura perpendicular ${height} cm. ¿Cuál es su área?`,
      correct: `${correct} cm²`,
      distractors: [`${base * height} cm²`, `${2 * (base + height)} cm²`, `${base + height} cm²`],
      solution: `A=b·h/2=${base}·${height}/2=${correct} cm².`,
      visualData: { values: [base, height], caption: "Base y altura del triángulo" },
    });
  }

  if (pattern === 1) {
    const baseA = [10, 12, 15, 18][edition];
    const baseB = [6, 8, 9, 10][edition];
    const height = [5, 7, 6, 8][edition];
    const correct = (baseA + baseB) * height / 2;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Un terreno trapezoidal tiene bases paralelas de ${baseA} m y ${baseB} m, y altura ${height} m. ¿Cuál es su área?`,
      correct: `${correct} m²`,
      distractors: [`${(baseA - baseB) * height / 2} m²`, `${(baseA + baseB) * height} m²`, `${baseA * baseB / 2} m²`],
      solution: `A=(B+b)h/2=(${baseA}+${baseB})·${height}/2=${correct} m².`,
    });
  }

  if (pattern === 2) {
    const radius = [3, 4, 5, 6][edition];
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `¿Cuál es el área exacta de un círculo de radio ${radius} cm?`,
      correct: `${radius ** 2}π cm²`,
      distractors: [`${2 * radius}π cm²`, `${radius}π cm²`, `${2 * radius ** 2}π cm²`],
      solution: `A=πr²=π·${radius}²=${radius ** 2}π cm².`,
    });
  }

  if (pattern === 3) {
    const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]][edition];
    const [a, b, c] = triples;
    return makeQuestion(meta({ context: "DAILY_LIFE", difficulty: 3 }), edition, {
      statement: `Una escalera forma un triángulo rectángulo: su base queda a ${a} m del muro y alcanza ${b} m de altura. ¿Cuánto mide la escalera?`,
      correct: `${c} m`,
      distractors: [`${a + b} m`, `${Math.abs(b - a)} m`, `${a * b} m`],
      solution: `Por Pitágoras, L=√(${a}²+${b}²)=√${a ** 2 + b ** 2}=${c} m.`,
    });
  }

  if (pattern === 4) {
    const width = [8, 10, 12, 14][edition];
    const length = [13, 16, 19, 22][edition];
    const gate = [2, 3, 4, 5][edition];
    const correct = 2 * (width + length) - gate;
    return makeQuestion(meta({ context: "DAILY_LIFE", skill: "MODEL", difficulty: 3 }), edition, {
      statement: `Se cercará un terreno rectangular de ${width} m por ${length} m, dejando una entrada de ${gate} m sin cerca. ¿Cuántos metros de cerca se necesitan?`,
      correct: `${correct} m`,
      distractors: [`${width * length - gate} m`, `${2 * (width + length) + gate} m`, `${width + length - gate} m`],
      solution: `El perímetro es 2(${width}+${length})=${2 * (width + length)} m; al descontar la entrada quedan ${correct} m.`,
      distractorReasons: ["Calcula área y le resta una longitud.", "Suma la abertura en lugar de descontarla.", "Cuenta sólo dos lados."],
    });
  }

  if (pattern === 5) {
    const diameter = [8, 10, 14, 18][edition];
    const radius = diameter / 2;
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 3 }), edition, {
      statement: `Una persona calcula el área de un círculo de diámetro ${diameter} cm como π·${diameter}². ¿Qué corrección corresponde?`,
      correct: `Debe usar radio ${radius} cm y obtener ${radius ** 2}π cm².`,
      distractors: [`Debe usar 2π·${diameter} y obtener ${2 * diameter}π cm².`, "El cálculo es correcto porque radio y diámetro son iguales.", `Debe dividir π entre ${diameter}.`],
      solution: `El radio es la mitad del diámetro: r=${diameter}/2=${radius}; el área es πr²=${radius ** 2}π.`,
    });
  }

  if (pattern === 6) {
    const side = [6, 9, 12, 15][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Para cubrir un cuadrado de lado ${side} m, se calcula 4·${side}=${4 * side} y se afirma que se necesitan ${4 * side} m² de material. ¿Cuál es el error?`,
      correct: `Se calculó el perímetro; el área es ${side ** 2} m².`,
      distractors: [`El área es 2·${side}=${2 * side} m².`, `El cálculo es correcto porque toda medida del cuadrado usa 4.`, `Se debía calcular ${side}³.`],
      solution: `Cubrir una superficie requiere área: ${side}·${side}=${side ** 2} m²; 4·${side} mide el contorno.`,
    });
  }

  if (pattern === 7) {
    const triples = [[6, 8, 10], [9, 12, 15], [12, 16, 20], [15, 20, 25]][edition];
    const [width, height, diagonal] = triples;
    return makeQuestion(meta({ context: "DAILY_LIFE", difficulty: 3 }), edition, {
      statement: `Una pantalla rectangular mide ${width} cm de ancho y ${height} cm de alto. ¿Cuánto mide su diagonal?`,
      correct: `${diagonal} cm`,
      distractors: [`${width + height} cm`, `${height - width} cm`, `${width * height} cm`],
      solution: `d=√(${width}²+${height}²)=√${width ** 2 + height ** 2}=${diagonal} cm.`,
    });
  }

  const extra = [2, 3, 4, 5][edition];
  return makeQuestion(meta({ skill: "REPRESENT", difficulty: 3 }), edition, {
    statement: `Un paralelogramo tiene base (x + ${extra}) cm y altura x cm. ¿Qué expresión representa su área?`,
    correct: `x² + ${extra}x`,
    distractors: [`2x + ${extra}`, `2x² + ${2 * extra}x`, `x² + ${extra}`],
    solution: `A=base·altura=(x+${extra})x=x²+${extra}x.`,
  });
}

function bodiesQuestion(pattern: number, edition: number): Question {
  const family = `geo-body-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Cuerpos geométricos",
    topic: "Área superficial y volumen",
    skill: "SOLVE",
    difficulty: 3,
    context: "MATHEMATICAL",
    resource: "GEOMETRIC_FIGURE",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const side = [3, 4, 5, 7][edition];
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `¿Cuál es el volumen de un cubo de arista ${side} cm?`,
      correct: `${side ** 3} cm³`,
      distractors: [`${side ** 2} cm³`, `${6 * side ** 2} cm³`, `${2 * side} cm³`],
      solution: `V=a³=${side}³=${side ** 3} cm³.`,
      visualData: { values: [side], caption: `Cubo de arista ${side} cm` },
    });
  }

  if (pattern === 1) {
    const radius = [4, 3, 5, 6][edition];
    const height = [7, 8, 6, 10][edition];
    const coefficient = radius ** 2 * height;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Un cilindro tiene radio ${radius} cm y altura ${height} cm. ¿Cuál es su volumen exacto?`,
      correct: `${coefficient}π cm³`,
      distractors: [`${2 * radius * height}π cm³`, `${radius ** 2}π cm³`, `${2 * radius * (radius + height)}π cm³`],
      solution: `V=πr²h=π·${radius}²·${height}=${coefficient}π cm³.`,
    });
  }

  if (pattern === 2) {
    const a = [3, 4, 5, 6][edition];
    const b = [5, 6, 8, 7][edition];
    const c = [7, 9, 10, 12][edition];
    const correct = 2 * (a * b + a * c + b * c);
    return makeQuestion(meta({ difficulty: 4 }), edition, {
      statement: `Una caja rectangular cerrada mide ${a} cm, ${b} cm y ${c} cm. ¿Cuál es su área superficial?`,
      correct: `${correct} cm²`,
      distractors: [`${a * b * c} cm²`, `${a * b + a * c + b * c} cm²`, `${2 * (a + b + c)} cm²`],
      solution: `A=2(ab+ac+bc)=2(${a * b}+${a * c}+${b * c})=${correct} cm².`,
    });
  }

  if (pattern === 3) {
    const length = [8, 10, 12, 15][edition];
    const width = [5, 6, 7, 8][edition];
    const height = [4, 5, 6, 7][edition];
    const volume = length * width * height;
    return makeQuestion(meta({ context: "DAILY_LIFE", difficulty: 3 }), edition, {
      statement: `Un depósito rectangular tiene volumen ${volume} m³, largo ${length} m y ancho ${width} m. ¿Cuál es su altura?`,
      correct: `${height} m`,
      distractors: [`${length + width} m`, `${volume / length} m`, `${length * width} m`],
      solution: `h=V/(largo·ancho)=${volume}/(${length}·${width})=${height} m.`,
    });
  }

  if (pattern === 4) {
    const length = [50, 60, 80, 100][edition];
    const width = [40, 50, 60, 75][edition];
    const height = [30, 40, 50, 60][edition];
    const cubicCentimeters = length * width * height;
    const liters = cubicCentimeters / 1000;
    return makeQuestion(meta({ context: "DAILY_LIFE", skill: "MODEL", difficulty: 3 }), edition, {
      statement: `Un recipiente rectangular mide ${length} cm por ${width} cm por ${height} cm. Si 1000 cm³ equivalen a 1 L, ¿cuál es su capacidad?`,
      correct: `${liters} L`,
      distractors: [`${cubicCentimeters} L`, `${liters / 10} L`, `${(length + width + height) / 10} L`],
      solution: `V=${length}·${width}·${height}=${cubicCentimeters} cm³=${liters} L.`,
    });
  }

  if (pattern === 5) {
    const cubeSide = [4, 6, 8, 10][edition];
    const prismA = [4, 6, 8, 10][edition];
    const prismB = [4, 3, 4, 5][edition];
    const prismC = [4, 12, 16, 20][edition];
    const cubeVolume = cubeSide ** 3;
    const prismVolume = prismA * prismB * prismC;
    const correct = cubeVolume === prismVolume ? "Ambos cuerpos tienen el mismo volumen." : cubeVolume > prismVolume ? "El cubo tiene mayor volumen." : "El prisma tiene mayor volumen.";
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 5 }), edition, {
      statement: `Se compara un cubo de arista ${cubeSide} cm con un prisma de ${prismA}×${prismB}×${prismC} cm. ¿Cuál afirmación es correcta?`,
      correct,
      distractors: ["El cuerpo con mayor altura siempre tiene mayor volumen.", "No se pueden comparar porque tienen formas distintas.", "Sus áreas superficiales determinan directamente el volumen."],
      solution: `Los volúmenes son ${cubeVolume} cm³ y ${prismVolume} cm³, respectivamente.`,
    });
  }

  if (pattern === 6) {
    const diameter = [6, 8, 10, 12][edition];
    const height = [10, 12, 15, 18][edition];
    const radius = diameter / 2;
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Para un cilindro de diámetro ${diameter} cm y altura ${height} cm, se propone V=π·${diameter}²·${height}. ¿Cuál es la corrección?`,
      correct: `Debe usarse radio ${radius} cm: V=${radius ** 2 * height}π cm³.`,
      distractors: [`Debe usarse V=2π·${diameter}·${height}.`, "La propuesta es correcta.", `Debe restarse la altura al diámetro antes de elevar al cuadrado.`],
      solution: `V=πr²h y r=${diameter}/2=${radius}; V=π·${radius}²·${height}=${radius ** 2 * height}π.`,
    });
  }

  if (pattern === 7) {
    const a = [4, 5, 6, 8][edition];
    const b = [7, 8, 10, 12][edition];
    const c = [3, 4, 5, 6][edition];
    const correct = 2 * (a * b + a * c + b * c);
    return makeQuestion(meta({ skill: "REPRESENT", resource: "DIAGRAM", difficulty: 4 }), edition, {
      statement: `Una red está formada por dos rectángulos de cada medida ${a}×${b}, ${a}×${c} y ${b}×${c} cm. ¿Qué área total de cartón usa al formar una caja cerrada?`,
      correct: `${correct} cm²`,
      distractors: [`${a * b + a * c + b * c} cm²`, `${a * b * c} cm²`, `${2 * (a + b + c)} cm²`],
      solution: `La red contiene dos caras de cada par de dimensiones: 2(${a * b}+${a * c}+${b * c})=${correct}.`,
      visualData: { values: [a * b, a * c, b * c], caption: "Áreas de los tres tipos de cara" },
    });
  }

  const side = [2, 3, 4, 5][edition];
  const factor = [2, 3, 2, 4][edition];
  const original = side ** 3;
  const scaled = (side * factor) ** 3;
  return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
    statement: `La arista de un cubo aumenta desde ${side} cm hasta ${side * factor} cm. ¿Por qué factor cambia su volumen?`,
    correct: `${factor ** 3}`,
    distractors: [`${factor}`, `${factor ** 2}`, `${scaled - original}`],
    solution: `El volumen depende del cubo de la arista: (${side * factor})³/${side}³=${factor}³=${factor ** 3}.`,
  });
}

function transformationsQuestion(pattern: number, edition: number): Question {
  const family = `geo-iso-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Transformaciones isométricas",
    topic: "Puntos, vectores, traslación, reflexión y rotación",
    skill: "SOLVE",
    difficulty: 3,
    context: "MATHEMATICAL",
    resource: "CARTESIAN",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const x = [2, -3, 4, -1][edition];
    const y = [5, 2, -4, -3][edition];
    const dx = [3, 5, -2, 4][edition];
    const dy = [-2, 3, 6, -5][edition];
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `El punto P(${x},${y}) se traslada por el vector (${dx},${dy}). ¿Cuál es su imagen?`,
      correct: `(${x + dx}, ${y + dy})`,
      distractors: [`(${x - dx}, ${y - dy})`, `(${x + dy}, ${y + dx})`, `(${dx}, ${dy})`],
      solution: `Se suman las componentes: (${x}+${dx}, ${y}+${dy})=(${x + dx},${y + dy}).`,
      visualData: { points: [[x, y], [x + dx, y + dy]], caption: "Punto e imagen trasladada" },
    });
  }

  if (pattern === 1) {
    const x = [3, -4, 5, -2][edition];
    const y = [2, 6, -3, -5][edition];
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `¿Cuál es la reflexión de P(${x},${y}) respecto del eje y?`,
      correct: `(${-x}, ${y})`,
      distractors: [`(${x}, ${-y})`, `(${-x}, ${-y})`, `(${y}, ${x})`],
      solution: `La reflexión en el eje y cambia el signo de la coordenada x y conserva y.`,
      visualData: { points: [[x, y], [-x, y]], caption: "Reflexión respecto del eje y" },
    });
  }

  if (pattern === 2) {
    const x = [2, -3, 4, -5][edition];
    const y = [5, 1, -2, -4][edition];
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `El punto P(${x},${y}) rota 90° en sentido antihorario alrededor del origen. ¿Cuál es su imagen?`,
      correct: `(${-y}, ${x})`,
      distractors: [`(${y}, ${-x})`, `(${-x}, ${-y})`, `(${y}, ${x})`],
      solution: `Una rotación antihoraria de 90° transforma (x,y) en (-y,x).`,
      visualData: { points: [[x, y], [-y, x]], caption: "Rotación de 90°" },
    });
  }

  if (pattern === 3) {
    const x1 = [1, -2, 3, -4][edition];
    const y1 = [2, 5, -1, -3][edition];
    const dx = [4, 3, -5, 6][edition];
    const dy = [-3, 2, 4, 5][edition];
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 3 }), edition, {
      statement: `¿Qué vector traslada A(${x1},${y1}) hasta A'(${x1 + dx},${y1 + dy})?`,
      correct: `(${dx}, ${dy})`,
      distractors: [`(${-dx}, ${-dy})`, `(${x1 + dx}, ${y1 + dy})`, `(${dy}, ${dx})`],
      solution: `El vector es imagen menos origen: (${x1 + dx}-${x1}, ${y1 + dy}-${y1})=(${dx},${dy}).`,
    });
  }

  if (pattern === 4) {
    const x = [2, -1, 3, -4][edition];
    const y = [4, 5, -2, -3][edition];
    const dx = [3, 4, -2, 5][edition];
    const dy = [-1, 2, 6, -4][edition];
    const translatedX = x + dx;
    const translatedY = y + dy;
    return makeQuestion(meta({ difficulty: 4 }), edition, {
      statement: `P(${x},${y}) se traslada por (${dx},${dy}) y luego se refleja respecto del eje x. ¿Cuál es la imagen final?`,
      correct: `(${translatedX}, ${-translatedY})`,
      distractors: [`(${-translatedX}, ${translatedY})`, `(${x - dx}, ${-(y - dy)})`, `(${translatedX}, ${translatedY})`],
      solution: `Trasladado: (${translatedX},${translatedY}). La reflexión en el eje x cambia y por -y: (${translatedX},${-translatedY}).`,
    });
  }

  if (pattern === 5) {
    const x = [3, -2, 4, -5][edition];
    const y = [1, 6, -3, -4][edition];
    const dx = [2, 5, -1, 3][edition];
    const dy = [4, -2, 6, 5][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Para hallar la preimagen de P'(${x + dx},${y + dy}) bajo una traslación (${dx},${dy}), se vuelve a sumar el vector. ¿Cuál es la corrección?`,
      correct: `Para recuperar la preimagen se resta el vector y se obtiene (${x}, ${y}).`,
      distractors: [`Se intercambian las coordenadas y se obtiene (${y + dy}, ${x + dx}).`, "El procedimiento es correcto.", `Toda traslación cambia los signos de ambas coordenadas.`],
      solution: `Si P'=P+v, entonces P=P'-v=(${x + dx}-${dx},${y + dy}-${dy})=(${x},${y}).`,
    });
  }

  if (pattern === 6) {
    const length = [5, 7, 9, 12][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 3 }), edition, {
      statement: `Un segmento de longitud ${length} cm se somete a una traslación, una rotación o una reflexión. ¿Qué afirmación es siempre verdadera?`,
      correct: `Su imagen mantiene longitud ${length} cm en cualquiera de las tres transformaciones.`,
      distractors: ["Una rotación duplica su longitud.", "Una reflexión reduce su área a la mitad.", "Una traslación siempre cambia su orientación."],
      solution: `Las isometrías conservan distancias y, por tanto, longitudes y áreas.`,
    });
  }

  if (pattern === 7) {
    const x = [2, -3, 4, -1][edition];
    const y = [5, 2, -4, -6][edition];
    return makeQuestion(meta({ skill: "REPRESENT", difficulty: 3 }), edition, {
      statement: `El punto P(${x},${y}) se transforma en P'(${-x},${y}). ¿Qué transformación explica el cambio?`,
      correct: "Reflexión respecto del eje y.",
      distractors: ["Reflexión respecto del eje x.", "Rotación de 180°.", `Traslación por (${x},${y}).`],
      solution: `Sólo cambia el signo de x; esa es la regla de la reflexión en el eje y.`,
      visualData: { points: [[x, y], [-x, y]], caption: "Punto original e imagen" },
    });
  }

  const x = [6, -2, 5, -4][edition];
  const y = [3, 7, -5, -1][edition];
  const dx = [4, -3, 2, 5][edition];
  const dy = [-2, 6, 3, -4][edition];
  return makeQuestion(meta({ difficulty: 3 }), edition, {
    statement: `La imagen de un punto bajo el vector (${dx},${dy}) es P'(${x},${y}). ¿Cuál era el punto original?`,
    correct: `(${x - dx}, ${y - dy})`,
    distractors: [`(${x + dx}, ${y + dy})`, `(${dx - x}, ${dy - y})`, `(${x - dy}, ${y - dx})`],
    solution: `La preimagen se obtiene restando el vector: (${x}-${dx},${y}-${dy})=(${x - dx},${y - dy}).`,
  });
}

function similarityQuestion(pattern: number, edition: number): Question {
  const family = `geo-sim-${String(pattern + 1).padStart(2, "0")}`;
  const meta = (overrides: Partial<RecipeMeta> = {}): RecipeMeta => ({
    axis,
    unit: "Semejanza y proporcionalidad de figuras",
    topic: "Escalas y aplicaciones",
    skill: "SOLVE",
    difficulty: 3,
    context: "DAILY_LIFE",
    resource: "DIAGRAM",
    family,
    ...overrides,
  });

  if (pattern === 0) {
    const centimeters = [7, 9, 12, 15][edition];
    const metersPerCentimeter = [80, 120, 150, 200][edition];
    const correct = centimeters * metersPerCentimeter;
    return makeQuestion(meta({ difficulty: 2 }), edition, {
      statement: `En un mapa, 1 cm representa ${metersPerCentimeter} m. Dos puntos están separados ${centimeters} cm. ¿Cuál es la distancia real?`,
      correct: `${correct} m`,
      distractors: [`${metersPerCentimeter / centimeters} m`, `${metersPerCentimeter + centimeters} m`, `${correct / 100} m`],
      solution: `${centimeters}·${metersPerCentimeter}=${correct} m.`,
    });
  }

  if (pattern === 1) {
    const personHeight = [1.6, 1.8, 1.5, 2][edition];
    const personShadow = [2, 3, 1.5, 2.5][edition];
    const treeShadow = [7.5, 10, 8, 12.5][edition];
    const correct = personHeight * treeShadow / personShadow;
    return makeQuestion(meta({ context: "SCIENTIFIC", difficulty: 3 }), edition, {
      statement: `A la misma hora, una persona de ${formatNumber(personHeight)} m proyecta una sombra de ${formatNumber(personShadow)} m y un árbol una de ${formatNumber(treeShadow)} m. ¿Qué altura tiene el árbol?`,
      correct: `${formatNumber(correct)} m`,
      distractors: [`${formatNumber(personHeight * personShadow / treeShadow)} m`, `${formatNumber(treeShadow + personShadow)} m`, `${formatNumber(treeShadow / personHeight)} m`],
      solution: `Por semejanza, h/${treeShadow}=${personHeight}/${personShadow}; h=${formatNumber(correct)} m.`,
    });
  }

  if (pattern === 2) {
    const factor = [2, 3, 4, 5][edition];
    const originalArea = [18, 12, 15, 8][edition];
    const correct = originalArea * factor ** 2;
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Una figura se amplía con factor de escala ${factor}. Si su área original es ${originalArea} cm², ¿cuál es el área de la imagen?`,
      correct: `${correct} cm²`,
      distractors: [`${originalArea * factor} cm²`, `${originalArea + factor ** 2} cm²`, `${originalArea * factor ** 3} cm²`],
      solution: `Las áreas cambian con el cuadrado del factor: ${originalArea}·${factor}²=${correct}.`,
    });
  }

  if (pattern === 3) {
    const small = [4, 5, 6, 8][edition];
    const correspondingSmall = [6, 8, 9, 12][edition];
    const large = [10, 15, 18, 20][edition];
    const correct = correspondingSmall * large / small;
    return makeQuestion(meta({ difficulty: 3 }), edition, {
      statement: `Dos triángulos semejantes tienen lados correspondientes ${small} cm y ${large} cm. Si otro lado del menor mide ${correspondingSmall} cm, ¿cuánto mide el correspondiente del mayor?`,
      correct: `${correct} cm`,
      distractors: [`${correspondingSmall * small / large} cm`, `${large + correspondingSmall - small} cm`, `${correspondingSmall + small} cm`],
      solution: `La razón de ampliación es ${large}/${small}; el lado buscado es ${correspondingSmall}·${large}/${small}=${correct}.`,
    });
  }

  if (pattern === 4) {
    const scale = [50, 100, 200, 250][edition];
    const drawing = [8, 12, 15, 20][edition];
    const realCentimeters = scale * drawing;
    const correct = realCentimeters / 100;
    return makeQuestion(meta({ skill: "MODEL", difficulty: 3 }), edition, {
      statement: `Un plano está a escala 1:${scale}. Una pared mide ${drawing} cm en el plano. ¿Cuántos metros mide en la realidad?`,
      correct: `${correct} m`,
      distractors: [`${realCentimeters} m`, `${drawing / scale} m`, `${scale / drawing} m`],
      solution: `${drawing}·${scale}=${realCentimeters} cm=${correct} m.`,
    });
  }

  if (pattern === 5) {
    const factor = [2, 3, 4, 5][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Una figura se amplía con factor ${factor}. ¿Qué afirmación compara correctamente perímetro y área?`,
      correct: `El perímetro se multiplica por ${factor} y el área por ${factor ** 2}.`,
      distractors: [`Ambos se multiplican por ${factor}.`, `El perímetro se multiplica por ${factor ** 2} y el área por ${factor}.`, `Ambos se multiplican por ${factor ** 3}.`],
      solution: `Las longitudes escalan linealmente y las áreas con el cuadrado del factor.`,
    });
  }

  if (pattern === 6) {
    const factor = [2, 3, 4, 5][edition];
    const area = [20, 18, 12, 10][edition];
    return makeQuestion(meta({ skill: "ARGUE", difficulty: 4 }), edition, {
      statement: `Se afirma que al ampliar una figura de área ${area} cm² con factor ${factor}, el área nueva es ${area * factor} cm². ¿Cuál es la corrección?`,
      correct: `El área debe multiplicarse por ${factor}² y resulta ${area * factor ** 2} cm².`,
      distractors: ["La afirmación es correcta.", `El área debe dividirse por ${factor} y resulta ${area / factor} cm².`, `El área aumenta sólo en ${factor} cm².`],
      solution: `En figuras semejantes las áreas varían con k²: ${area}·${factor ** 2}=${area * factor ** 2}.`,
    });
  }

  if (pattern === 7) {
    const factor = [2, 3, 4, 5][edition];
    const point: [number, number] = [[2, 3], [-2, 4], [3, -1], [-1, -2]][edition] as [number, number];
    return makeQuestion(meta({ context: "MATHEMATICAL", skill: "REPRESENT", resource: "CARTESIAN" }), edition, {
      statement: `Una dilatación con centro en el origen y factor ${factor} transforma P(${point[0]},${point[1]}). ¿Cuál es la imagen?`,
      correct: `(${point[0] * factor}, ${point[1] * factor})`,
      distractors: [`(${point[0] + factor}, ${point[1] + factor})`, `(${point[0] / factor}, ${point[1] / factor})`, `(${point[1] * factor}, ${point[0] * factor})`],
      solution: `Se multiplican ambas coordenadas por el factor: (${point[0] * factor},${point[1] * factor}).`,
      visualData: { points: [point, [point[0] * factor, point[1] * factor]], caption: "Punto y su imagen a escala" },
    });
  }

  const originalWidth = [12, 15, 18, 20][edition];
  const originalHeight = [8, 10, 12, 16][edition];
  const newWidth = [30, 24, 45, 35][edition];
  const correct = originalHeight * newWidth / originalWidth;
  return makeQuestion(meta({ skill: "MODEL", difficulty: 3 }), edition, {
    statement: `Una fotografía de ${originalWidth} cm por ${originalHeight} cm se amplía sin deformarla hasta un ancho de ${newWidth} cm. ¿Cuál debe ser su altura?`,
    correct: `${formatNumber(correct)} cm`,
    distractors: [`${originalHeight + newWidth - originalWidth} cm`, `${formatNumber(originalHeight * originalWidth / newWidth)} cm`, `${newWidth} cm`],
    solution: `Se conserva la razón: h/${newWidth}=${originalHeight}/${originalWidth}; h=${formatNumber(correct)} cm.`,
  });
}

export function buildGeometryBank() {
  return [
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => figuresQuestion(pattern, edition))).flat(),
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => bodiesQuestion(pattern, edition))).flat(),
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => transformationsQuestion(pattern, edition))).flat(),
    ...Array.from({ length: 9 }, (_, pattern) => editions((edition) => similarityQuestion(pattern, edition))).flat(),
  ];
}
