<!--
 * @Author: Hongzf
 * @Date: 2022-09-26 14:59:14
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-11-29 18:28:29
 * @Description:
-->
<template>
  <div>
    <el-input v-model="num"></el-input>
    <h2>计数器(store)</h2>
    <p @click="add">同步修改：{{ count }}</p>
    <p @click="asyncAdd">异步修改：{{ count }}</p>
    <p>计算属性getters：{{ double }}</p>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/store'
const num = ref()
const store = useStore()
// 从计算属性中获取vuex
// 使用state获取vuex中的值
const count = computed(() => {
  return store.state.test.count // count模块下的count字段
})
// 使用getters获取vuex中的值
const double = computed(() => {
  return store.getters.double
})
const color = ref('pink') // css中使用
// 同步
function add() {
  store.commit('add')
  color.value = Math.random() > 0.5 ? 'green' : 'pink'
}
// 异步
function asyncAdd() {
  store.dispatch('asyncAdd')
}
</script>
<style scoped>
p {
  color: v-bind(color);
}
</style>
