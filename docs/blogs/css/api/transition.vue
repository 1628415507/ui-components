<template>
  <div ref="demoRef" class="transition-container">
    <p v-for="(item, index) in 3" :class="['fade-in', { transition: showBox[index] }]">第{{ index + 1 }}行渐入</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { observerDom } from './animation.ts'
const demoRef = ref(null)
const showBox = ref([false, false, false])
onMounted(() => {
  observerDom(demoRef.value, showBox)
})
</script>

<style scoped lang="scss">
.transition-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 渐入动画 */
.fade-in {
  opacity: 0; //初始状态，元素完全透明
  transform: translateY(40px); //向下偏移 40px
  // 当类名从 .fade-in 变为 .fade-in.show 时，opacity 和 transform 属性会在 1 秒内平滑过渡，形成向上淡入的动画。
  transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1);

  &.transition {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
