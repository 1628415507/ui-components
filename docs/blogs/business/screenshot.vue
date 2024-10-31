<!--
 * @Description: web ⽹⻚如何禁⽌别⼈移除⽔印
 * @Date: 2024-08-23 16:49:49
 * @LastEditTime: 2024-10-21 09:23:53
-->
<template>
  <div>
    <canvas id="canvas"></canvas>
    <el-button @click="handleScreenshot">截图</el-button>
    <el-image style="width: 100px; height: 100px" :src="url" fit="contain" />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
const url = ref('')
function handleScreenshot() {
  // 2 #canvas {position: fixed;left: 0;top: 0;z-index: 9999;}
  // 3 </style</head<body<h1截图⽰例</h1<p这是⼀个简单的截图⽰例。</p<button id="btn"截
  // 图</button<canvas id="canvas"</canvas<script
  const canvas = document.getElementById('canvas')
  console.log('【 canvas 】-21', canvas)
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(document.documentElement, 0, 0)
  const imgData = canvas.toDataURL()
  url.value = imgData
  console.log('【  url.value 】-29', url.value)
}
onMounted(() => {})
</script>
