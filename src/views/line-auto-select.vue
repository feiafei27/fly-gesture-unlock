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
import GestureUnlockRenderer, {Anchor} from '../../lib';
import { ref, onMounted } from 'vue';

type ExtraStatus = never;

const container = ref();
const gestureUnlockRenderer = ref<GestureUnlockRenderer<ExtraStatus>>();

const gestureEnd = (selectedAnchors: Anchor<ExtraStatus>[]) => {
  const anchorIds = selectedAnchors.map(anchor => anchor.id).join('');
  console.log(anchorIds);
};

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
    config: {
      arrow: {
        show: true,
        size: 6,
        distance: 16,
      },
      isLineAutoSelect: true,
    },
  });
});
</script>

<style scoped lang="less">
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  #container {
    background-color: #ffffff;
    margin: 20px 0;
  }
}
</style>
