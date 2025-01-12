<!--
 * @Description: 
 * @Date: 2024-08-16 17:37:03
 * @LastEditTime: 2025-01-07 15:05:53
-->
<template>
  <el-row :gutter="10">
      <el-input v-model="inputVal"  v-uppercase/>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
let inputVal = ref('')
</script>

<style scoped></style>
