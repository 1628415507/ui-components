<!--
 * @Description: 
 * @Date: 2025-01-06 17:44:12
 * @LastEditTime: 2025-01-06 18:01:35
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
  setTimeout(() => {
    log('0')
  }, 0)
  new Promise((resolve, reject) => {
    log('1')
    resolve()
  })
    .then(() => {
      log('2')
      new Promise((resolve, reject) => {
        log('3')
        resolve()
      })
        .then(() => {
          log('4')
        })
        .then(() => {
          log('5')
        })
    })
    .then(() => {
      log('6')
    })

  new Promise((resolve, reject) => {
    log('7')
    resolve()
  }).then(() => {
    log('8')
  })
}
</script>

<style scoped></style>
