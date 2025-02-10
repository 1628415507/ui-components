<!--
 * @Description: 
 * @Date: 2024-11-04 11:08:49
 * @LastEditTime: 2025-01-06 17:27:40
-->
<template>
  <el-button @click="toJson">toJSON</el-button>
  <el-button @click="toJsonStringify()">stringify</el-button>
</template>
<script setup>
import { ref } from 'vue'
function toJson() {
  const obj = {
    name: 'Example',
    date: new Date(),
    toJSON: function () {
      return {
        name: this.name,
        date: this.date.toISOString() // 将日期转换为 ISO 字符串
      }
    }
  }

  const jsonString = JSON.stringify(obj)
  console.log(jsonString) // 输出: {"name":"Example","date":"2024-11-21T00:52:34.567Z"}
}
function toJsonStringify() {
  const obj = {
    name: 'Example',
    symbolKey: Symbol('aa'), //Symbol会被忽略或转换为 null
    undefinedKey: undefined, //undefined 在对象属性中会被忽略，在数组中会被转换为 null
    func: () => {}, //函数会被忽略或转换为 null
    // objKey: obj.name, // 循环引用： 会导致抛出 TypeError 异常
    // bigIntKey: BigInt(9999), //会导致报错
    date: new Date() //会被转换为字符串，而不是日期对象本身
  }

  const jsonString = JSON.stringify(obj)
  console.log(jsonString) // 输出: {"name":"Example","date":"2024-11-21T00:52:34.567Z"}
}
</script>

<style scoped></style>
