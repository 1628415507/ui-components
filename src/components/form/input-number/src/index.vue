<!--
 * @Description: 数字输入框
 * @Date: 2024-05-07 17:03:48
 * @LastEditTime: 2024-07-30 16:43:01
-->
<template>
  <!-- 整数 -->
  <!-- oninput="value=value.replace(/\D/g,'').replace(/[^\d]/,'')" -->
  <el-input
    v-model.trim="inputVal"
    :input-style="{ textAlign }"
    v-bind="$attrs"
    :maxlength="maxlength"
    @input="filterNumberAndDot"
    @blur="handleBlur"
    @change="handleChange"
  >
    <template v-if="prefix" #prefix>{{ prefix }}</template>
    <template v-if="suffix" #suffix>{{ suffix }}</template>
    <template v-if="prepend" #prepend>{{ prepend }}</template>
    <template v-if="append || slotAppend" #append>
      <span v-if="append">{{ append }}</span>
      <slot v-if="slotAppend" name="slotAppend"></slot>
    </template>
  </el-input>
</template>
<script setup>
import { onMounted, computed, watch, ref, defineEmits, defineProps } from 'vue'
const emit = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
  modelValue: {
    type: [String, Number], // 传入的值
    default: '',
    require: true
  },
  precision: {
    type: Number,
    default: 4 // 精度(默认4位小数)
  },
  min: {
    type: Number,
    default: undefined // 最小值
  },
  max: {
    type: Number,
    default: 999999999.9999 // 最大值
  },
  maxlength: {
    type: Number,
    default: 14
  },
  width: {
    type: String, // 传入的值
    default: '100%'
  },
  // 自定义头部内容
  prefix: {
    type: String,
    default: ''
  },
  // 自定义尾部内容
  suffix: {
    type: String,
    default: ''
  },
  prepend: {
    type: String, // 前缀
    default: ''
  },
  append: {
    type: String, // 后缀
    default: ''
  },
  slotAppend: {
    type: Boolean, // 后缀
    default: false
  },
  // 文本对齐
  textAlign: {
    type: String,
    default: 'left'
  }
})
const inputVal = ref('') // this.value || '' // 选择的值
watch(
  () => props.modelValue,
  (newVal) => {
    inputVal.value = newVal
    filterNumberAndDot()
  },
  { immediate: true }
)
function handleChange(val) {
  emit('change', val)
}
// 判断是否是有效数值
function isValue(val) {
  return val || val == '0'
}
function handleBlur(val) {
  let value = inputVal.value || inputVal.value === 0 ? inputVal.value.toString() : ''
  const { min, max } = props
  if (isValue(value) && value < min) {
    value = min
  }
  if (isValue(value) && value > max) {
    value = max
  }
  emit('update:modelValue', isValue(value) ? parseFloat(value) : '')
}
function filterNumberAndDot() {
  let value = inputVal.value || inputVal.value === 0 ? inputVal.value.toString() : ''
  const precision = props.precision
  if (precision === 0) {
    // 整数
    value = value.replace(/[^\d]/g, '') // .slice(0, 5)
  } else {
    const precisionArr = new Array(precision).fill('\\d')
    const precisionStr = precisionArr.join('')
    const reg = new RegExp(`^(\\-)*(\\d+)\\.(${precisionStr}).*$`)
    value = value
      .replace(/[^\d.]/g, '') // 将非数字和点以外的字符替换成空
      .replace(/^\./g, '') // 验证第一个字符是数字而不是点
      .replace(/\.{2,}/g, '.') // 出现多个点时只保留第一个
      .replace('.', '$#$') // 1、将数字的点替换成复杂字符$#$
      .replace(/\./g, '') // 2、将字符串的点直接清掉
      .replace('$#$', '.') // 3、将复杂字符再转换回点
      .replace(reg, '$1$2.$3') // 只能输入6(precision)个小数
    //  .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
  }
  // 此处控制的是如果没有小数点，首位不能为类似于 01、02
  if ((value.indexOf('.') < 0 && value !== '') || (value.indexOf('.') > 1 && value[0] === '0')) {
    value = parseFloat(value)
  }
  inputVal.value = value.toString()
  emit('update:modelValue', isValue(value) ? parseFloat(value) : '')
}
onMounted(() => {
  inputVal.value = props.modelValue
})
</script>
