<!--
 * @Description: 
 * @Date: 2024-11-04 11:08:49
 * @LastEditTime: 2025-01-06 17:27:40
-->
<template>
  <el-button @click="runGenerator()">runGenerator</el-button>
</template>
<script setup>
function* generator() {
  console.log('函数开始和a之间的运行')
  let a = yield 1
  console.log('a和b之间的执行', a) //99
  let b = yield a
  console.log('【 b 】-15', b)
}
let iteratorObj = generator()
function runGenerator() {
  const res = iteratorObj.next(99) //next（param）可以传参。通过参数去实时改变generate函数内的运行。这个参数，会变成上一个yield的值
  console.log('【 res 】-20', res)
  if (res.done == true) {
    console.log('【 执行完成 】-23')
  }
}
</script>

<style scoped></style>
