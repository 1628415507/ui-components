<!--
 * @Description: 
 * @Date: 2024-11-04 11:08:49
 * @LastEditTime: 2025-01-06 17:27:40
-->
<template>
  <el-button @click="runDeepClone()">deepClone</el-button>
</template>
<script setup>
import { deepClone } from './deepCloneUtil'
const obj1 = {}
const obj = {
  id: 1,
  code: 'AA',
  name: 'Example',
  symbolKey: Symbol('aa'), //Symbol会被忽略或转换为 null
  undefinedKey: undefined, //undefined 在对象属性中会被忽略，在数组中会被转换为 null
  func: () => {}, //函数会被忽略或转换为 null
  // bigIntKey: BigInt(9999), //会导致报错？？？
  // 正则表达式： 会被转换为空对象 {}
  date: new Date() //会被转换为字符串，而不是日期对象本身
}
obj.else = obj1 //obj和obj2循环引用
obj1.else = obj //obj和obj2循环引用

function runDeepClone() {
  // 测试对象
  let objShadow = obj //浅拷贝
  let objClone = deepClone(obj) //深拷贝
  console.log('obj === objClone', obj === objClone, obj, objClone) //false
  objClone.id = 2 // 不会会影响原对象obj
  objShadow.code = 'BB' // 会影响原对象obj
  console.log('obj.id === objClone.id', obj.id === objClone.id) //false
  console.log('obj.name === objClone.name', obj.name === objClone.name) //true
}
</script>

<style scoped></style>
