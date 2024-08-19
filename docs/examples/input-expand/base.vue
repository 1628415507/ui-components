<template>
  <div>
    输入框和文本域绑定一个值
    <z-input-expand v-model="inputVal" title="弹窗标题" label="弹窗标签" @confirm="getTextareaVal"></z-input-expand>
    <br />
    输入框和文本域绑定不同值
    <z-input-expand v-model="inputVal2" v-model:textarea="textareaVal" :independent="true"></z-input-expand>
  </div>
</template>
<script setup lang="ts">
// import {  ZInputExpand } from '../../../src/index.ts'//按需引入
import { Ref, ref } from 'vue'
const inputVal: Ref<string> = ref('')

const inputVal2: Ref<string> = ref('')
const textareaVal: Ref<string> = ref('')
// 方法
function getTextareaVal(val: string) {
  console.log('【 getTextareaVal 】-17', val)
}
</script>
