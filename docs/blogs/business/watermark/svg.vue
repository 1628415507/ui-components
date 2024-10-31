<template>
  <div>
    <el-button @click="setWaterMark({ content: 'SVG水印' })">添加水印</el-button>
    <div>
      <h3 v-for="item in 3">哈哈哈哈哈哈哈，我是重要内容</h3>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
function setWaterMark(config = {}) {
  const { width = '300px', font = '20px Microsoft Yahei', content = '水印', zIndex = 10000, opacity = 0.3 } = config
  const container = document.body //放置水印的容器
  // 1. 创建svg
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}">
                  <text x="50%" y="50%" dy="12px"
                    text-anchor="middle"
                    stroke="#000000"
                    stroke-width="1"
                    stroke-opacity="${opacity}"
                    fill="none"
                    transform="rotate(-45, 120 120)"
                    style="font-size: ${font};">
                    ${content}
                  </text>
                </svg>`
  const base64Url = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`
  // 2. 创建背景图存放的div
  const oldWmDiv = document.querySelector('.__wm')
  const watermarkDiv = oldWmDiv || document.createElement('div')
  // 设置背景图样式
  const styleStr = `
                  position:fixed;
                  top:0;
                  left:0;
                  bottom:0;
                  right:0;
                  width:100%;
                  height:100%;
                  z-index:${zIndex};
                  pointer-events:none;
                  background-repeat:repeat;
                  background-image:url('${base64Url}')`

  watermarkDiv.setAttribute('style', styleStr)
  watermarkDiv.classList.add('__wm')
  // 3. 判断是否已存在水印容器
  if (!oldWmDiv) {
    container.style.position = 'relative'
    container.insertBefore(watermarkDiv, container.firstChild)
  }
}

onMounted(() => {})
</script>
<style scoped lang="scss"></style>
