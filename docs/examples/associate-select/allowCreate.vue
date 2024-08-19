<template>
  <z-associate-select
    ref="associateRef"
    v-model="selectVal"
    v-bind="$attrs"
    :configs="autoCompleteConfig"
    :allow-create="true"
    :searchColumns="userSearchColumns"
    @getCreateVal="getCreateVal"
    @handleAutoSelect="getSelectItem"
  ></z-associate-select>
 
</template>

<script setup>
import { getCurrentInstance, ref, defineEmits } from 'vue'
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
// 获取输入值
function getCreateVal(val) {
  console.log('【 getCreateVal 】-68', val)
}

</script>

<style lang="scss" scoped></style>
