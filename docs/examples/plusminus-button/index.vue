<template>
  <div>
    <div v-for="(item, index) in list" :key="item.key" :index="index">
      <z-plusminus-button
        :list="list"
        :index="index"
        @add="handleAdd"
        @remove="handleRemove(index)"
      ></z-plusminus-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// import {  ZPlusminusButton } from '../../../src/index.ts'
import { Ref, ref } from 'vue'
const list = ref([{ key: Math.random() }])
function handleAdd() {
  list.value.push({ key: Math.random() })
}
function handleRemove(index: number) {
  list.value.splice(index, 1)
}
</script>
