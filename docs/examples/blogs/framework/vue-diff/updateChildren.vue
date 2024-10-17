<!--
 * @Description: 
 * @Date: 2024-10-15 14:18:09
 * @LastEditTime: 2024-10-17 16:48:46
-->
<template>
  <div>
    <el-button @click="handleReset">还原</el-button>
    <el-button @click="handleDiff">非同一节点Diff</el-button>
    <div class="flex-sb">
      <table>
        <tr>
          <td>h1</td>
          <td>h3</td>
        </tr>
        <tr>
          <td>h2</td>
          <td>h4</td>
        </tr>
        <tr>
          <td>h3</td>
          <td>h5</td>
        </tr>
        <tr>
          <td>h4</td>
          <td>h6</td>
        </tr>
      </table>
      <div id="container">container</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import h from './diff/h'
import patch from './diff/patch'
const vNode3 = h('ul', {}, [h('h1', {}, 'A'), h('h2', {}, 'B'), h('h3', {}, 'C'), h('h4', {}, 'D')])
const vNode4 = h('ul', {}, [h('h3', {}, 'C'), h('h4', {}, 'D'), h('h5', {}, 'M'), h('h6', {}, 'E')])

onMounted(() => {})
function handleReset() {
}
function handleDiff() {
  let container = document.getElementById('container')
  patch(container, vNode3) //挂载到dom
  patch(vNode3, vNode4) // 非同一节点
}
</script>
<style lang="scss" scoped></style>
