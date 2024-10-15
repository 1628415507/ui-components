<!--
 * @Description: 
 * @Date: 2024-10-15 14:18:09
 * @LastEditTime: 2024-10-15 16:43:19
-->
<template>
  <div>
    <el-button @click="handlePatch">非同一节点Diff</el-button>
    <div id="container">container</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import h from './diff/h'
import patch from './diff/patch'
const vNode1 = h('h1', {}, '你好') //创建虚拟节点
onMounted(() => {
  let container = document.getElementById('container')
  console.log('【 container 】-20', container)
  patch(container, vNode1) //比较虚拟节点
})
// 上树
const vNode2 = h('ul', {}, [h('li', {}, 'A'), h('li', {}, 'B'), h('li', {}, 'C'), h('li', {}, 'D')])
function handlePatch() {
  patch(vNode1, vNode2) // 非同一节点
}
</script>
<style lang="scss" scoped></style>
