# 相关类型
config 配置项的相关类型如下所示：
```ts
/**
 * GestureUnlockRenderer class 构造函数的参数
 */
export type RendererOptions<ExtraStatus extends string> = {
  // 用于配置业务方面的各种细节
  config?: Partial<Config>;
}

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

# 具体作用
配置业务方面的各种细节
- arrow：配置箭头是否显示、箭头的大小、箭头距离锚点的距离；
- isLineCoverAnchor：用于控制连线是否会遮挡锚点；
- isLineAutoSelect：用于控制选中两个锚点的时候，其线段所经过的锚点会不会被自动选中；
- isAnchorRepeatSelect：用于控制锚点是否能够被重复选中；