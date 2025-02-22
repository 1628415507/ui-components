<!--
 * @Author: Hongzf
 * @Date: 2022-11-21 09:54:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-22 17:08:53
 * @Description:
 https://blog.csdn.net/outsider76557/article/details/129687164
-->
<template>
  <!-- https://jd-opensource.github.io/micro-app/docs.html#/zh-cn/api/base-app -->
  <!-- 1、name：必传参数，必须以字母开头，且不可以带特殊符号(中划线、下划线除外) 
 2、url：必传参数，必须指向子应用的index.html，如：http://localhost:3000/ 或 http://localhost:3000/index.html -->
  <!-- <micro-app 
      :name="micro-app" 
      :url="http://localhost:8081/" //你在子应用vite.config.ts里面配的端口
      baseRoute="/micro-app" //这个官网说失效，我忘记删了，根据情况试试吧
      :data="dataForChid" 
      @datachange="handleDataChange"
      inline  //官网要加的属性
      disableSandbox //官网要加的属性，关闭沙箱
      keep-alive 
      style="height: 100%"
    ></micro-app> -->
  <micro-app
    :name="'micro-app'"
    class="w-full h-full"
    url="http://localhost:3001/"
    :data="params"
    inline 
    default-page="/home"
    keep-alive
    style="height: 100%"
  ></micro-app>
  <!-- <micro-app-base
    :name="appCode"
    class="w-full h-full"
    url="http://localhost:3001/"
    :data="params"
    baseroute="/microChildApp/"
    default-page="/home"
  ></micro-app-base> -->
  <!-- <micro-app-air
    class="w-full h-full"
    :name="appCode"
    :url="params.linkUrl"
    :baseroute="`${baseRouteContextPath}microChildApp/${params.appCode}`"
    :data="microData"
    default-page="/index"
  ></micro-app-air> -->
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
const appCode = 'BASE'
const params = ref({ type: '发送给子应用的数据' })

onMounted(() => {})
</script>

<style scoped>
.w-full {
  width: 100% !important;
}

.h-full {
  min-height: 400px;
  background-color: #ccc;
  height: 100% !important;
}
</style>
