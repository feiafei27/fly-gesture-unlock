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
  gestureUnlockRenderer.value = new GestureUnlockRenderer<ExtraStatus>({
    container: container.value,
    anchorDefines: [
      {
        id: "1",
        location: {
          x: 40,
          y: 55
        },
        anchorCircleRadius: 30,
        centerCircleRadius: 10
      },
      {
        id: "2",
        location: {
          x: 76,
          y: 245
        },
        arrow: {
          distance: 23,
          size: 12
        },
        anchorCircleRadius: 40,
        centerCircleRadius: 20
      },
      {
        id: "3",
        location: {
          x: 100,
          y: 120
        },
        arrow: {
          distance: 20,
          size: 10
        },
        anchorCircleRadius: 35,
        centerCircleRadius: 15
      },
      {
        id: "4",
        location: {
          x: 250,
          y: 40
        },
        arrow: {
          distance: 14
        },
        anchorCircleRadius: 25,
        centerCircleRadius: 10
      },
      {
        id: "5",
        location: {
          x: 190,
          y: 140
        },
        arrow: {
          size: 5,
          distance: 10,
        },
        anchorCircleRadius: 20,
        centerCircleRadius: 6
      },
      {
        id: "6",
        location: {
          x: 240,
          y: 250
        },
        anchorCircleRadius: 30,
        centerCircleRadius: 10
      },
      {
        id: "7",
        location: {
          x: 160,
          y: 220
        },
        anchorCircleRadius: 30,
        centerCircleRadius: 10
      },
    ],

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
