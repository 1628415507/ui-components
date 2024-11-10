<!--
 * @Description: 
 * @Date: 2024-10-29 10:26:18
 * @LastEditTime: 2024-10-29 10:44:50
-->
<template>
  <el-divider>未结束</el-divider>
  <ZCountdown :endTime="deadline"></ZCountdown>
  <el-divider>已结束</el-divider>
  <ZCountdown :endTime="deadline2"></ZCountdown>
</template>

<script setup>
import { ref } from 'vue'
const deadline = ref(Date.now() + (new Date().setHours(23, 59, 59) - Date.now()))
const deadline2 = '2024-10-28 23:59:59'
</script>
