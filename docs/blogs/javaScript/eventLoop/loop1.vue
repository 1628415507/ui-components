<!--
 * @Description: 
 * @Date: 2025-01-06 17:26:57
 * @LastEditTime: 2025-01-06 17:45:39
-->
<template>
  <el-button @click="loop">执行结果</el-button>
  ：{{ res.join(',') }}
</template>
<script setup>
import { ref } from 'vue'
const res = ref([])
function log(val) {
  res.value.push(val)
  console.log(val)
}
function loop() {
  res.value=[]
  setTimeout(() => {
    log(1)
  }, 0)
  // 微任务
  new Promise((resolve) => {
    log(2) //new Promise是同步的
    resolve()
  })
    .then(() => {
      log(3)
    })
    .then(() => {
      log(4)
    })

  log(5)
}
</script>

<style scoped></style>
