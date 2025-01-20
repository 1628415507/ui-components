<!--
 * @Description: 页面内容
 * @Author: Hongzf
 * @Date: 2022-11-24 16:47:10
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-11-24 17:39:13
-->
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component :is="Component" :key="route.name" />
    </keep-alive>
  </router-view>
</template>
