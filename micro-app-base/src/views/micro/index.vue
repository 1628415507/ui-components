<!--
 * @Author: Hongzf
 * @Date: 2022-11-21 09:54:25
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 17:44:09
 * @Description:
-->
<template>
  <!-- name：应用名称, url：应用地址(当前项目运行的端口) -->
  <h1>
    主应用：<br />
    1、name：必传参数，必须以字母开头，且不可以带特殊符号(中划线、下划线除外)<br />
    2、url：必传参数，子应用的url,必须指向子应用的index.html，如：http://localhost:3001/ 或
    http://localhost:3001/index.html<br />
    3、baseroute：主应用当前文件页面的路由l<br />
    4.默认开启with沙箱，如果with沙箱无法正常运行，可以尝试切换到iframe沙箱。
  </h1>
  <el-button @click="sendData">向子应用发送数据:{{ num }}</el-button>
  <micro-app
    name="micro-app"
    url="http://localhost:3001/"
    baseroute="/basemicro"
    iframe
    :data="params"
  ></micro-app>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import microApp from '@micro-zoe/micro-app'
const params = ref({ type: '发送给子应用的数据' })
// 发送数据-方式1-data传参
// 发送数据-方式1-setData
const num = ref()
function sendData() {
  num.value = Math.random()
  //   setData是异步执行的，多个setData会在下一帧合并为一次执行
  microApp.setData('micro-app', { name: 'jack', num: num.value }, () => {
    console.log('数据已经发送完成')
  })
}
onMounted(() => {})
</script>

<style scoped></style>
