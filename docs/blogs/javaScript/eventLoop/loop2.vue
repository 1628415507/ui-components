<!--
 * @Description: 
 * @Date: 2025-01-06 17:44:12
 * @LastEditTime: 2025-01-06 17:47:03
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
  res.value = []
  const first = () =>
    new Promise((resolve, reject) => {
      log(3)

      const p = new Promise((resolve, reject) => {
        log(7)
        setTimeout(() => {
          log(5)
          resolve(6)
        }, 0)
        resolve(1)
      })

      resolve(2)

      p.then((arg) => {
        log(arg)
      })
    })

  first().then((arg) => {
    log(arg)
  })
  log(4)
}
</script>

<style scoped></style>
