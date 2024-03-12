import { Location } from './anchor';

/**
 * 获取当前设备的 dpr
 */
function getDevicePixelRatio(): number {
  // 先创建一个 canvas 元素
  let canvas = document.createElement('canvas') as HTMLCanvasElement;
  // 获取绘图环境
  let context = canvas.getContext('2d') as any;
  // 匿名函数自调用，计算获取当前环境的像素比例
  let _pixelRatio = (function () {
    // 获取当前环境（例如 window）的设备像素比，获取不到的话，就取 1
    let devicePixelRatio = window.devicePixelRatio || 1;
    // backingStorePixelRatio 属性：该属性决定了浏览器在渲染 canvas 以前会用几个像素来存储画布信息
    // 这个属性在 safari6.0 中是 2，在其他浏览器中都是 1
    let backingStoreRatio =
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    // 这样计算应该是为了额外处理 safari6.0 的情况，因为其他浏览器该属性都是 1
    return devicePixelRatio / backingStoreRatio;
  })();
  // 释放刚刚创建的 canvas 元素
  canvas.width = canvas.height = 0;
  // 返回计算的结果
  return _pixelRatio;
}

/**
 * 处理 Canvas 在高分屏上渲染模糊的问题
 * @param canvas canvas 元素
 * @param ctx 渲染上下文
 * @private
 */
function handleHighDprVague(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = getDevicePixelRatio();

  const logicalWidth = canvas.width;
  const logicalHeight = canvas.height;
  canvas.width = logicalWidth * dpr;
  canvas.height = logicalHeight * dpr;
  canvas.style.width = logicalWidth + 'px';
  canvas.style.height = logicalHeight + 'px';

  ctx.scale(dpr, dpr);
}

/**
 * 计算二维平面两点的距离
 * @param location1 点1
 * @param location2 点2
 */
function distance(location1: Location, location2: Location): number {
  return Math.sqrt(Math.pow(location1.x - location2.x, 2) + Math.pow(location1.y - location2.y, 2));
}

/**
 * 用于计算二维坐标系中，直线和圆的交点坐标
 *
 * @param k 直线的斜率
 * @param b 直线的截距
 * @param x_c 圆心的坐标
 * @param y_c 圆心的坐标
 * @param r 圆的半径
 */
function getIntersectionPoints(k: number, b: number, x_c: number, y_c: number, r: number) {
  const A = k * k + 1;
  const B = 2 * (k * b - k * y_c - x_c);
  const C = x_c * x_c + y_c * y_c + b * b - r * r - 2 * b * y_c;
  
  const delta = B * B - 4 * A * C;
  if (delta < 0) {
    return null; // 直线和圆没有交点
  } else if (delta === 0) {
    const x = -B / (2 * A);
    const y = k * x + b;
    return [[x, y]];
  }
  const x1 = (-B + Math.sqrt(delta)) / (2 * A);
  const y1 = k * x1 + b;
  const x2 = (-B - Math.sqrt(delta)) / (2 * A);
  const y2 = k * x2 + b;
  return [[x1, y1], [x2, y2]];
}

/**
 * 用于判断二维平面直角坐标系中，两点连成的线段是否经过某个圆
 * @param lineSegment 线段定义
 * @param circle 圆的定义
 */
function isLineSegmentIntersectingCircle(
  lineSegment: { start: Location; end: Location },
  circle: { center: Location; radius: number }
): boolean {
  // 计算线段的方向向量
  const directionX = lineSegment.end.x - lineSegment.start.x;
  const directionY = lineSegment.end.y - lineSegment.start.y;
  
  // 计算圆心到线段起点的向量
  const startToCenterX = circle.center.x - lineSegment.start.x;
  const startToCenterY = circle.center.y - lineSegment.start.y;
  
  // 计算圆心到线段的方向向量的点积
  const dotProduct = directionX * startToCenterX + directionY * startToCenterY;
  
  // 计算点积的绝对值与线段长度的平方的比值
  const projLength = dotProduct / (directionX * directionX + directionY * directionY);
  
  // 如果投影长度小于0或大于线段长度，则线段与圆不相交
  if (projLength < 0 || projLength > 1) {
    return false;
  }
  
  // 计算投影点到圆心的向量
  const projectionX = lineSegment.start.x + projLength * directionX;
  const projectionY = lineSegment.start.y + projLength * directionY;
  
  // 计算投影点到圆心的距离的平方
  const distanceSquared =
    (projectionX - circle.center.x) ** 2 + (projectionY - circle.center.y) ** 2;
  
  // 如果投影点到圆心的距离小于等于圆的半径，则线段与圆相交
  return distanceSquared <= circle.radius ** 2;
}

export default {
  getDevicePixelRatio,
  handleHighDprVague,
  distance,
  getIntersectionPoints,
  isLineSegmentIntersectingCircle,
}
