<!--
 * @Description: 前端⽇志埋点 SDK 设计思路：https://zhuanlan.zhihu.com/p/497413927
 * @Date: 2024-08-23 16:49:49
 * @LastEditTime: 2024-09-24 13:26:09
-->
<template>
  <div>
    <el-button @click="handleClick">⽤⼾⾏为与⽇志上报</el-button>
    <el-button @click="handleError">运行时错误上报</el-button>
    <!-- <el-button @click="handlePromiseError">Promise错误上报</el-button> -->
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import StatisticSDK from './StatisticSDK'
// ⽤⼾⾏为与⽇志上报
function handleClick() {
  window.insSDK.event('click', { remark: '点击了按钮' })
}
// 运行时错误上报
function handleError() {
  console.log('【 aa 】-24', aa) //模拟代码错误
}

function handlePromiseError() {
  // Promise错误上报
  function promiseMock() {
    return new Promise((resolve, reject) => {
      reject('promise error')
    })
  }
  // promiseMock().catch((err) => {
  //   console.log('【 promiseMock 】-32', err)
  //   // window.insSDK.error(err)
  // })
}
onMounted(() => {
  window.insSDK = new StatisticSDK('sdk-12345') //初始化
})
</script>
