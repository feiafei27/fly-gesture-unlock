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

    <el-text>
      tip：正确手势是{{ rightPassword }}
    </el-text>
  </div>
</template>

<script setup lang="ts">
import GestureUnlockRenderer, { Anchor } from '../../lib';
import { ref, onMounted, computed } from 'vue';
import Shake from '../components/shake.vue';

type ExtraStatus = 'error' | 'success';
type BusinessMode = 'first' | 'error' | 'freeze' | 'success';

const shakeInstance = ref();

const container = ref();
const gestureUnlockRenderer = ref<GestureUnlockRenderer<ExtraStatus>>();

const currentMode = ref<BusinessMode>('first');
// 正确的密码
const rightPassword = ref('123698');
// 记录输入错误的次数
const errorNum = ref(0);

const textInfo = computed(() => {
  switch (currentMode.value) {
    case "first": return { text: '请绘制解锁图案', type: 'primary' };
    case "error": return { text: `绘制错误，错误五次，将会锁定（当前错误${errorNum.value}次）`, type: 'danger' };
    case "freeze": return { text: '已锁定，请稍后再试', type: 'danger' };
    case "success": return { text: '解锁成功', type: 'success' };
  }
});

const gestureEnd = (selectedAnchors: Anchor<ExtraStatus>[]) => {
  const anchorIds = selectedAnchors.map(anchor => anchor.id).join('');

  if (anchorIds === rightPassword.value) {
    // 正确
    currentMode.value = 'success';
    gestureUnlockRenderer.value?.setStatus('success');
    shakeInstance.value.shake();
    gestureUnlockRenderer.value?.freeze();
    setTimeout(() => {
      gestureUnlockRenderer.value?.unFreeze();
      // 重置到初始状态
      currentMode.value = 'first';
      gestureUnlockRenderer.value?.reset();
      errorNum.value = 0;
    }, 600);
  } else {
    // 错误
    if (errorNum.value === 4) {
      currentMode.value = 'freeze';
      gestureUnlockRenderer.value?.setStatus('error');
      shakeInstance.value.shake();
      gestureUnlockRenderer.value?.freeze();
      setTimeout(() => {
        // 重置到初始状态
        gestureUnlockRenderer.value?.reset();
      }, 600);
    } else {
      errorNum.value++;

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
      isAnchorRepeatSelect: false,
      isLineCoverAnchor: false,
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
