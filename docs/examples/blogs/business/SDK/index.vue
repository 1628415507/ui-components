<!--
 * @Description: 前端⽇志埋点 SDK 设计思路：https://zhuanlan.zhihu.com/p/497413927t
 * @Date: 2024-08-23 16:49:49
 * @LastEditTime: 2024-09-27 15:43:22
-->
<template>
  <div>
    <el-button @click="handleClick">⽤⼾⾏为与⽇志上报</el-button>
    <el-button @click="handleError">运行时错误上报</el-button>
    <!-- <el-button @click="handlePromiseError">Promise错误上报</el-button> -->
    <ErrorCapturedDemo></ErrorCapturedDemo>
  </div>
</template>
<script setup>
import { onMounted, onErrorCaptured } from 'vue'
import StatisticSDK from './StatisticSDK'
import ErrorCapturedDemo from './ErrorCapturedDemo.vue'

// 1.⽤⼾⾏为与⽇志上报
function handleClick() {
  window.insSDK.event('click', { remark: '点击了按钮' })
}

// 2.运行时错误上报
function handleError() {
  console.log('【 引用声明的变量： 】-24', aa) //模拟代码错误
}
// function handlePromiseError() {
//   // Promise错误上报
//   function promiseMock() {
//     return new Promise((resolve, reject) => {
//       reject('promise error')
//     })
//   }
//   // promiseMock().catch((err) => {
//   //   console.log('【 promiseMock 】-32', err)
//   //   // window.insSDK.error(err)
//   // })
// }
onMounted(() => {
  window.insSDK = new StatisticSDK('sdk-12345') //初始化
})
// 3.子组件渲染错误处理
onErrorCaptured((error, vm, info) => {
  console.error('【 子组件-渲染错误 】-47', error, vm, info)
  window.insSDK.error('error', { ...error, remark: '子组件-渲染错误' })
  return false
})
</script>
