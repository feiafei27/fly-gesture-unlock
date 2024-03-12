# GestureUnlockRenderer
要想实现手势解锁的功能，只需要创建出 GestureUnlockRenderer 类的实例即可，该类的构造函数参数以及提供的方法如下所示：

# 构造函数参数
::: tip 提示
这块的配置参数还是蛮多的，如果想快速上手，也可以直接 clone 项目，安装依赖后，
执行 npm run dev 即可看到完整的 DEMO，找到你想要实现的业务逻辑，查看对应的实现代码即可；
:::

::: details 点击查看参数类型
```ts
/**
 * 手势解锁渲染器
 * 泛型 ExtraStatus 意为：除 'selected' 和 'not-selected' 外的额外状态，如果没有额外状态的话，可以传递 never；
 * 当需要渲染绘制失败等额外状态时，则需要定义该泛型，并定义好对应的样式；
 */
export default class GestureUnlockRenderer<ExtraStatus extends string> {
  constructor(rendererOptions: RendererOptions<ExtraStatus>) {}
}

/**
 * GestureUnlockRenderer class 构造函数的参数
 */
export type RendererOptions<ExtraStatus extends string> = {
  // 容器 DOM
  container: string | HTMLElement;
  // 锚点配置项
  anchorDefines: AnchorDefine[];

  // 定义锚点各个状态的样式（因为锚点各个状态的样式是相同的，所以放在这里进行统一配置）
  anchorStatusStyles: AnchorStatusStyles<ExtraStatus>;
  // 定义锚点之间的连线各个状态的样式
  lineStatusStyles: LineStatusStyles<ExtraStatus>;

  // 事件回调
  events?: Events<ExtraStatus>;

  // 用于配置业务方面的各种细节
  config?: Partial<Config>;
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

/**
 * 锚点中的箭头配置
 */
export type AnchorArrow = Partial<Omit<Arrow, 'show'>>;

/**
 * 锚点必须有的两个状态类型
 */
export type AnchorRequireStatus = 'not-selected' | 'selected';

/**
 * 锚点各个状态的样式
 */
export type AnchorStatusStyles<ExtraStatus extends string> = {
  [K in (AnchorRequireStatus | ExtraStatus)]: AnchorStyle;
};

/**
 * 锚点某一个状态的样式
 */
export type AnchorStyle = {
  // 锚点圆的边框宽、边框颜色、填充颜色、阴影
  anchorCircleBorderWidth?: number;
  anchorCircleBorderColor?: string;
  anchorCircleFillColor?: string;
  anchorCircleShadowColor?: string;
  anchorCircleShadowBlur?: number;
  anchorCircleShadowOffsetX?: number;
  anchorCircleShadowOffsetY?: number;

  // 中心圆的边框宽、边框颜色、填充颜色、阴影
  centerCircleBorderWidth?: number;
  centerCircleBorderColor?: string;
  centerCircleFillColor?: string;
  centerCircleShadowColor?: string;
  centerCircleShadowBlur?: number;
  centerCircleShadowOffsetX?: number;
  centerCircleShadowOffsetY?: number;
}

/**
 * 连线必须有的状态类型
 */
export type LineRequireStatus = 'normal';

/**
 * 定义锚点连线各个状态的样式
 */
export type LineStatusStyles<ExtraStatus extends string> = {
  [K in (LineRequireStatus | ExtraStatus)]: LineStyle;
};

/**
 * 连线某一个状态的样式
 */
export type LineStyle = {
  lineColor: string;
  lineWidth: number;
}

/*
* start：开始绘制时；
* update：有新的锚点被选中时；
* end：绘制完成时；
* */
export type EventName = 'start' | 'update' | 'end';

export type Events<ExtraStatus extends string> = {
  [key in EventName]?: (anchors: Anchor<ExtraStatus>[]) => void
};

/**
 * 配置业务方面的各种细节
 */
export type Config = {
  // 用于配置箭头
  arrow: Arrow,
  // 用于控制连线是否会遮挡锚点
  isLineCoverAnchor: boolean;
  // 用于控制选中两个锚点的时候，其线段所经过的锚点会不会被自动选中
  isLineAutoSelect: boolean;
  // 用于控制锚点是否能够被重复选中
  isAnchorRepeatSelect: boolean;
}

/**
 * 完整的箭头配置
 */
export type Arrow = {
  // 用于控制是否渲染连线上面的箭头
  show: boolean;
  // 用于控制箭头的大小
  size: number;
  // 用于控制箭头距离起始锚点的距离
  distance: number;
}
```
:::
各个配置的详细解释会在后面的指南中说明。
# 提供的方法
## static AnchorMatrixFactory(matrixFactoryOptions: MatrixFactoryOptions): AnchorDefine[];
作用：用于生成常规锚点方阵的辅助函数，参数类型如下所示。
```ts
/**
 * AnchorMatrixFactory 函数参数类型
 */
export type MatrixFactoryOptions = {
  // 定义 canvas 的宽和高；
  canvasSize: { width: number; height: number; };
  // 定义锚点方阵距离 canvas 四边的内边距；
  padding: { top: number, right: number; bottom: number; left: number } | number;
  // 定义锚点方阵有几行几列，一共会生成 row * column 个锚点；
  matrix: { row: number; column: number };
  // 定义锚点的相关属性；
  anchor: { anchorCircleRadius: number; centerCircleRadius: number; };
  // 用于自定义 id 的函数，会传入当前锚点是第几行第几列；
  customId?: (row: number, column: number) => string;
}
```

## setStatus(extraStatus: ExtraStatus): void;
作用：设置当前的状态，注意这里只能设置额外的状态，例如：设置成 'error' 状态；

## reset(): void;
作用：重置渲染器为初始状态。

## freeze(): void;
作用：冻结面板，用户无法进行操作。

## unFreeze(): void;
作用：解冻面板。

## resize(anchorDefines: AnchorDefine[], config?: Partial\<Config\>): void;
作用：当容器尺寸发生变化时，调用此方法对渲染器进行 resize。