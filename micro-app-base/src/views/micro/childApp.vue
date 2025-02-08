<!--
 * @Author: Hongzf
 * @Date: 2022-11-21 09:54:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-07 16:01:20
 * @Description:
-->
<template>
 <!-- 1、name：必传参数，必须以字母开头，且不可以带特殊符号(中划线、下划线除外) 
 2、url：必传参数，必须指向子应用的index.html，如：http://localhost:3000/ 或 http://localhost:3000/index.html -->
  <micro-app-base
    :name="appCode"
    class="w-full h-full"
    url="http://localhost:3001/"
    :data="params"
    baseroute="/basemicro"
    default-page="/index"
  ></micro-app-base>
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
  height: 100% !important;
}
</style>
