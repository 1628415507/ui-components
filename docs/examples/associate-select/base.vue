<!--
 * @Description: 
 * @Date: 2024-07-16 13:49:04
 * @LastEditTime: 2024-12-27 15:46:31
-->
<template>
  <el-divider>默认单选</el-divider>
  <el-button type="primary" @click="clearSelectValue">清空值</el-button>
  <div class="mb-05" />
  {{ selectVal }},{{ selectLabel }}
  <z-associate-select
    ref="associateRef"
    v-model="selectVal"
    v-model:label="selectLabel"
    :configs="associateConfig"
    :params="associateParams"
    @changeSelect="getSelectItem"
  ></z-associate-select>
  <el-divider>多选</el-divider>
  {{ multipleSelectVal }},{{ multipleSelectLabel }}
  <z-associate-select
    ref="associateRef"
    v-model="multipleSelectVal"
    v-model:label="multipleSelectLabel"
    :multiple="true"
    :configs="associateConfig"
    :params="associateParams"
    @changeSelect="getSelectItem"
  ></z-associate-select>
</template>

<script setup>
// import {  ZAssociateSelect } from 'z-ui-comp'//按需引入
// import {  ZAssociateSelect } from '../../../src/index.ts'//按需引入
import { getCurrentInstance, ref, defineEmits } from 'vue'
const { proxy } = getCurrentInstance()
const selectVal = ref('')
const selectLabel = ref('')
const multipleSelectVal = ref('')
const multipleSelectLabel = ref('')

const associateConfig = ref({
  url: '/jhj-base-management/sysUser/queryAssociate', // 后台请求接口
  // 显示列配置
  tableColumns: [
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
const associateParams = ref({
  keyword: null,
  userType: '',
  isActive: 1
})
const emit = defineEmits(['getSelectVal'])
function getSelectItem(item) {
  console.log('【 getSelectItem 】-65', item)
}

function clearSelectValue() {
  selectVal.value = ''
  // proxy.$refs.associateRef.clearSelectValue()
}
</script>

<style lang="scss" scoped></style>
