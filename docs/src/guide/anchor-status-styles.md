# 相关类型
anchorStatusStyles 配置项的相关类型如下所示：
```ts
/**
 * GestureUnlockRenderer class 构造函数的参数
 */
export type RendererOptions<ExtraStatus extends string> = {
  // 定义锚点各个状态的样式（因为锚点各个状态的样式是相同的，所以放在这里进行统一配置）
  anchorStatusStyles: AnchorStatusStyles<ExtraStatus>;
}

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
```

# 具体作用
锚点有不同的状态，必有的两个状态就是未选中状态和选中状态，对应的类型是 type AnchorRequireStatus = 'not-selected' | 'selected'，
除了这两个必有的状态外，有时绘制失败还需要渲染失败的状态，绘制成功时还需要渲染成功的状态。

锚点的每个状态都需要有对应的样式配置，这些状态的样式配置就是 anchorStatusStyles。

常规的只有 'not-selected' 和 'selected' 状态时的代码如下所示：
```ts
// 没有额外类型的时候，ExtraStatus 定义成 never 即可
type ExtraStatus = never;

const gestureUnlockRenderer = ref<GestureUnlockRenderer<ExtraStatus>>();

onMounted(() => {
  gestureUnlockRenderer.value = new GestureUnlockRenderer<ExtraStatus>({
    anchorStatusStyles: {
      'not-selected': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 1,
        anchorCircleBorderColor: '#3ea1e5',
      },
      'selected': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 1.5,
        anchorCircleBorderColor: '#128ce8',
        anchorCircleFillColor: '#ffffff',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#128ce8'
      },
    },
  });
});
```
如果需要渲染额外状态的话，例如需要渲染 danger 状态以及 success 状态，代码如下所示：
```ts
// 定义额外状态的类型，用作泛型
type ExtraStatus = 'danger' | 'success';

const gestureUnlockRenderer = ref<GestureUnlockRenderer<ExtraStatus>>();

onMounted(() => {
  gestureUnlockRenderer.value = new GestureUnlockRenderer<ExtraStatus>({
    anchorStatusStyles: {
      'not-selected': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 1,
        anchorCircleBorderColor: '#3ea1e5',
      },
      'selected': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 1.5,
        anchorCircleBorderColor: '#128ce8',
        anchorCircleFillColor: '#ffffff',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#128ce8'
      },
      'danger': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 1.5,
        anchorCircleBorderColor: '#F56C6C',
        anchorCircleFillColor: '#ffffff',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#F56C6C'
      },
      'success': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 1.5,
        anchorCircleBorderColor: '#67C23A',
        anchorCircleFillColor: '#ffffff',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#67C23A'
      },
    },
  });
});
```
