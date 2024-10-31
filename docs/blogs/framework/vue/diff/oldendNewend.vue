<!--
 * @Description: 
 * @Date: 2024-10-15 14:18:09
 * @LastEditTime: 2024-10-17 17:42:22
-->
<template>
  <div>
    <!-- <el-button @click="handleReset">还原</el-button> -->
    <el-button @click="handleDiff">旧后与新后（尾尾对比）</el-button>
    <div class="flex-sb">
      <table>
        <tr>
          <td>旧</td>
          <td>新</td>
        </tr>
        <tr>
          <td>h1</td>
          <td>h55</td>
        </tr>
        <tr>
          <td>h2</td>
          <td>h22</td>
        </tr>
        <tr>
          <td>h3</td>
          <td>h33</td>
        </tr>
        <tr>
          <td class="start">h4</td>
          <td class="start">h44</td>
        </tr>
      </table>
      <div id="container">container</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import h from './code/h'
import patch from './code/patch'
const oldNodes = h('ul', {}, [h('h1', {}, 'h1'), h('h2', {}, 'h2'), h('h3', {}, 'h3'), h('h4', {}, 'h4')])
const newNodes = h('ul', {}, [h('h5', {}, 'h55'), h('h2', {}, 'h22'), h('h3', {}, 'h33'), h('h4', {}, 'h44')])

onMounted(() => {
  let container = document.getElementById('container')
  patch(container, oldNodes) //挂载到dom
})

function handleDiff() {
  patch(oldNodes, newNodes) // 非同一节点
}
</script>
<style lang="scss" scoped>
.start {
  color: var(--theme-color);
}
</style>
