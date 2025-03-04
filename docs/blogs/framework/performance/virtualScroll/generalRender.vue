<!--
 * @Description: 
 * @Date: 2024-11-01 16:08:04
 * @LastEditTime: 2024-11-01 16:24:46
-->
<template>
  <el-button @click="handleClick">渲染列表</el-button>
  <div>JS 运行所需要的时间：{{ jsTime }}</div>
  <div>渲染完成所需要的时间：{{ renderTime }}</div>

  <ul id="ulId" class="demo-box"></ul>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const renderTime = ref(undefined) //渲染完成所需要的时间
const jsTime = ref(undefined) // JS 运行所需要的时间

function handleClick() {
  renderTime.value = 0
  // 【记录任务开始时间】
  let now = Date.now()
  const total = 10000 // 插入一万条数据
  let ul = document.getElementById('ulId') // 获取容器
  ul.innerHTML = ''
  // 【将数据插入容器中】
  for (let i = 0; i < total; i++) {
    let li = document.createElement('li')
    li.innerText = `${i}:${~~(Math.random() * total)}`
    ul.appendChild(li)
  }
  console.log('JS运行时间：', Date.now() - now)
  // 【JS运行时间】
  jsTime.value = Date.now() - now
  setTimeout(() => {
    // 【渲染时间】
    renderTime.value = Date.now() - now
    console.log('总运行时间(包括渲染时间)：', Date.now() - now)
  }, 0)
}
onMounted(() => {})
</script>

<style scoped>
#ulId {
  height: 300px;
  overflow: auto;
}
</style>
