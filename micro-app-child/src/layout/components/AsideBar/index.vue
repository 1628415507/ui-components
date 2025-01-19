<!--
 * @Description: 侧边栏/菜单栏
 * @Author: Hongzf
 * @Date: 2022-11-23 17:57:04
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-11-29 15:56:42
-->

<template>
  <div class="aside-wrap">
    <!-- LOGO -->
    <!-- <div class="logo">logo</div> -->
    <!-- 菜单列表 -->
    <el-scrollbar class="scrollbar-wrap">
      <!-- :default-openeds="['1', '3']"  @close="handleClose" @open="handleOpen"-->
      <el-menu class="menu-wrap" :collapse="isCollapse" :default-active="activeMenu">
        <!-- 菜单项 -->
        <MenuItem
          v-for="(menuItem, index) in menuList"
          :key="index"
          :item="menuItem"
          :isCollapse="isCollapse"
          :isFirstLevel="true"
        >
        </MenuItem>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import MenuItem from './MenuItem.vue'

const store = useStore()
// 获取菜单数据(即动态路由)
const menuList = computed(() => {
  return store.state.app.dynamicRoutes
})
// 获取菜单列表的伸缩状态
const sidebar = computed(() => {
  return store.state.app.sidebar
})
const isCollapse = computed(() => {
  return sidebar.value.isCollapse
})

// 获取当前活跃的路由
const curRoute = useRoute()
const activeMenu = computed(() => {
  const { path } = curRoute
  return path
})

// const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
// const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
</script>

<style lang="scss" scoped>
.aside-wrap {
  background: $themeColor;
  min-height: 98vh; // calc(100vh - 20px);;
  .scrollbar-wrap {
    overflow-x: hidden !important;

    // 菜单展开时的宽度
    .menu-wrap:not(.el-menu--collapse) {
      width: 200px;
      height: 100%;
    }
  }
}
</style>
