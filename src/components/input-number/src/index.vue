<!--
 * @Description: 数字输入框
 * @Date: 2024-05-07 17:03:48
 * @LastEditTime: 2025-05-12 16:51:14
-->
<template>
  <el-input
    v-bind="$attrs"
    ref="inputRef"
    v-model.trim="inputVal"
    :maxlength="maxlength"
    :inputStyle="{ textAlign }"
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

<script setup lang="ts">
defineOptions({
  name: 'ZInputNumber'
})
// import  { InputNumberEmits,InputNumberProps } from './type.ts' //引入类型定义-外部引入打包会报错
import BigNumber from 'bignumber.js'
import { onMounted, computed, watch, ref, defineEmits, defineProps } from 'vue'

type InputNumberEmits = {
  'update:modelValue': [value: string]
  // 'change': [value: function];
}
interface InputNumberProps {
  modelValue: string | number
  precision: number
  min?: number
  max?: number
  maxlength?: number
  width?: string
  prefix?: string // 自定义头部内容
  suffix?: string // 自定义尾部内容
  prepend?: string // 前缀
  append?: string // 后缀
  slotAppend?: boolean
  textAlign?: string
  useGrouping?: boolean // 是否默认分隔 如千分位
  zeroFill?: boolean //是否小数位自动补0
  disabled?: boolean
}

const emit = defineEmits<InputNumberEmits>()

const props = withDefaults(defineProps<InputNumberProps>(), {
  modelValue: '',
  precision: 2, // 精度(默认2位小数)
  width: '100%',
  textAlign: 'right',
  useGrouping: true, // 是否默认分隔 如千分位
  zeroFill: true //是否小数位自动补0
})

// 1234567890123456789
let isFocus: boolean = false //判断当前是否聚焦
const inputVal = ref('') // this.value || '' // 选择的值
const inputRef = ref()
const oldVal = ref('')
const precision: number = Number(props.precision || 0)
watch(
  () => props.modelValue,
  (newVal) => {
    oldVal.value = newVal
    !isFocus && handleChange(props.modelValue, { isEmit: false })
  },
  { immediate: true }
)
// 整数位的最大长度
const integerLength = computed(() => {
  return Number(props.maxlength) - precision - (precision > 0 ? 1 : 0)
})
// 判断是否是有效数值
function isValue(val) {
  return val || val == '0'
}
//  发送数据
function emitModelValue(str: string, type: string) {
  let value = formatToNum(str)
  if (!props.zeroFill) {
    value = removeTrailingZeros(value) //formattedNumber
  }
  emit('update:modelValue', value)
  if (type == 'change') {
    emit('change', value)
  }
}

// 【转成数值】
function formatToNum(val) {
  if (isValue(val)) {
    let num = val?.toString()?.replace(/,/g, '')
    return num
  } else {
    return null
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
  return num == null ? num : num.toString().replace(/(.[0-9]*[1-9])0+$|.0+$/, '$1')
}
function formatInputVal(val) {
  inputVal.value = val
  if (!isValue(val)) {
    inputVal.value = ''
  }
  // 转成千分位
  if (props.useGrouping) {
    inputVal.value = formatToCurrency(val) //formattedNumber
  }
  // 去除小数末尾的0
  if (!props.zeroFill) {
    inputVal.value = removeTrailingZeros(val) //formattedNumber
  }
}
function handleChange(value, config = {}) {
  const { isEmit = true } = config
  const { min, max, zeroFill } = props
  let num = formatToNum(value)
  if (isValue(num)) {
    // 最小值
    if (num < Number(min)) {
      num = Number(min)
    }
    // 最大值
    if (num > Number(max)) {
      num = Number(max)
    }
    // 小数位补0
    if ((precision && zeroFill) || precision == 0) {
      let largeNumber = new BigNumber(num)
      num = largeNumber.toFixed(precision) // 使用BigNumber的toFixed方法
    }
  }

  formatInputVal(num)
  isEmit && emitModelValue(num, 'change')
}
// 聚焦时，将千分位转成数值
function handleFocus(e) {
  isFocus = true
  // console.log('【 handleFocus 】-175', props.modelValue)
  inputVal.value = props.modelValue
  if (props.useGrouping) {
    inputVal.value = formatToNum(inputVal.value)
  }
  if (!props.zeroFill) {
    inputVal.value = removeTrailingZeros(inputVal.value) //formattedNumber
  }
}
function handleBlur(e) {
  isFocus = false
  handleChange(inputVal.value, { isEmit: false })
}
// 【限制输入内容】
function inputControl(val) {
  const { min, max } = props
  let value = val || val === 0 ? val.toString() : ''
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
    // if (value != '-') {
    // }
  }
  const maxStr = max?.toString()
  const hasDecimal = maxStr?.includes('.') //最大值存在小数
  if (isValue(value)) {
    // 最小值处理
    if (value < Number(min)) {
      value = Number(min)
    }
    // 最大值处理
    if (value > Number(max)) {
      //如果存在小数位 列如最大值是999.99 输入9999 最后结果应该要是999.9
      if (hasDecimal) {
        const [integerPart] = maxStr.split('.')
        const maxIntegerDigits = integerPart.length
        let strValue = value.toString()
        // 如果输入值没有小数点，就插入小数点
        if (!strValue.includes('.')) {
          strValue = strValue.slice(0, maxIntegerDigits) + '.' + strValue.slice(maxIntegerDigits)
        }
        const maxLength = maxStr.length
        if (strValue.length > maxLength) {
          strValue = strValue.slice(0, maxLength)
        }
        const numValue = parseFloat(strValue)
        value = numValue > max ? max : numValue
      } else {
        value = Number(max)
      }
    }
  }
  inputVal.value = value.toString()
  // 控制整数长度
  let [integerPart, decimalPart] = inputVal.value.split('.')
  // 则整数部分最多intLength位,且还没有的小数点的时候，自动加小数点
  if (integerPart.length > integerLength.value && !decimalPart?.length && value.indexOf('.') < 0) {
    const intPart = integerPart.substring(0, integerLength.value)
    const newDecimalPart = integerPart.substring(integerLength.value)
    const newValue = intPart + '.' + newDecimalPart
    inputVal.value = newValue
    //console.log('【自动加小数点 】-253',newValue,intPart,newDecimalPart);
  }
  emit('update:modelValue', formatToNum(inputVal.value))
  emit('input', inputVal.value)
  // console.log('【 inputControl 】-240', inputVal.value)
}
onMounted(() => {
  setTimeout(() => {
    handleChange(props.modelValue, { isEmit: false })
  })
})
</script>
