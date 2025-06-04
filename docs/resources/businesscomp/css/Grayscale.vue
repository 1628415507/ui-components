<!--
 * @Description: 
 * @Date: 2024-10-31 15:18:02
 * @LastEditTime: 2025-06-04 13:35:59
-->
<template>
  <el-button type="primary" @click="setGrayscaleStyle(!isGrayscale)">黑白：{{ isGrayscale }}</el-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const isGrayscale: boolean = ref(false)
// 设置黑白样式到html上
function setGrayscaleStyle(val: boolean) {
  isGrayscale.value = val
  let grayscale: string = isGrayscale.value ? 'grayscale(100%)' : ''
  document.documentElement.style.setProperty('filter', grayscale)
  document.documentElement.style.setProperty('-webkit-filter', grayscale)
  document.documentElement.style.setProperty('-moz-filter', grayscale)
  document.documentElement.style.setProperty('-ms-filter', grayscale)
  document.documentElement.style.setProperty('-o-filter', grayscale)
  // document.documentElement.classList.add('grayscale')//class没效果？
  // document.documentElement.classList.remove('grayscale')
}
</script>
