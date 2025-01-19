<!--
 * @Description: 页面内容
 * @Author: Hongzf
 * @Date: 2022-11-24 16:47:10
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-11-24 17:39:13
-->
<template>
  <!-- <keep-alive>
    <router-view />
  </keep-alive> -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
