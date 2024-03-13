<template>
  <div class="page-container">
    <el-text type="info" size="large">
      tip：请先绘制，然后点击按钮
    </el-text>
    <div
      id="container"
      ref="container"
      style="width: 300px; height: 300px;"
    />
    <el-button-group>
      <el-button
        v-for="btn in buttons"
        :key="btn.type"
        @click="gestureUnlockRenderer && gestureUnlockRenderer.setStatus(btn.type)"
        :type="btn.type"
      >
        {{ btn.text }}
      </el-button>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import GestureUnlockRenderer, {Anchor} from '../../lib';
import { ref, onMounted, computed } from 'vue';

type ExtraStatus = 'info' | 'warning' | 'danger' | 'success';

const container = ref();
const gestureUnlockRenderer = ref<GestureUnlockRenderer<ExtraStatus>>();

const gestureEnd = (selectedAnchors: Anchor<ExtraStatus>[]) => {
  const anchorIds = selectedAnchors.map(anchor => anchor.id).join('');
  console.log(anchorIds);
};

const buttons = computed<{ type: ExtraStatus, text: string }[]>(() => {
  return [
    {
      type: 'info',
      text: 'Info',
    },
    {
      type: 'warning',
      text: 'Warning',
    },
    {
      type: 'danger',
      text: 'Danger',
    },
    {
      type: 'success',
      text: 'Success',
    },
  ]
})

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
      'info': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 1.5,
        anchorCircleBorderColor: '#909399',
        anchorCircleFillColor: '#ffffff',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#909399'
      },
      'warning': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 1.5,
        anchorCircleBorderColor: '#E6A23C',
        anchorCircleFillColor: '#ffffff',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#E6A23C'
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
    lineStatusStyles: {
      'normal': {
        lineColor: '#128ce8',
        lineWidth: 1,
      },
      'info': {
        lineColor: '#909399',
        lineWidth: 1,
      },
      'warning': {
        lineColor: '#E6A23C',
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
