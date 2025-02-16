<!--
 * @Description: 
 * @Date: 2025-01-06 17:44:12
 * @LastEditTime: 2025-01-06 17:47:03
-->
<template>
  <el-button @click="loop()">执行结果</el-button>
  <el-button @click="loop(false)">不执行resolve(1)的结果</el-button>
  <br />
  ：{{ res.join(',') }}
</template>
<script setup>
import { ref } from 'vue'
const res = ref([])
function log(val) {
  res.value.push(val)
  console.log(val)
}
function loop(flag = true) {
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
        flag && resolve(1) //思考：如果此行注释掉结果有什么区别？
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
