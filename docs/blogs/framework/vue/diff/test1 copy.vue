<!--
 * @Description: 
 * @Date: 2024-10-15 14:18:09
 * @LastEditTime: 2024-10-17 16:16:17
-->
<template>
  <div>
    <el-button @click="handlePatch">非同一节点Diff</el-button>
    <el-button @click="handlePatch2">非同一节点Diff</el-button>
    <div id="container">container</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import h from './code/h'
import patch from './code/patch'
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
function handlePatch2() {
  const vNode3 = h('ul', {}, [h('li', {}, 'A'), h('li', {}, 'B'), h('li', {}, 'C'), h('li', {}, 'D')])
  const vNode4 = h('ul', {}, [h('li', {}, 'D'), h('li', {}, 'D'), h('li', {}, 'M'), h('li', {}, 'E')])
  patch(vNode3, vNode4) // 非同一节点
}
</script>
<style lang="scss" scoped></style>
