<template>
  <div>
    <el-button @click="setWaterMark({ content: 'CAVAS水印' })">添加水印</el-button>
    <div>
      <h3 v-for="item in 3">哈哈哈哈哈哈哈，我是重要内容</h3>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
function setWaterMark(config = {}) {
  const {
    width = '300px',
    height = '200px',
    textAlign = 'center',
    textBaseline = 'middle',
    font = '20px Microsoft Yahei',
    fillStyle = 'rgba(184, 184, 184, 0.6)',
    content = '水印',
    rotate = '45',
    zIndex = 10000
  } = config
  const container = document.body //放置水印的容器
  // 1. 绘制水印canvas图片
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)
  const ctx = canvas.getContext('2d')
  // 水印样式
  ctx.textAlign = textAlign
  ctx.textBaseline = textBaseline
  ctx.font = font
  ctx.fillStyle = fillStyle
  ctx.rotate((Math.PI / 180) * rotate)
  ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2)
  const base64Url = canvas.toDataURL() // 转成图片输出
  // 2. 创建背景图存放的div
  const oldWmDiv = document.querySelector('.__wm') //已存在的水印容器
  const wmDiv = oldWmDiv || document.createElement('div') //获取或创建水印存放容器div
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
                  pointer-events: none;
                  background-repeat:repeat;
                  background-image:url('${base64Url}')`
  // background-repeat:repeat;//。默认情况下,背景图片会在水平和垂直方向上重复出现,直到填满整个页面.
  wmDiv.setAttribute('style', styleStr) //设置背景图片尾水印
  container.insertBefore(wmDiv, container.firstChild) //将水印添加到对应容器中
  wmDiv.classList.add('__wm')

  // 3. 判断是否已存在水印容器
  if (!oldWmDiv) {
    container.insertBefore(wmDiv, container.firstChild) //将水印添加到对应容器中
  }
}

onMounted(() => {})
</script>
<style scoped lang="scss"></style>
