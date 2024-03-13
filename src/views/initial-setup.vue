<template>
  <div class="page-container">
    <shake ref="shakeInstance">
      <el-text :type="textInfo.type" size="large">{{ textInfo.text }}</el-text>
    </shake>

    <div
      id="container"
      ref="container"
      style="width: 300px; height: 300px;"
    />
  </div>
</template>

<script setup lang="ts">
import GestureUnlockRenderer, { Anchor } from '../../lib';
import { ref, onMounted, computed } from 'vue';
import Shake from '../components/shake.vue';

type ExtraStatus = 'error' | 'success';
type BusinessMode = 'first' | 'leastFour' | 'second' | 'error' | 'success'

const shakeInstance = ref();

const container = ref();
const gestureUnlockRenderer = ref<GestureUnlockRenderer<ExtraStatus>>();

const currentMode = ref<BusinessMode>('first');
// 用于记录首次绘制的图案
const firstGestureIds = ref('');

const textInfo = computed(() => {
  switch (currentMode.value) {
    case "first": return { text: '首次绘制解锁图案', type: 'primary' };
    case "leastFour": return { text: '最少连接4个点，请重新输入', type: 'danger' };
    case "second": return { text: '再次绘制解锁图案', type: 'primary' };
    case "error": return { text: '与上一次绘制不一致，请重新绘制', type: 'danger' };
    case "success": return { text: '设置成功', type: 'success' };
  }
});

const gestureEnd = (selectedAnchors: Anchor<ExtraStatus>[]) => {
  const anchorIds = selectedAnchors.map(anchor => anchor.id).join('');

  if (['first', 'leastFour'].includes(currentMode.value) && anchorIds.length < 4) {
    currentMode.value = 'leastFour';
    gestureUnlockRenderer.value?.reset();
    shakeInstance.value.shake();
  } else if (['first', 'leastFour'].includes(currentMode.value)) {
    currentMode.value = 'second';
    gestureUnlockRenderer.value?.reset();
    shakeInstance.value.shake();
    // 记录首次绘制的图案
    firstGestureIds.value = anchorIds;
  } else if (['second', 'error'].includes(currentMode.value)) {
    const isSame = firstGestureIds.value === anchorIds;
    if (isSame) {
      // 绘制的图案一样，设置成功
      currentMode.value = 'success';
      gestureUnlockRenderer.value?.setStatus('success');
      shakeInstance.value.shake();
      gestureUnlockRenderer.value?.freeze();
      setTimeout(() => {
        gestureUnlockRenderer.value?.unFreeze();
        // 重置到初始状态
        currentMode.value = 'first';
        gestureUnlockRenderer.value?.reset();
        firstGestureIds.value = '';
      }, 600);
    } else {
      // 绘制的不一样，绘制失败
      currentMode.value = 'error';
      gestureUnlockRenderer.value?.setStatus('error');
      shakeInstance.value.shake();
      gestureUnlockRenderer.value?.freeze();
      setTimeout(() => {
        gestureUnlockRenderer.value?.unFreeze();
        // 重置到初始状态
        gestureUnlockRenderer.value?.reset();
      }, 600);
    }
  }
}

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
      'error': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 1.5,
        anchorCircleBorderColor: '#e44b4a',
        anchorCircleFillColor: '#ffffff',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#e44b4a'
      },
      'success': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 1.5,
        anchorCircleBorderColor: '#67c23a',
        anchorCircleFillColor: '#ffffff',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#67c23a'
      },
    },
    lineStatusStyles: {
      'normal': {
        lineColor: '#128ce8',
        lineWidth: 1,
      },
      'error': {
        lineColor: '#e44b4a',
        lineWidth: 1,
      },
      'success': {
        lineColor: '#67c23a',
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
