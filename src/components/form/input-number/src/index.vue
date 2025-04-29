<!--
 * @Description: 数字输入框
 * @Date: 2024-05-07 17:03:48
 * @LastEditTime: 2025-04-29 20:16:21
-->
<template>
  <el-input
    v-bind="$attrs"
    ref="inputRef"
    v-model.trim="inputVal"
    :maxlength="maxlength"
    :input-style="{ textAlign }"
    @input="inputControl"
    @focus="handleFocus"
    @blur="handleBlur"
    @change="handleChange"
    clearable
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
import BigNumber from 'bignumber.js'
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
    default: 2 // 精度(默认4位小数)
  },
  min: {
    type: Number
  },
  // 最大值
  max: {
    type: Number
  },
  maxlength: {
    type: Number
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
    default: 'right'
  },
  // 是否默认分隔 如千分位
  useGrouping: {
    type: Boolean,
    default: true
  },
  // 是否移除小数点末尾的0,如:1.00->1
  removeTrailingZeros: {
    type: Boolean,
    default: false
  }
})
// 1234567890123456789
const inputVal = ref('') // this.value || '' // 选择的值
const inputRef = ref()
watch(
  () => props.modelValue,
  (newVal) => {
    formatInputVal(newVal)
  },
  { immediate: true }
)

// 判断是否是有效数值
function isValue(val) {
  return val || val == '0'
}
//  发送数据
function emitModelValue(str) {
  let value = formatToNum(str)
  if (props.removeTrailingZeros) {
    value = removeTrailingZeros(value) //formattedNumber
  }
  console.log('【 emitModelValue 】-118', value)
  emit('update:modelValue', value)
}

// 【转成数值】
function formatToNum(val) {
  if (val && val != 0) {
    let num = val?.toString()?.replace(/,/g, '')
    return num
  } else {
    return ''
  }
}
// 【转成千分位】
function formatToCurrency(num) {
  if (!isValue(num)) return ''
  // 处理非数值输入
  if (isNaN(num) || num === null) return 'Invalid Number'
  // 分离符号、整数和小数部分
  const numStr = String(num).trim()
  const hasNegative = numStr?.startsWith('-')
  const absoluteStr = numStr?.replace('-', '')
  const [integerPart, decimalPart] = absoluteStr.split('.')
  // 处理整数部分千分位
  const formattedInteger =
    integerPart
      .split('')
      .reverse()
      .join('')
      .replace(/(\d{3})(?=\d)/g, '$1,')
      .split('')
      .reverse()
      .join('')
      .replace(/^,/, '') || '0'
  // 组合最终结果
  const res = `${hasNegative ? '-' : ''}${formattedInteger}${decimalPart ? `.${decimalPart}` : ''}`
  return res
}
// 【去除小数末尾的0】
function removeTrailingZeros(num) {
  const res = num.toString().replace(/(.[0-9]*[1-9])0+$|.0+$/, '$1')
  return res
}
function formatInputVal(val) {
  console.log('【 val 】-162', val)
  inputVal.value = val
  if (!isValue(val)) {
    inputVal.value = ''
  }
  // 转成千分位
  if (props.useGrouping) {
    inputVal.value = formatToCurrency(inputVal.value) //formattedNumber
  }
  // 去除小数末尾的0
  if (props.removeTrailingZeros) {
    inputVal.value = removeTrailingZeros(inputVal.value) //formattedNumber
  }
}
function handleChange(value) {
  console.log('【 handleChange 】-174', value)
  const { min, max, precision, removeTrailingZeros } = props
  let num = value
  if (isValue(num)) {
    // 最小值
    if (num < min) {
      num = min
    }
    // 最大值
    if (num > max) {
      num = max
    }
    // 小数位补0
    if (precision && !removeTrailingZeros) {
      let largeNumber = new BigNumber(num)
      num = largeNumber.toFixed(precision) // 使用BigNumber的toFixed方法
      console.log('【largeNumber】-195', num)
    }
  }

  formatInputVal(num)
  emitModelValue(num)
  emit('change', num)
}
// 聚焦时，将千分位转成数值
function handleFocus(e) {
  // console.log('【 handleFocus 】-175', props.modelValue)
  inputVal.value = props.modelValue
  if (props.useGrouping) {
    inputVal.value = formatToNum(inputVal.value)
  }
  if (props.removeTrailingZeros) {
    inputVal.value = removeTrailingZeros(inputVal.value) //formattedNumber
  }
}
function handleBlur(e) {
  const val = e.target.value
  const value = formatToNum(val)
  handleChange(value)
}
// 【限制输入内容】
function inputControl(val) {
  let value = val || val === 0 ? val.toString() : ''
  const precision = props.precision
  // 整数
  if (precision === 0) {
    value = value.replace(/[^\d]/g, '') // .slice(0, 5)
  } else {
    // 浮点数
    const precisionArr = new Array(precision).fill('\\d')
    const precisionStr = precisionArr.join('')
    const reg = new RegExp(`^(\\-)*(\\d+)\\.(${precisionStr}).*$`)
    value = value
      .replace(/[^\d.-]/g, '') // 将非数字和点、符号以外的字符替换成空
      .replace(/(?!^)-/g, '') //限制负数只能出现在首位
      .replace(/-{2,}/g, '-')
      .replace(/^\./g, '') // 限制第一个字符是数字而不是点
      .replace(/\.{2,}/g, '.') // 出现多个点时只保留第一个
      // // .replace(/\-{2,}/g, '') // 出现多个负号时只保留第一个
      // .replace('.', '$#$') // 1、将数字的点替换成复杂字符$#$
      // .replace(/\./g, '') // 2、将字符串的点直接清掉
      // .replace('$#$', '.') // 3、将复杂字符再转换回点
      .replace(reg, '$1$2.$3') // 只能输入6(precision)个小数
    // .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
  }

  // 控制如果没有小数点，首位不能为类似于 01、02
  if ((value.indexOf('.') < 0 && value !== '') || (value.indexOf('.') > 1 && value[0] === '0')) {
    if (value != '-') {
    }
  }
  inputVal.value = value.toString()
  console.log('【  inputVal.value 】-249', inputVal.value)
  // console.log('【 inputControl 】-240', inputVal.value)
}
onMounted(() => {})
</script>
