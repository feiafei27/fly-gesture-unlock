# 相关类型
anchorDefines 配置项的相关类型如下所示：
```ts
/**
 * GestureUnlockRenderer class 构造函数的参数
 */
export type RendererOptions<ExtraStatus extends string> = {
  // 锚点配置项
  anchorDefines: AnchorDefine[];
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

/**
 * 锚点中的箭头配置
 */
export type AnchorArrow = Partial<Omit<Arrow, 'show'>>;
```

# 具体作用
## id
作用：唯一标识对应的锚点，当绘制结束时，可以通过锚点的 id 获取用户所绘制的锚点以及顺序。

## location
作用：定义锚点两个同心圆圆心的位置。

## anchorCircleRadius、centerCircleRadius
每个锚点都是由两个同心圆组成，这两个属性用于定义两个同心圆的半径。

## arrow
class GestureUnlockRenderer 中的 config 配置项中也有 arrow 的配置，config 中的是应用于全局的配置，
这里的 arrow 配置和 config 中 arrow 配置作用相同，不过它优先于 config 中的配置，并且只作用于当前锚点。