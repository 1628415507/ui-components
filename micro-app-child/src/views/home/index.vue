<!--
 * @Author: Hongzf
 * @Date: 2022-11-17 16:00:08
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 18:14:54
 * @Description:
-->

<template>
  <div>
    首页000
    <z-divider-input v-model="inputVal" type="textarea"></z-divider-input>
    <!-- <CodeNumber v-model="inputVal2" v-model:validate="validate"></CodeNumber> -->
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

import CodeNumber from '@/components/CodeNumber.vue'

const inputVal2 = ref('')
const validate = ref(false)

const inputVal = ref('')
watch(inputVal2, (val) => {
  console.log('【 inputVal2 】-25', val)
})
watch(validate, (val) => {
  console.log('【 validate 】-25', val)
})
function handleValidate() {}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
/* 
::v-deep .el-textarea.divider-input {
  position: relative;
  width: 100%;
  &:before {
    content: '';
    position: absolute;
    left: 255px;
    display: block;
    height: 100%;
    border: 1px solid #e3e3e3;
    width: 0;
    background: red;
    z-index: 9999;
  }
} */
</style>
