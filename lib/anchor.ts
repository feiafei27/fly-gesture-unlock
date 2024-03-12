import GestureUnlockRenderer, { AnchorRequireStatus, AnchorArrow } from './index';

/**
 * 锚点
 */
export default class Anchor<ExtraStatus extends string> {
  // 锚点的唯一标识
  id: string;
  // 当前锚点的位置
  location: Location;
  // 当前锚点的箭头配置
  arrow?: AnchorArrow;
  // 锚点圆的半径
  anchorCircleRadius: number;
  // 中心圆的半径
  centerCircleRadius: number;

  // 全局的渲染器实例
  renderer: GestureUnlockRenderer<ExtraStatus>;

  // 当前锚点的状态
  status: AnchorRequireStatus | ExtraStatus = 'not-selected';

  constructor({
    id,
    location,
    arrow,
    anchorCircleRadius,
    centerCircleRadius,
  }: AnchorDefine, renderer: GestureUnlockRenderer<ExtraStatus>) {
    this.id = id;
    this.location = location;
    this.arrow = arrow;
    this.anchorCircleRadius = anchorCircleRadius;
    this.centerCircleRadius = centerCircleRadius;

    this.renderer = renderer;
  }

  /**
   * 将当前的锚点渲染到指定的上下文
   */
  public render(ctx: CanvasRenderingContext2D) {
    // 先根据当前锚点的状态获取对应的锚点样式
    const {
      // 锚点圆的边框宽、边框颜色、填充颜色
      anchorCircleBorderWidth,
      anchorCircleBorderColor,
      anchorCircleFillColor,
      anchorCircleShadowColor,
      anchorCircleShadowBlur,
      anchorCircleShadowOffsetX,
      anchorCircleShadowOffsetY,

      // 中心圆的边框宽、边框颜色、填充颜色
      centerCircleBorderWidth,
      centerCircleBorderColor,
      centerCircleFillColor,
      centerCircleShadowColor,
      centerCircleShadowBlur,
      centerCircleShadowOffsetX,
      centerCircleShadowOffsetY,
    } = this.renderer.anchorStatusStyles[this.status];
    const { x, y } = this.location;

    // 封装绘制圆的工具函数
    const drawCircle = (
      radius: number, borderWidth?: number, borderColor?: string, fillColor?: string,
      shadowColor?: string, shadowBlur?: number, shadowOffsetX?: number, shadowOffsetY?: number,
    ) => {
      // 边框和填充至少有一个时，才有必要执行渲染操作
      if ((borderWidth && borderColor) || fillColor) {
        // 设置阴影配置
        ctx.shadowColor = shadowColor ?? 'transparent';
        ctx.shadowBlur = shadowBlur ?? 0;
        ctx.shadowOffsetX = shadowOffsetX ?? 0;
        ctx.shadowOffsetY = shadowOffsetY ?? 0;
        // 如果 borderWidth 和 borderColor 都存在的话，进行边框的绘制
        if (borderWidth && borderColor) {
          ctx.beginPath();
          ctx.arc(
            x,
            y,
            radius - (borderWidth ?? 0) / 2,
            0,
            Math.PI * 2,
            true
          );
          ctx.lineWidth = borderWidth;
          ctx.strokeStyle = borderColor;
          ctx.stroke();
        }
        // 如果 fillColor 存在的话，进行颜色的填充
        if (fillColor) {
          ctx.beginPath();
          ctx.arc(
            x,
            y,
            radius - (borderWidth ?? 0),
            0,
            Math.PI * 2,
            true
          );
          // 如果边框也绘制了的话，
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        // 重置阴影配置
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    };

    // 绘制外边圆
    drawCircle(
      this.anchorCircleRadius, anchorCircleBorderWidth, anchorCircleBorderColor, anchorCircleFillColor,
      anchorCircleShadowColor, anchorCircleShadowBlur, anchorCircleShadowOffsetX, anchorCircleShadowOffsetY,
    );
    // 绘制内边圆
    drawCircle(
      this.centerCircleRadius, centerCircleBorderWidth, centerCircleBorderColor, centerCircleFillColor,
      centerCircleShadowColor, centerCircleShadowBlur, centerCircleShadowOffsetX, centerCircleShadowOffsetY,
    );
  }

  /**
   * 设置锚点的状态
   */
  public setStatus(status: AnchorRequireStatus | ExtraStatus) {
    this.status = status;
  }
}

/**
 * Anchor class 构造函数的参数
 */
export type AnchorDefine = {
  // 锚点的唯一标识
  id: string;
  // 当前锚点的位置
  location: Location;
  // 用于配置箭头
  arrow?: AnchorArrow,
  // 锚点圆的半径
  anchorCircleRadius: number;
  // 中心圆的半径
  centerCircleRadius: number;
}

/**
 * 用于描述二维平面中某点的位置
 */
export type Location = {
  x: number;
  y: number;
}
