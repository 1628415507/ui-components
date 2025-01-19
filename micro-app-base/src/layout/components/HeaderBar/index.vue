<!--
 * @Description: 导航栏
 * @Author: Hongzf
 * @Date: 2022-11-23 18:06:18
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 18:13:13
-->

<template>
  <div class="header-wrap">
    <!-- 控制侧边栏伸缩 -->
    <div class="left-wrap">
      <div>
        <el-icon v-if="isCollapse" @click="handleSidebar"><Expand /></el-icon>
        <el-icon v-else @click="handleSidebar"><Fold /></el-icon>
      </div>
      <Breadcrumb />
    </div>
    <!-- 右侧工具栏 -->
    <div class="right-wrap">
      <el-dropdown>
        <el-icon style="margin-right: 8px; margin-top: 1px"><setting /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>View</el-dropdown-item>
            <el-dropdown-item>Add</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span>Tom</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from './Breadcrumb.vue'
import { computed } from 'vue'
import { Setting, Expand, Fold } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// 操作侧边栏
const store = useStore()
const sidebar = computed(() => {
  return store.state.app.sidebar
})
const isCollapse = computed(() => {
  return sidebar.value.isCollapse
})
function handleSidebar() {
  store.commit('SET_COLLAPSE', !isCollapse.value)
}
// 退出登录
const router = useRouter() // useRoute相当于以前的this.$route
function logout() {
  router.push('./login').catch((err) => {
    console.log('【 退出登录跳转失败-err 】-57', err)
  })
}
</script>

<style lang="scss" scoped>
.header-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;

  .left-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 20px;
    cursor: pointer;
    .el-icon {
      font-size: 17px;
      margin-right: 8px;
      margin-top: 1pxs;
    }
  }
  .right-wrap {
    width: 250px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    right: 20px;
  }
}
</style>
