<template>
   <el-button @click="hanldleAbortController()">AbortControlle终止请求</el-button>
</template>

<script setup>
import axios from 'axios'
function hanldleAbortController() {
  const controller = new AbortController()
  axios.get('/foo/abortController', { signal: controller.signal }).then(function (response) {
    //...
  }).catch(err => {
    console.log('【 err 】-12', err)
    if (err.name === 'CanceledError') {
      console.log('请求被终止')
    }
  })
  controller.abort()
}
</script>

<style lang="scss" scoped></style>
