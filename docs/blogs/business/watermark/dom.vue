<template>
  <div>
    <el-button @click="setWaterMark(300, 100, '我是DOM水印')">添加水印</el-button>
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
function setWaterMark(width, height, content) {
  removedNodes()
  let box = document.getElementById('wmContainerId')
  let boxWidth = box.clientWidth,
    boxHeight = box.clientHeight
  // 每行
  for (let i = 0; i < Math.floor(boxHeight / height); i++) {
    // 每列
    for (let j = 0; j < Math.floor(boxWidth / width); j++) {
      let next = document.createElement('div')
      next.setAttribute('class', 'watermark-item') //每个水印的样式
      next.style.width = width + 'px'
      next.style.height = height + 'px'
      next.innerText = content + i + '-' + j
      box.appendChild(next)
    }
  }
}
function removedNodes() {
  let box = document.getElementById('wmContainerId')
  box.innerHTML = null
}
onMounted(() => {})
</script>
<style scoped lang="scss">
#wmContainerId {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  user-select: none;
  pointer-events: none; //禁止用户选择元素
  opacity: 0.1;
  z-index: 999;
}

.watermark-item {
  text-align: center;
}
</style>
