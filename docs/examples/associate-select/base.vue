<!--
 * @Description: 
 * @Date: 2024-07-16 13:49:04
 * @LastEditTime: 2024-08-19 09:45:46
-->
<template>
  <!-- <el-button type="primary" @click="autoCompleteConfig.multiple = !autoCompleteConfig.multiple">
    是否多选：{{ autoCompleteConfig.multiple }}
  </el-button> -->
  <el-button type="primary" @click="clearSelectValue">清空值</el-button>
  <div class="mb-05" />
  <z-associate-select
    ref="associateRef"
    v-model="selectVal"
    v-bind="$attrs"
    :configs="autoCompleteConfig"
    :searchColumns="userSearchColumns"
    @handleAutoSelect="getSelectItem"
  ></z-associate-select>
</template>

<script setup>
// import {  ZAssociateSelect } from 'z-ui-comp'//按需引入
// import {  ZAssociateSelect } from '../../../src/index.ts'//按需引入
import { getCurrentInstance, ref, defineEmits } from 'vue'
const { proxy } = getCurrentInstance()
const selectVal = ref()
const autoCompleteConfig = ref({
  url: '/jhj-base-management/sysUser/queryAssociate', // 后台请求接口
  multiple: false, // 是否多选
  // 显示列配置
  showColumn: [
    {
      label: '登录账号',
      prop: 'userName',
      minWidth: 150
    },
    {
      label: '中文名称',
      prop: 'userNameCn',
      minWidth: 150
    },
    {
      label: '英文名称',
      prop: 'userNameLocal',
      minWidth: 150
    }
  ],
  codeKey: 'sysUserId', // 控件编码值
  nameKey: 'userNameCn' // input显示填充字段值设置
})
// 查询条件(根据实际传参)
const userSearchColumns = ref({
  keyword: null,
  userType: '',
  isActive: 1
})
const emit = defineEmits(['getSelectVal'])
function getSelectItem(item = {}) {
  console.log('【 getSelectItem 】-65', item)
}

function clearSelectValue() {
  proxy.$refs.associateRef.clearSelectValue()
}
</script>

<style lang="scss" scoped></style>
