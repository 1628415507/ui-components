<!--
 * @Description:系统用户（联想控件二次封装
 * @Date: 2024-02-27 18:20:28
 * @LastEditTime: 2024-12-16 18:00:49
-->
<template>
  <z-associate-select
    ref="userRef"
    v-model="selectVal"
    v-model:defValue="selectVal"
    v-bind="$attrs"
    :configs="autoCompleteConfig"
    :allow-create="allowCreate"
    :params="userSearchColumns"
    @getCreateVal="getCreateVal"
    @changeSelect="getSelectItem"
  ></z-associate-select>
</template>

<script setup>
// import AutoComplete from '../../auto-complete/src/index.vue'
import { watch ,getCurrentInstance, ref, defineProps, computed, defineEmits, onMounted, onUnmounted, nextTick } from 'vue'
const { proxy } = getCurrentInstance()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isEdit: {
    //是否编辑
    type: Boolean,
    default: null
  },
  userType: {
    //用户类型
    type: String,
    default: null
  },
  isMuptiple: {
    //是否多选联想控件，如果是单选的可以不传值
    type: Boolean,
    default: false
  },
  allowCreate: {
    type: Boolean,
    default: false //查不到数据时不清空输入框的值
  },
  codeKey: {
    type: String,
    default: 'sysUserId'
  },
  nameKey: {
    //用户类型
    type: String,
    default: 'userNameCn'
  }
})
const selectVal = ref()
watch(
  () => props.modelValue,
  (newVal) => {
    selectVal.value = newVal || ''
  },
  { immediate: true }
)
const autoCompleteConfig = ref({
  url: '/jhj-base-management/sysUser/queryAssociate', // 后台请求接口
  multiple: props.isMuptiple, // 是否多选
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
  codeKey: props.codeKey, // 'sysUserId', // 控件编码值
  nameKey: props.nameKey //'userNameCn' // input显示填充字段值设置
})
watch(
  () => props.codeKey,
  (newVal) => {
    autoCompleteConfig.value.codeKey = newVal || ''
  },
  { immediate: true }
)
watch(
  () => props.nameKey,
  (newVal) => {
    autoCompleteConfig.value.nameKey = newVal || ''
  },
  { immediate: true }
)
const userSearchColumns = ref({
  keyword: null,
  userType: props.userType,
  isActive: props.isEdit === true ? 1 : null
})
const emit = defineEmits(['getSelectVal'])
function getSelectItem(item = {}) {
  emit('getSelectVal', item)
}
function getCreateVal(val) {
  emit('getCreateVal', val)
}
function clearSelectValue() {
  proxy.$refs.userRef.clearSelectValue()
}
defineExpose({ clearSelectValue })
</script>

<style lang="scss" scoped></style>
