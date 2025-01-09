<!--
 * @Description: https://juejin.cn/post/6844903698166988808#heading-1
 * @Date: 2024-11-04 11:08:49
 * @LastEditTime: 2025-01-06 17:27:40
-->
<template>
  <el-button @click="run">defineProperty</el-button>
  <el-button @click="definePropertySet">数据劫持-设置</el-button>
  <el-button @click="definePropertyGet">数据劫持-获取</el-button>
</template>
<script setup>
import { ref } from 'vue'

function run() {
  let obj = {
    age: '18'
  }
  Object.defineProperty(obj, 'name', {
    value: 'red'
  })
  Object.defineProperty(obj, 'age', {
    value: '20'
  })
  console.log('【 obj 】-13', obj)
}
let modeng = {}
let age
// 数据劫持
Object.defineProperty(modeng, 'age', {
  get: function () {
    console.log('触发get')
    return age
  },
  set: function (newVal) {
    console.log('触发set')
    age = newVal
  }
})
// 数据劫持-设置
function definePropertySet() {
  modeng.age = 18
}
// 数据劫持-获取
function definePropertyGet() {
  age = modeng.age
}
</script>

<style scoped></style>
