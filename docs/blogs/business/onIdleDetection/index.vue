<template>
  <div>检测网页是否为空闲状态：{{ isOnIdleDetection }},{{ time }} 秒内未操作{{ count }}</div>
</template>
<script setup>
import { onUnmounted, ref } from 'vue'
import { onIdleDetection } from './index.js'
let detection = onIdleDetection(callback, time, true)
const isOnIdleDetection = ref(false)
const time = 3
let count = ref(1)

function callback() {
  count.value++
  isOnIdleDetection.value = true
}

onUnmounted(() => {
  detection.stopDetection()
})
</script>
