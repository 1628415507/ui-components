<!--
 * @Description: 
 * @Date: 2024-08-16 17:37:03
 * @LastEditTime: 2024-12-30 17:19:44
-->
<template>
  <el-row :gutter="10" v-enter-focus>
    <el-col v-for="item in list" :key="item" :span="6">
      <el-input v-model="item.value" />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
let list = ref([
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
  { value: 8 },
  { value: 9 }
])
</script>

<style scoped></style>
