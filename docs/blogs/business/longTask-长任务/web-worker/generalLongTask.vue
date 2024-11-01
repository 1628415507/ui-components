<template>
  <div>
    <el-button @click="handleLongTask()">普通长任务执行</el-button>
    <div id="longTaskId" class="el-wrap"></div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
function handleLongTask() {
  // 主线程代码
  let el = document.querySelector('#longTaskId') //获取某个真实的dom元素
  let mainDivStart = document.createElement('div')
  mainDivStart.innerHTML = '主线程任务开始'
  el.appendChild(mainDivStart)
  // --------------- 主线程长任务 Start---------------
  function longTask() {
    const params = { start: 0, end: 50000 }
    const { start, end } = params
    let sum = 0
    for (let i = start; i <= end; i++) {
      console.log('【 主线程长任务... 】-39')
      sum += i
    }
    let div = document.createElement('div')
    div.innerHTML = '主线程长任务完成:' + sum
    el.appendChild(div)
  }
  longTask() // 执行长任务
  // --------------- 主线程长任务 End---------------
  // -- 主线程任务
  let mainDivEnd = document.createElement('div')
  mainDivEnd.innerHTML = '主线程任务结束'
  el.appendChild(mainDivEnd)
}
</script>
<style lang="scss" scoped>
.el-wrap {
  min-height: 80px;
  background-color: var(--gray-bg);
}
</style>
