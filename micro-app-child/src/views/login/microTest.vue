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
    <div>接收主应用基座的数据:{{ parentData.num }}</div>
    <el-image :src="Logo"></el-image>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Logo from '@/assets/logo.png'
const parentData = ref({ num: '' })
const getData = () => {
  // @ts-ignore
  console.log('【 window 】-23', window, window.__MICRO_APP_BASE_ROUTE__)
  // if (window.__MICRO_APP_BASE_ROUTE__) {
  // @ts-ignore
  window.microApp.addDataListener((data: Object) => {
    parentData.value = data
    console.log('【 接收主应用的数据-parentData 】-27', parentData)
  }, true)
  //   }
}
onMounted(() => {
  getData()
})
</script>

<style scoped></style>
