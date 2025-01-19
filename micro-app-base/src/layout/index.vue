<!--
 * @Description: 页面布局
 * @Author: Hongzf
 * @Date: 2022-11-23 17:13:33
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-02 14:12:17
-->

<template>
  <!--
    <el-container>：外层容器。
    当子元素中包含 <el-header> 或 <el-footer> 时，
    全部子元素会垂直上下排列， 否则会水平左右排列。
  -->
  <el-container class="layout-wrap" style="height: 500px">
    <!-- 左侧-侧边栏 -->
    <AsideBar></AsideBar>
    <!-- 右侧-内容 -->
    <el-container>
      <!-- 顶栏容器-导航栏 -->
      <el-header>
        <HeaderBar></HeaderBar>
      </el-header>
      <!-- 主要区域容器 -->
      <el-main>
        <Main></Main>
        <!-- <el-scrollbar>
          <el-table :data="tableData">
            <el-table-column prop="date" label="Date" width="140" />
            <el-table-column prop="name" label="Name" width="120" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </el-scrollbar> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { AsideBar, HeaderBar, Main } from './components'

// import { ref } from 'vue'
// // import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'

// const item = {
//   date: '2016-05-02',
//   name: 'Tom',
//   address: 'No. 189, Grove St, Los Angeles'
// }
// const tableData = ref(Array.from({ length: 20 }).fill(item))
</script>

<style lang="scss" scoped>
.layout-wrap {
  .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
    text-align: right;
    font-size: 12px;
  }
  .el-main {
    padding: 0;
  }
}
</style>
