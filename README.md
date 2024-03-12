## ✨ Fly Gesture Unlock

Fully functional and powerful web-based gesture unlocking library, one stop solution for gesture unlocking related services

## 🎉 All of my open source libraries
> fly-barrage: Web based barrage library, recommended by Gitee.
>
> gitee: https://gitee.com/fei_fei27/fly-barrage;
>
> github: https://github.com/feiafei27/fly-barrage;

> fly-gesture-unlock: Web based gesture unlocking library.
>
> gitee: https://gitee.com/fei_fei27/fly-gesture-unlock;
>
> github: https://github.com/feiafei27/fly-gesture-unlock;

## 🎥 Rendering Effects

![Rendering effects](./public/full-demo.jpg)

## 📝 Official Website

<https://fly-gesture-unlock.netlify.app/>

## 🎄 Online Experience

<https://fly-gesture-unlock-online.netlify.app/>

## 📥 Install

```bash
npm install fly-gesture-unlock
```

## 🌍 Usage
```vue
<!-- Taking Vue framework as an example, this library is not limited to specific frameworks. -->
<template>
  <div class="page-container">
    <div
      id="container"
      ref="container"
      style="width: 300px; height: 300px;"
    />
  </div>
</template>

<script setup lang="ts">
  import GestureUnlockRenderer, { Anchor } from 'fly-gesture-unlock';
  import { ref, onMounted } from 'vue';

  // 定义额外状态
  type ExtraStatus = never;

  const container = ref();
  const gestureUnlockRenderer = ref<GestureUnlockRenderer<ExtraStatus>>();

  onMounted(() => {
    // 借助提供的辅助函数生成锚点
    const anchorDefines = GestureUnlockRenderer.AnchorMatrixFactory({
      canvasSize: { width: container.value.clientWidth, height: container.value.clientHeight },
      padding: 35,
      matrix: { row: 3, column: 3 },
      anchor: { anchorCircleRadius: 30, centerCircleRadius: 10 },
    });

    gestureUnlockRenderer.value = new GestureUnlockRenderer<ExtraStatus>({
      container: container.value,
      anchorDefines,

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
      lineStatusStyles: {
        'normal': {
          lineColor: '#128ce8',
          lineWidth: 1,
        },
      },
      events: {
        'end': gestureEnd,
      },
    });
  });

  const gestureEnd = (selectedAnchors: Anchor<ExtraStatus>[]) => {
    const anchorIds = selectedAnchors.map(anchor => anchor.id).join('');
    console.log(anchorIds);
  };
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  .page-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #446693;
  }

  #container {
    background-color: #ffffff;
  }
</style>
```
For complete usage, please clone the project directly, install the dependencies, and then execute npm run dev to view the complete usage

Try to use a higher version of the node version, my local version is v18.19.0

## 🌲 License
[MIT License](LICENSE)