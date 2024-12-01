<!--
 * @Description: 
 * @Date: 2024-11-12 14:08:51
 * @LastEditTime: 2024-11-15 14:22:19
-->
<template>
  <el-button @click="startDetection()">开启检测</el-button>
  <el-button @click="detection.stopDetection()">关闭检测</el-button>
  <div>检测网页是否为空闲状态：{{ isOnIdleDetection }},{{ time }} 秒内未操作{{ count }}</div>
</template>
<script setup>
import { onUnmounted, ref } from 'vue'
import { onIdleDetection } from './index.js'
const isOnIdleDetection = ref(false)
const time = 2
let detection = onIdleDetection(callback, time)
let count = ref(0)
function startDetection() {
  count.value = 0
  detection.startDetection()
}
function callback() {
  count.value++
  isOnIdleDetection.value = true
}

onUnmounted(() => {
  detection.stopDetection()
})
</script>
