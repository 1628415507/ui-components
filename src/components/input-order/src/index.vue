<!--
 * @Description: 
 * @Date: 2024-05-30 14:35:14
 * @LastEditTime: 2025-05-10 17:52:11
-->
<template>
  <el-input
    v-bind="$attrs"
    v-model="inputVal"
    clearable
    :placeholder="placeholder"
    :maxlength="maxlength"
    @input="formatVal"
    @change="handleChange"
    @clear="handleClear"
  ></el-input>
</template>
<script setup lang="ts">
defineOptions({
  name: 'ZInputOrder'
})
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number]
  },
  validate: {
    type: Boolean, // 是否符合要求
    default: false
  },
  placeholder: {
    type: String,
    default: ' '
  },
  maxlength: {
    type: Number, //最大长度
    default: 13
  }
})

const inputVal = ref('')
const isError = ref(false)

const emits = defineEmits(['validate', 'change', 'enter', 'update:modelValue'])

watch(
  () => props.modelValue,
  (val) => {
    formatVal(val)
  }
)

const handleValid = (val) => {
  if (val && val.length < 13) {
    isError.value = true
    return true
  }
  isError.value = false
  return false
}
// 组装数据格式
const formatVal = (value) => {
  if (value && typeof value === 'string') {
    value = value.replace(/\D/g, '') // 只能输入数字
    // 前3位后补上-
    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3)
    }
    // 第8位补上空格
    if (value.length > 8) {
      value = value.slice(0, 8) + ' ' + value.slice(8)
    }
    inputVal.value = value.slice(0, 13)
  } else {
    inputVal.value = ''
  }
  const isValid = !handleValid(inputVal.value)
  emits('update:validate', isValid)
  //   emits('validate', isValid)
  emits('update:modelValue', inputVal.value)
}

const handleChange = (val) => {
  inputVal.value = val
  // emits('update:modelValue', inputVal.value)
  emits('change', inputVal.value)
}

// 清空
const handleClear = () => {
  inputVal.value = ''
  emits('update:modelValue', '')
}
const init = () => {
  formatVal(props.modelValue)
}
init()
</script>
<style lang="scss" scoped></style>
