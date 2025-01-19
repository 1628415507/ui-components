<!--
 * @Author: Hongzf
 * @Date: 2022-11-21 09:54:25
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 17:44:09
 * @Description:
-->
<template>
  <!-- name：应用名称, url：应用地址(当前项目运行的端口) -->
  <h1>BaseApp</h1>
  <micro-app name="base-app" url="http://localhost:8888/"></micro-app>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { getMockInfo } from '@/api/mockApi'

const getData = () => {
  getMockInfo().then((res: Object) => {
    console.log(res)
  })
}
onMounted(() => {
  getData()
})
</script>

<style scoped></style>
