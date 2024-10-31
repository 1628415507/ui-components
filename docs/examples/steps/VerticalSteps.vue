<!--
 * @Description: 
 * @Date: 2024-10-29 10:00:09
 * @LastEditTime: 2024-10-29 10:13:07
-->
<template>
  <div>
    <el-divider>第一个节点的样式</el-divider>
    <z-vertical-steps firstNodeType="border" :stepList="stepList1"></z-vertical-steps>
    <el-divider>节点样式：圆心</el-divider>
    <z-vertical-steps :stepList="stepList1"></z-vertical-steps>
    <!-- <el-divider>节点样式：</el-divider> -->
    <!-- <z-vertical-steps nodeIcon="clock" :stepList="stepList2"></z-vertical-steps> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
const stepList1 = ref([
  { title: '上海', description: '中国' },
  { title: '沙巴', description: '马来西亚' }
])
// const stepList2 = ref([
//   { title: '2024-08-01', description: '（起）' },
//   { title: '2024-08-06', description: '（终）' }
// ])
</script>
