# 相关类型
lineStatusStyles 配置项的相关类型如下所示：
```ts
/**
 * GestureUnlockRenderer class 构造函数的参数
 */
export type RendererOptions<ExtraStatus extends string> = {
  // 定义锚点之间的连线各个状态的样式
  lineStatusStyles: LineStatusStyles<ExtraStatus>;
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
```

# 具体作用
锚点连线必有的状态只有一个，即 type LineRequireStatus = 'normal'，因为锚点没有选中时是不会有连线的。

锚点有额外的状态，与之相对应的连线也有额外的状态，连线状态的样式配置就是 lineStatusStyles。

常规状态下只需要定义 normal 状态即可，代码如下所示：
```ts
// 没有额外类型的时候，ExtraStatus 定义成 never 即可
type ExtraStatus = never;

const gestureUnlockRenderer = ref<GestureUnlockRenderer<ExtraStatus>>();

onMounted(() => {
  gestureUnlockRenderer.value = new GestureUnlockRenderer<ExtraStatus>({
    lineStatusStyles: {
      'normal': {
        lineColor: '#128ce8',
        lineWidth: 1,
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
    lineStatusStyles: {
      'normal': {
        lineColor: '#128ce8',
        lineWidth: 1,
      },
      'danger': {
        lineColor: '#F56C6C',
        lineWidth: 1,
      },
      'success': {
        lineColor: '#67C23A',
        lineWidth: 1,
      },
    },
  });
});
```