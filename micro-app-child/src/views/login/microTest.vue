<!--
 * @Author: Hongzf
 * @Date: 2022-11-21 09:54:25
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 17:44:09
 * @Description:
-->
<template>
  <div>
    <div>我是子应用的登录页面</div>
    <div>接收主应用基座的数据:{{ num }}</div>
    <el-image :src="Logo"></el-image>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Logo from '@/assets/logo.png'
const num = ref(0)
const getData = () => {
  // @ts-ignore
  console.log('【 window 】-23', window, window.__MICRO_APP_BASE_ROUTE__)
  // if (window.__MICRO_APP_BASE_ROUTE__) {
  // @ts-ignore
  window.microApp.addDataListener((data: Object) => {
    console.log('【 addDataListener 】-25', data)
    num.value = data.num
  }, true)
  //   }
}
onMounted(() => {
  getData()
})
</script>

<style scoped></style>
