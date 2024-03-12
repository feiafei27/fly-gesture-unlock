# 相关类型
events 配置项的相关类型如下所示：
```ts
/**
 * GestureUnlockRenderer class 构造函数的参数
 */
export type RendererOptions<ExtraStatus extends string> = {
  // 事件回调
  events?: Events<ExtraStatus>;
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
```

# 具体作用
用于定义各种事件的回调函数，例如通过定义 end 事件的回调函数可以获取此次绘制所选中的锚点以及顺序，代码如下所示：
```ts
// 没有额外类型的时候，ExtraStatus 定义成 never 即可
type ExtraStatus = never;

const gestureUnlockRenderer = ref<GestureUnlockRenderer<ExtraStatus>>();

onMounted(() => {
  gestureUnlockRenderer.value = new GestureUnlockRenderer<ExtraStatus>({
    events: {
      'end': gestureEnd,
    },
  });
});

const gestureEnd = (selectedAnchors: Anchor<ExtraStatus>[]) => {
  const anchorIds = selectedAnchors.map(anchor => anchor.id).join('');
  console.log(anchorIds);
};
```