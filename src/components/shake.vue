<template>
  <div :class="containerClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const isShake = ref(false);

const containerClass = computed(() => isShake.value ? ['shake'] : [])

const shake = () => {
  isShake.value = true;
  setTimeout(() => {
    isShake.value = false
  }, 600);
}

defineExpose({
  shake,
});
</script>

<style lang="less" scoped>
.shake {
  animation: shake 300ms ease-out infinite;
}

@keyframes shake {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
