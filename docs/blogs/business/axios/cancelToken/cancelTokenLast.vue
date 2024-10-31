<template>
  <el-button @click="getList">取消请求</el-button>
</template>

<script setup>
import { cancelPendingRequest } from './cancelToken-last' // 导入取消请求的方法
function getList() {
  cancelPendingRequest() // 取消所有正在发送请求的请求
  axios.get() // 发送新的请求
}
</script>

<style lang="scss" scoped></style>
