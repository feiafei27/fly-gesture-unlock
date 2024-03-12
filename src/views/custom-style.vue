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
        @click="gestureUnlockRenderer.setStatus(btn.style)"
        :type="btn.type"
      >
        {{ btn.style }}
      </el-button>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import GestureUnlockRenderer, {Anchor} from '../../lib';
import { ref, onMounted, computed } from 'vue';

type ExtraStatus = 'style1' | 'style2' | 'style3' | 'style4' | 'style5' | 'style6';

const container = ref();
const gestureUnlockRenderer = ref<GestureUnlockRenderer<ExtraStatus>>();

const gestureEnd = (selectedAnchors: Anchor<ExtraStatus>[]) => {
  const anchorIds = selectedAnchors.map(anchor => anchor.id).join('');
  console.log(anchorIds);
};

const buttons = computed<{ style: ExtraStatus, type: string }[]>(() => {
  return [
    {
      style: 'style1',
      type: 'primary',
    },
    {
      style: 'style2',
      type: 'primary',
    },
    {
      style: 'style3',
      type: 'primary',
    },
    {
      style: 'style4',
      type: 'primary',
    },
    {
      style: 'style5',
      type: 'primary',
    },
    {
      style: 'style6',
      type: 'primary',
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
        anchorCircleBorderWidth: 2,
        anchorCircleBorderColor: '#128ce8',
        anchorCircleFillColor: '#ffffff',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#128ce8'
      },
      'style1': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 2,
        anchorCircleBorderColor: '#6bb1de',
        anchorCircleFillColor: '#acd2e3',
        anchorCircleShadowColor: '#0000ff',
        anchorCircleShadowBlur: 15,

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#009de0',
        centerCircleShadowColor: '#ff0000',
        centerCircleShadowBlur: 15,
      },
      'style2': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleFillColor: '#000000',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#fd5666'
      },
      'style3': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 4,
        anchorCircleBorderColor: '#a16b52',
        anchorCircleFillColor: '#452a3a',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#fb6600'
      },
      'style4': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleFillColor: '#384faf',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#ffffff'
      },
      'style5': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleBorderWidth: 4,
        anchorCircleBorderColor: '#38bd3e',
        anchorCircleFillColor: 'rgba(0, 0, 0, 0.7)',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#ffffff',
      },
      'style6': {
        // 锚点圆的边框宽、边框颜色、填充颜色
        anchorCircleFillColor: 'rgba(0, 0, 255, 0.4)',

        // 中心圆的边框宽、边框颜色、填充颜色
        centerCircleFillColor: '#0000FF',
      },
    },
    lineStatusStyles: {
      'normal': {
        lineColor: '#128ce8',
        lineWidth: 1,
      },
      'style1': {
        lineColor: '#009de0',
        lineWidth: 1,
      },
      'style2': {
        lineColor: '#fd5666',
        lineWidth: 6,
      },
      'style3': {
        lineColor: '#54383a',
        lineWidth: 6,
      },
      'style4': {
        lineColor: '#384faf',
        lineWidth: 6,
      },
      'style5': {
        lineColor: '#bdbcc0',
        lineWidth: 18,
      },
      'style6': {
        lineColor: '#0000FF',
        lineWidth: 4,
      },
    },

    events: {
      'end': gestureEnd,
    },
    config: {
      arrow: {
        show: false,
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
