<!--
 * @Description: 
 * @Date: 2024-06-26 11:40:35
 * @LastEditTime: 2024-07-30 17:03:33
-->
<template>
  <el-collapse accordion>
    <el-collapse-item title="35字符分割线输入框">
      <ZInputDivider></ZInputDivider>
    </el-collapse-item>
    <el-collapse-item title="-字符分割线输入框">
      <!-- <ZInputCode></ZInputCode> -->
    </el-collapse-item>
  </el-collapse>
</template>
<script setup lang="ts">
import ZInputDivider from "./form/input-divider/src/index.vue"; // 引入封装好的组件
// import ZInputCode from "./form/input-code/src/index.vue"; // 引入封装好的组件
</script>
<style scoped></style>
