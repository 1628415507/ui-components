<template>
  <div id="dragBoxId" class="box">
    鼠标移动每隔1s执行一次
    <div>{{ eventInfo.offsetX }},{{ eventInfo.offsetY }}</div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// 节流
function throttle(fn: Function, delay = 1000) {
  let timer = null // 创建一个标记用来存放定时器的返回值
  return function () {
    //如果定时器还在，说明上次延迟执行还未完成，
    if (timer) {
      console.log('【 定时器还在 】-13')
      return //则忽略调用函数的请求，不用清空计时器
    }
    timer = setTimeout(() => {
      console.log('【 清空定时器】-13')
      fn.apply(this, arguments) // this为被拖拽的对象❤
      timer = null // 每次到时间就清空定时器
    }, delay)
  }
}
function callback(e) {
  eventInfo.value = e
}
const eventInfo = ref({})
let dragBox: HTMLElement
onMounted(() => {
  dragBox = document.getElementById('dragBoxId')
  dragBox?.addEventListener('mousemove', throttle(callback))
})
onUnmounted(() => {
  dragBox?.removeEventListener('mousemove', throttle(callback))
})
</script>
<style>
.box {
  width: 200px;
  height: 100px;
  background-color: var(--theme-color);
}
</style>
