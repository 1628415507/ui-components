<!--
 * @Description: 
 * @Date: 2024-11-04 11:08:49
 * @LastEditTime: 2025-01-07 17:20:17
-->
<template>
  <el-button @click="run">Promise</el-button>
  :{{ val }}
</template>
<script setup>
import { ref } from 'vue'
import MyPromise from './Promise'
let val = ref('')
function run() {
  const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('success')
    }, 3000)
  })
  promise.then(
    (value) => {
      val.value = value
      console.log('【 MyPromise 】-20', value)
    },
  (reason) => {
      val.value = reason
      console.log('【 MyPromise 】-22', reason)
    }
  )
}
</script>

<style scoped></style>
