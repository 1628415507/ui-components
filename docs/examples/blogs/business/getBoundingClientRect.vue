<template>
  <div>
    <el-button @click="isInViewport(300, 100, '我是DOM水印')">添加水印</el-button>
    <el-button @click="removedNodes">清空水印</el-button>
    <div>
      <h3 v-for="item in 3">哈哈哈哈哈哈哈，我是重要内容</h3>
    </div>
    <!-- 水印背景容器 -->
    <div id="wmContainerId"></div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
function isInViewport(element) {
  const rect = element.getBoundingClientRect()
  const { top, left, bottom, right } = rect
  const height = window.innerHeight || document.documentElement.clientHeight
  const width = window.innerWidth || document.documentElement.clientWidth
  return top >= 0 && left >= 0 && bottom <= height && right <= width

  // Example usageconst element = document.getElementById('my-element');
  if (isInViewport(element)) {
    console.log('Element is in viewport')
  } else {
    console.log('Element is not in viewport')
  }
}

onMounted(() => {})
</script>
<style scoped lang="scss"></style>
