<!--
 * @Description: 35字符分割线输入框
 * @Date: 2024-03-28 15:08:57
 * @LastEditTime: 2024-08-19 09:10:46
-->
<template>
  <el-input
    v-model="inputVal"
    v-bind="$attrs"
    :type="type"
    @change="handleChange"
    @blur="handleChange(inputVal)"
    :class="{ divider: showDivider }"
  ></el-input>
</template>
<script setup lang="ts">
import { computed, defineEmits, defineProps, defineExpose } from 'vue'
// import type { InputDividerEmits } from './type.ts'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'textarea'
  },
  uppercase: {
    type: Boolean, //英文自动转大写，默认true
    default: false
  },
  limitHalfWidth: {
    type: Boolean, // 只能输入半角字符，默认true
    default: true
  },
  showDivider: {
    type: Boolean, // 是否显示分割线，默认true
    default: true
  }
})
const { uppercase, limitHalfWidth } = props
const n = 35
// const emits = defineEmits<InputDividerEmits>()
const emits = defineEmits(['update:modelValue'])
const inputVal = computed({
  get() {
    emits('update:modelValue', formatInputValue(props.modelValue))
    return formatInputValue(props.modelValue) //同步外部v-model的值
    // return getVal?.replace(/\s*/g, '').trim() || ''
  },
  set(val) {
    emits('update:modelValue', formatInputValue(val))
    // emits('update:modelValue', setVal?.replace(/\s*/g, '') || '')
  }
})
function handleChange(val) {
  let splitArr = val?.split(/[\n]/) || [] // 根据换行符分割字符串
  let newList = splitArr.map((item) => {
    return item?.replace(/\s{2,}/g, ' ') || '' //多个空格替换成一个空格
  })
  inputVal.value = newList.join('\n')
  // console.log('【 newList 】-34', newList, inputVal.value)
}
function formatInputValue(val) {
  let newVal = val
  // console.log('【 uppercase, limitHalfWidth 】-39', uppercase, limitHalfWidth)
  newVal = newVal?.replace(/[\\]/g, '') || '' //禁止输入反斜杠
  if (uppercase) {
    newVal = newVal ? newVal.toUpperCase() : ''
    // console.log('【 uppercase-newVal 】-43', newVal)
  }
  if (limitHalfWidth) {
    // 全角字符，指一个字符占用两个标准字符位置，
    // 汉字字符和规定了全角的英文字符及国标GB2312-80中的图形符号和特殊字符都是全角字符
    newVal = newVal?.replace(/[^\x00-\xff]/g, '') || ''
    // console.log('【 limitHalfWidth-newVal 】-43', newVal)
  }
  return newVal || ''
}
function splitWord(str: string) {
  const result: string[] = []
  for (let i = 0; i < str.length; i += n) {
    result.push(str.substring(i, i + n))
  }
  return result
}
// A ABCDEABCDEABCDEABCDEABCDEABCDEABCDE 11 22
// 将字符串按35字符进行拆分（包含空格的长度），未超过35字符的单词不进行拆分
function splitRow(rowVal: string = '') {
  if (rowVal.length <= n) {
    return [rowVal]
  }
  let rowWords = rowVal?.split(/[\s]/) // 根据空格进行分割
  let arr: string[] = []
  let rowStr: string = '' //每行的字符串内容
  for (let i = 0; i < rowWords.length; i++) {
    let word = rowWords[i]
    const SPAN = i === 0 ? '' : ' ' //第一个单词不需要加空格
    let len = rowStr.length + SPAN.length + word.length //上一次拼接的长度+空格的长度+当前单词的长度
    // 如果拼上当前单词的长度小于35，继续拼接
    if (len < n) {
      rowStr = `${rowStr}${SPAN}${word}`
      if (i === rowWords.length - 1) {
        arr.push(rowStr)
      }
    } else {
      rowStr && arr.push(rowStr) //上一次拼接的长度
      // 处理下一个拼接
      if (word.length >= n) {
        let splitWords = splitWord(word) // 对超过35的单词进行二次分割
        let words
        if (splitWords.length > 1) {
          words = splitWords.splice(0, splitWords.length - 1) //排除最后一个
          rowStr = splitWords[splitWords.length - 1] || ''
        } else {
          words = splitWords
          rowStr = ''
        }
        arr.push(...words)
      } else {
        rowStr = word //未超过35移到下一行拼接
      }
      if (rowStr && i === rowWords.length - 1) {
        arr.push(rowStr)
      }
    }
  }
  return arr
}

// 拆分字符串
// ABCDEABCDEABCDEABCDEABCDEABCDEABCDE ：35字符分割线的位置
const splitText = () => {
  const textareaVal = inputVal.value
  let rowList = textareaVal?.split(/[\n]/) // 根据换行符分割字符串
  // console.log('【 rowList 】-89', rowList)
  // .filter((item) => !!item) //去除空值
  // .map((item) => item.replace(/(\s*)$/g, '')) //去除字符串右侧的空格
  // .map((item) => item.trim()) //去除左右空格
  const newRowArr: string[] = []
  rowList.forEach((row: string) => {
    const newRows: string[] = splitRow(row)
    // console.log('【 newRows 】-134', newRows)
    newRowArr.push(...newRows)
  })
  console.log('【 newRowArr 】-172', newRowArr)
  const str = newRowArr.join('\n')
  inputVal.value = str
}
defineExpose({ splitText })
</script>

<style scoped lang="scss">
.el-textarea {
  position: relative;
  width: 100%;
  &:not(.is-disabled) {
    :deep(.el-textarea__inner) {
      background-color: transparent !important;
      z-index: 100 !important;
    }
  }
}
.el-textarea.divider {
  &:before {
    content: '';
    position: absolute;
    left: 290px;
    display: block;
    height: 100%;
    border: 1px solid #e3e3e3;
    width: 0;
    // background: red;
    z-index: 99;
  }
}
</style>
