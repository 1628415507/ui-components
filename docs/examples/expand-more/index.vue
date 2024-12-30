<template>
  <div>
    <el-divider>自动控制</el-divider>
    <z-expand-more>
      默认展示的内容...
      <template #expand>展开更多的内容...</template>
    </z-expand-more>
    <el-divider>手动控制</el-divider>
    <el-button type="primary" @click="isExpand = !isExpand">点击按钮展开收缩</el-button>
    <z-expand-more v-model="isExpand">
      默认展示的内容...（点击按钮展开）
      <template #expand>展开更多的内容...</template>
    </z-expand-more>
  </div>
</template>
<script setup>
// import { ZExpandMore } from 'z-ui-comp'//按需引入
// import 'z-ui-comp/style.css'//该文件可在main.js中全局引入
import { ref } from 'vue'
const isExpand = ref(false)
</script>
