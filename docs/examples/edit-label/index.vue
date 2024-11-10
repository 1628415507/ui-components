<!--
 * @Description: 
 * @Date: 2024-10-29 10:26:18
 * @LastEditTime: 2024-10-30 16:40:48
-->
<template>
  <el-divider border-style="dashed">基础用法</el-divider>
  <ZEditLabel v-model="label"></ZEditLabel>

  <el-divider border-style="dashed">只读标签</el-divider>
  <ZEditLabel v-model="labelReadonly" readonly></ZEditLabel>

  <el-divider border-style="dashed">编辑的触发方式:按钮图标/双击标签</el-divider>
  <ZEditLabel v-model="label" trigger="dblclick"></ZEditLabel>
  <ZEditLabel v-model="labelIcon" trigger="icon"></ZEditLabel>

  <el-divider border-style="dashed">校验</el-divider>
  <ZEditLabel v-model="labelValid" :beforeEditClose="beforeEditClose"></ZEditLabel>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const label = ref('双击进行编辑')
const labelReadonly = ref('只读标签')
const labelIcon = ref('点击按钮图标编辑')
const labelValid = ref(8)

function beforeEditClose(val) {
  if (val < 10) {
    return true
  } else {
    ElMessage.warning('输入值不能大于10')
    return false
  }
}
</script>
