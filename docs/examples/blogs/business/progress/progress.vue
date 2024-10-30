<template>
  <div>
    <el-button @click="updateProgress()">加载进度条</el-button>
    <br />
    <progress id="progressBar" :value="progressVal" max="100"></progress>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const progressVal = ref(0)
// 更新进度条
function updateProgress() {
  progressVal.value++
}
</script>

<style></style>
