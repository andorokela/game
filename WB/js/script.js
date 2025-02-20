const canvas = document.getElementById("capillaryCanvas");
const ctx = canvas.getContext("2d");

const sliders = {
  wd: document.getElementById("wdSlider"),
  hd: document.getElementById("hdSlider"),
  cd: document.getElementById("cdSlider"),
  fab: document.getElementById("fabSlider"),
  bs: document.getElementById("bsSlider"),
  bt: document.getElementById("btSlider"),
  bpp: document.getElementById("bppSlider"),
  td: document.getElementById("tdSlider"),
  ica: document.getElementById("icaSlider"),
  fa: document.getElementById("faSlider"),
  or: document.getElementById("orSlider"),
  ca: document.getElementById("caSlider"),
  lh: document.getElementById("lhSlider")
};

// Инициализация
function init() {
  setupEventListeners();
  updateWdAndHd();
  updateCdDependentSliders();
  drawCapillary();
}

// Настройка слушателей событий
function setupEventListeners() {
  Object.values(sliders).forEach((slider) => {
    slider.addEventListener("input", () => {
      updateValues();
      drawCapillary();
    });
  });
}

// Обновление значений
function updateValues() {
  updateWdAndHd();
  updateCdDependentSliders();
  updateLhValue();
}

function updateValue(id, value) {
  document.getElementById(`${id}Value`).textContent =
    `${parseFloat(value).toFixed(1)} ${id === "ica" || id === "hd" || id === "cd" || id === "fa" || id === "ca" ? "°" : "μm"}`;
}

// Обновление WD и HD
function updateWdAndHd() {
  const wd = parseFloat(sliders.wd.value);
  const hdMin = wd + 3;
  const hdMax = wd + 13;
  sliders.hd.min = hdMin;
  sliders.hd.max = hdMax;

  if (parseFloat(sliders.hd.value) < hdMin) {
    sliders.hd.value = hdMin;
  } else if (parseFloat(sliders.hd.value) > hdMax) {
    sliders.hd.value = hdMax;
  }

  document.getElementById("wdValue").textContent = `${wd} μm`;
  document.getElementById("hdMin").textContent = `${hdMin} μm`;
  document.getElementById("hdMax").textContent = `${hdMax} μm`;
  document.getElementById("hdValue").textContent = `${sliders.hd.value} μm`;

  updateHdPitchType();
}

// Обновление типа шага
function updateHdPitchType() {
  const wd = parseFloat(sliders.wd.value);
  const hd = parseFloat(sliders.hd.value);

  let pitchType = "";
  if (hd === wd + 3) {
    pitchType = "Ultra Fine Pitch";
  } else if (hd >= wd + 4 && hd <= wd + 6) {
    pitchType = "Fine Pitch";
  } else if (hd >= wd + 7 && hd <= wd + 13) {
    pitchType = "Normal";
  }

  document.getElementById("hdPitchType").textContent = pitchType;
}

// Обновление значений, зависящих от CD
function updateCdDependentSliders() {
  const cd = parseFloat(sliders.cd.value);
  document.getElementById("cdValue").textContent = `${cd.toFixed(1)} μm`;
  updateFabValue();
  updateBsValue();
  updateBtValue();
  updateTdValue();
  updateLhValue();
}

// Обновление FAB
function updateFabValue() {
  const cd = parseFloat(sliders.cd.value);
  const fab = parseFloat(sliders.fab.value) * cd;
  document.getElementById("fabValue").textContent = `${fab.toFixed(2)} μm`;
  updateLhValue();
}

// Обновление BS
function updateBsValue() {
  const cd = parseFloat(sliders.cd.value);
  const bs = parseFloat(sliders.bs.value) * cd;
  document.getElementById("bsValue").textContent = `${bs.toFixed(2)} μm`;
}

// Обновление BT
function updateBtValue() {
  const cd = parseFloat(sliders.cd.value);
  const bt = parseFloat(sliders.bt.value) * cd;
  document.getElementById("btValue").textContent = `${bt.toFixed(2)} μm`;
}

// Обновление LH
function updateLhValue() {
  const td = parseFloat(sliders.td.value);
 // const lh = parseFloat(sliders.lh.value) * cd;
  const lhmin = 2.75 * parseFloat(sliders.fab.value) * parseFloat(sliders.cd.value);
//  document.getElementById("lhValue").textContent = `${lh.toFixed(2)} μm`;
  document.getElementById("lhMin").textContent = `${lhmin.toFixed(2)} μm`;
}

// Обновление максимального значения TD
function updateTdValue() {
  const bpp = parseFloat(sliders.bpp.value);
  const wd = parseFloat(sliders.wd.value);
  const cd = parseFloat(sliders.cd.value);
  const ca = (parseFloat(sliders.ca.value) * Math.PI) / 180;
  const lh = parseFloat(sliders.lh.value); // Примерное значение LH (длина провода)
  const bh = parseFloat(sliders.bt.value) * parseFloat(sliders.cd.value); // Примерное значение BH (высота шарика)
  const tdMax = 2 * (bpp - wd / 2 - Math.tan(ca / 2) * (lh - bh));
  document.getElementById("bppValue").textContent = `${bpp.toFixed(2)} μm`;
  document.getElementById("tdMax").textContent = `${tdMax.toFixed(2)} μm`;
  sliders.td.max = tdMax;
  if (parseFloat(sliders.td.min) < 2 * cd + 3) {
    sliders.td.min = cd + 3;
    document.getElementById("tdMin").textContent = `${(2 * cd + 3).toFixed(2)} μm`;
  }
  if (parseFloat(sliders.td.value) > tdMax) {
    sliders.td.value = tdMax;
    document.getElementById("tdValue").textContent = `${tdMax.toFixed(2)} μm`;
  }
}

// Отрисовка капилляра
function drawCapillary() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Пунктирная линия
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Отрисовка обеих половин
  drawFigure(
    centerX,
    centerY,
    parseFloat(sliders.hd.value),
    parseFloat(sliders.cd.value),
    parseFloat(sliders.td.value),
    (parseFloat(sliders.ica.value) * Math.PI) / 180,
    (parseFloat(sliders.fa.value) * Math.PI) / 180,
    parseFloat(sliders.or.value),
    (parseFloat(sliders.ca.value) * Math.PI) / 180
  );

  drawFigure(
    centerX,
    centerY,
    -parseFloat(sliders.hd.value),
    -parseFloat(sliders.cd.value),
    -parseFloat(sliders.td.value),
    ((360 - parseFloat(sliders.ica.value)) * Math.PI) / 180,
    (-parseFloat(sliders.fa.value) * Math.PI) / 180,
    parseFloat(sliders.or.value),
    (-parseFloat(sliders.ca.value) * Math.PI) / 180
  );

  // Ширина прямоугольника
  const wd = parseFloat(sliders.wd.value);
  const rectangleWidth = wd;
  const rectangleHeight = centerY + 30; // Фиксированная высота прямоугольника

  // Координаты прямоугольника
  const rectLeft = centerX - rectangleWidth / 2;
  const rectTop = 20;

  // Отрисовка прямоугольника
  ctx.fillStyle = "yellow"; // Желтый цвет
  ctx.fillRect(rectLeft, rectTop, rectangleWidth, rectangleHeight);

  // Добавляем обводку для наглядности
  ctx.strokeStyle = "black";
  ctx.strokeRect(rectLeft, rectTop, rectangleWidth, rectangleHeight);

  // Отрисовка шарика
  const showBall = document.getElementById("showBall");
  if (showBall.checked) {
    drawBall(centerX, centerY);
  } else {
    drawBondBall(centerX, centerY);
  }
  drawLoop(centerX + parseFloat(sliders.bpp.value), centerY);
  drawBondBall(centerX + parseFloat(sliders.bpp.value), centerY);


  drawLoop(centerX - parseFloat(sliders.bpp.value), centerY);
  drawBondBall(centerX - parseFloat(sliders.bpp.value), centerY);
}

function drawLoop(centerX, centerY) {
  // Ширина прямоугольника
  const wd = parseFloat(sliders.wd.value);
  const rectangleWidth = wd;
  const rectangleHeight = parseFloat(sliders.lh.value); // Фиксированная высота прямоугольника

  // Координаты прямоугольника
  const rectLeft = centerX - rectangleWidth / 2; //Math.tan(parseFloat(sliders.lh.value)*Math.PI/180)*parseFloat(sliders.cd.value)/2
  const rectTop =
    50 +
    centerY -
    parseFloat(sliders.lh.value) +
    ((parseFloat(sliders.cd.value) - parseFloat(sliders.hd.value)) / 2) *
      Math.tan((Math.PI/2 - (parseFloat(sliders.ica.value) * Math.PI) / 180) / 2) + 
        parseFloat(sliders.bt.value)*parseFloat(sliders.cd.value);//;

  // Отрисовка прямоугольника
  ctx.fillStyle = "yellow"; // Желтый цвет
  ctx.fillRect(rectLeft, rectTop, rectangleWidth, rectangleHeight);

  // Добавляем обводку для наглядности
  ctx.strokeStyle = "black";
  ctx.strokeRect(rectLeft, rectTop, rectangleWidth, rectangleHeight);
}

// Отрисовка фигуры
function drawFigure(centerX, centerY, hd, cd, td, ica, fa, or, ca) {
  // Вычисления
  const { aX, bX, bY, cX, cY, dX, dY, fX, fY, circleCenter, gX, gY, jX, jY } = computeFigurePoints(
    centerX,
    centerY,
    hd,
    cd,
    td,
    ica,
    fa,
    or,
    ca
  );

  if (!circleCenter) return;

  // Отрисовка
  ctx.fillStyle = "lightgray"; // Закрашиваем фигуру светло-серым цветом
  ctx.beginPath();
  ctx.moveTo(aX, 20); // Начало от верхней границы
  ctx.lineTo(bX, bY);
  ctx.lineTo(cX, cY);
  ctx.lineTo(gX, gY); // Отрезок CG
  ctx.arc(
    circleCenter.x,
    circleCenter.y,
    or,
    Math.atan2(gY - circleCenter.y, gX - circleCenter.x),
    Math.atan2(jY - circleCenter.y, jX - circleCenter.x),
    hd > 0
  );
  ctx.lineTo(jX, jY); // Отрезок CJ
  ctx.lineTo(fX, 20); // Возвращаемся к верхней границе
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawBall(centerX, centerY) {
  // Точки B и C для первой фигуры
  const bX = centerX + parseFloat(sliders.hd.value) / 2;
  const bY = centerY + 50;
  const cX = centerX + parseFloat(sliders.cd.value) / 2;
  const cY =
    bY +
    ((parseFloat(sliders.cd.value) - parseFloat(sliders.hd.value)) / 2) *
      Math.tan((Math.PI - (parseFloat(sliders.ica.value) * Math.PI / 180))/2);

  // Угол наклона отрезка BC
  const angleBC = Math.atan2(cY - bY, cX - bX);

  // Нормаль к отрезку BC (перпендикуляр)
  const normalAngle = angleBC - Math.PI / 2;

  // Радиус шарика
  const ballRadius = parseFloat(sliders.fab.value) * parseFloat(sliders.cd.value) * 0.5;

  // Линия BC
  const line2x1 = bX;
  const line2y1 = bY;
  const line2x2 = cX;
  const line2y2 = cY;

  // Вертикальная линия через centerX
  const line1x1 = centerX;
  const line1y1 = 0; // Начало линии (верхний край холста)
  const line1x2 = centerX;
  const line1y2 = canvas.height; // Конец линии (нижний край холста)

  // Пересечение вертикальной линии с отрезком BC
  const intersection = lineIntersection(line1x1, line1y1, line1x2, line1y2, line2x1, line2y1, line2x2, line2y2);

  if (!intersection) return;

  // Точка пересечения
  const intersectionX = intersection.x;
  const intersectionY = intersection.y;

  // Смещение центра шарика по оси Y
  const deltaY = ballRadius / Math.sin(normalAngle);

  // Координаты центра шарика
  const ballCenterX = centerX; // X центра шарика фиксирован
  const ballCenterY = intersectionY - deltaY;

  // Вычисляем точку касания
  const tangentPointX = intersectionX + ballRadius * Math.cos(angleBC);
  const tangentPointY = intersectionY + ballRadius * Math.sin(angleBC);

  // Отрисовка шарика
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(ballCenterX, ballCenterY, ballRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  // Линия, проходящая через центр шарика перпендикулярно BC
  const line3x1 = ballCenterX - Math.cos(normalAngle) * canvas.height; // Начало линии
  const line3y1 = ballCenterY - Math.sin(normalAngle) * canvas.height;
  const line3x2 = ballCenterX + Math.cos(normalAngle) * canvas.height; // Конец линии
  const line3y2 = ballCenterY + Math.sin(normalAngle) * canvas.height;
}

function drawBondBall(centerX, centerY) {
  // Точки B и C для первой фигуры
  const bX = centerX + parseFloat(sliders.hd.value) / 2;
  const mbX = centerX - parseFloat(sliders.hd.value) / 2;
  const bY = centerY + 50;
  const cX = centerX + parseFloat(sliders.cd.value) / 2;
  const mcX = centerX - parseFloat(sliders.cd.value) / 2;
  const cY =
    bY +
    ((parseFloat(sliders.cd.value) - parseFloat(sliders.hd.value)) / 2) *
      Math.tan((Math.PI - (parseFloat(sliders.ica.value) * Math.PI) / 180) / 2);
  // Точка D
  const dX = centerX + parseFloat(sliders.td.value) / 2;
  const dY = cY - (parseFloat(sliders.td.value) / 2) * Math.tan((parseFloat(sliders.fa.value) * Math.PI) / 180);

  // Радиус шарика
  const ballRadius = parseFloat(sliders.fab.value) * parseFloat(sliders.cd.value) * 0.5;

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.lineTo(bX, bY);
  ctx.lineTo(cX, cY);
  ctx.lineTo(mcX, cY);
  ctx.lineTo(mbX, bY);
  ctx.lineTo(bX, bY);
  ctx.fill();
  ctx.stroke();

  // Вычисление площади

  const trapArea = (cY - bY) * (bX - centerX + (cX - centerX));

  // Линия CD
  const line2x1 = cX;
  const line2y1 = cY;
  const line2x2 = dX;
  const line2y2 = dY;

  // Вертикальная линия через centerX
  const line1x1 = centerX + (parseFloat(sliders.bs.value) * parseFloat(sliders.cd.value)) / 2;
  const line1y1 = 0; // Начало линии (верхний край холста)
  const line1x2 = line1x1;
  const line1y2 = canvas.height; // Конец линии (нижний край холста)

  // Пересечение вертикальной линии с отрезком CD
  const intersection = lineIntersection(line1x1, line1y1, line1x2, line1y2, line2x1, line2y1, line2x2, line2y2);

  if (!intersection) return;

  // Точка пересечения
  const intersectionX = intersection.x;
  const intersectionY = intersection.y;

  // Отрисовка нижней части
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.lineTo(cX, cY);
  ctx.lineTo(intersectionX, intersectionY);

  // Радиус дуги
  const arcR = (cY + parseFloat(sliders.bt.value) * parseFloat(sliders.cd.value) - intersectionY) / 2;
  const arcY = intersectionY + arcR;

  // Дуга справа
  ctx.arc(intersectionX, arcY, arcR, (3 * Math.PI) / 2, Math.PI / 2);

  // Левая зеркальная часть
  const x = 2 * centerX - intersectionX;
  ctx.lineTo(x, arcY + arcR);
  ctx.arc(x, arcY, arcR, Math.PI / 2, (3 * Math.PI) / 2);

  // Замыкание пути
  ctx.lineTo(2 * centerX - cX, cY);
  ctx.fill();
  ctx.stroke();

  // Расчет площади
  // 1. Площадь треугольника
  const triangleBase = cY - intersectionY; // Расстояние между (cX, cY) и (intersectionX, intersectionY)
  const triangleHeight = intersectionX - cX; // Высота треугольника
  const triangleArea = 0.5 * triangleBase * triangleHeight;

  // 2. Площадь двух полукругов
  const semicircleArea = (Math.PI * Math.pow(arcR, 2)) / 2; // Площадь одного полукруга умножаем на 2
  const osn = 2 * (parseFloat(sliders.bt.value) * parseFloat(sliders.cd.value) * (intersectionX - centerX));
  // Общая площадь
  const totalArea = 2 * triangleArea + semicircleArea + osn;
  const t = triangleBase;
  //console.log("t:", t.toFixed(2), "квадратных единиц");

  const ballArea =
    (Math.PI *
      (parseFloat(sliders.cd.value) * parseFloat(sliders.fab.value)) *
      (parseFloat(sliders.cd.value) * parseFloat(sliders.fab.value))) /
    4;
  const rectangleWidth = parseFloat(sliders.hd.value);
  const rectangleHeight = (ballArea - totalArea - trapArea) / rectangleWidth;
  // Отрисовка шапочки
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  //ctx.lineTo(bX, bY);
  const rectLeft = 2 * centerX - bX;
  const rectTop = bY - rectangleHeight;

  ctx.fillStyle = "yellow"; // Желтый цвет
  ctx.fillRect(rectLeft, rectTop, rectangleWidth, rectangleHeight);
  //// Добавляем обводку для наглядности
  ctx.strokeStyle = "black";
  ctx.strokeRect(rectLeft, rectTop, rectangleWidth, rectangleHeight);
  ctx.fill();
  ctx.stroke();
}

// Вычисление точек для фигуры
function computeFigurePoints(centerX, centerY, hd, cd, td, ica, fa, or, ca) {
  const border = 20;

  // Точки A, B
  // Для зеркальной фигуры изменяем направление углов и нормалей
  const isMirror = hd < 0; // Определяем, является ли фигура зеркальной
  const mirrorFactor = isMirror ? -1 : 1;

  const bX = centerX + hd / 2;
  const aX = bX + 7 * mirrorFactor;
  const bY = centerY + 50;

  // Точка C
  const cX = centerX + cd / 2;
  const cY = bY + ((cd - hd) / 2) * Math.tan((Math.PI - ica) / 2);

  // Точка D
  const dX = centerX + td / 2;
  const dY = cY - (td / 2) * fa;

  // Точка F
  const lengthEF = centerY; // Длина отрезка EF
  const angleCA2 = ca / 2;
  const fX = dX + lengthEF * Math.sin(angleCA2);
  const fY = dY - lengthEF * Math.cos(angleCA2);

  // Углы наклона отрезков CD и DE
  const angleCD = Math.atan2(dY - cY, dX - cX);
  const angleDE = Math.atan2(fY - dY, fX - dX);

  const adjustedAngleCD = mirrorFactor * angleCD;
  const adjustedAngleDE = mirrorFactor * angleDE;

  // Нормали к отрезкам CD и DE
  const normalCDx = Math.sin(angleCD);
  const normalCDy = -Math.cos(angleCD);
  const normalDEx = Math.sin(angleDE);
  const normalDEy = -Math.cos(angleDE);

  const adjustedNormalCDx = mirrorFactor * normalCDx;
  const adjustedNormalCDy = mirrorFactor * normalCDy;
  const adjustedNormalDEx = mirrorFactor * normalDEx;
  const adjustedNormalDEy = mirrorFactor * normalDEy;

  // Смещенные линии
  const lineCDx1 = cX + or * adjustedNormalCDx;
  const lineCDy1 = cY + or * adjustedNormalCDy;
  const lineCDx2 = dX + or * adjustedNormalCDx;
  const lineCDy2 = dY + or * adjustedNormalCDy;

  const lineDEx1 = dX + or * adjustedNormalDEx;
  const lineDEy1 = dY + or * adjustedNormalDEy;
  const lineDEx2 = fX + or * adjustedNormalDEx;
  const lineDEy2 = fY + or * adjustedNormalDEy;

  // Поиск центра окружности
  const circleCenter = lineIntersection(lineCDx1, lineCDy1, lineCDx2, lineCDy2, lineDEx1, lineDEy1, lineDEx2, lineDEy2);

  if (!circleCenter) return {};

  // Точки пересечения окружности с отрезками CD и DF
  const gX = circleCenter.x - or * Math.sin(adjustedAngleCD);
  const gY = circleCenter.y + mirrorFactor * or * Math.cos(adjustedAngleCD);
  const jX = circleCenter.x - or * Math.sin(adjustedAngleDE);
  const jY = circleCenter.y + mirrorFactor * or * Math.cos(adjustedAngleDE);

  return { aX, bX, bY, cX, cY, dX, dY, fX, fY, circleCenter, gX, gY, jX, jY };
}

// Функция поиска пересечения линий
function lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denominator === 0) return null;

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1)
  };
}

// Инициализация при загрузке страницы
window.onload = init;
