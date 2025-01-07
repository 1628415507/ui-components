<!--
 * @Description: https://juejin.cn/post/6844903698166988808#heading-1
 * @Date: 2024-11-04 11:08:49
 * @LastEditTime: 2025-01-06 17:27:40
-->
<template>
  <el-button @click="run">Click Me</el-button>
</template>
<script setup>
import { ref } from 'vue'
let obj = {
  age: '18'
}
function run() {
  Object.defineProperty(obj, 'name', {
    value: 'red'
  })
  Object.defineProperty(obj, 'age', {
    value: '20'
  })
  console.log('【 obj 】-13', obj)
}
</script>

<style scoped></style>
