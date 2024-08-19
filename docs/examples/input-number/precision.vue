<template>
  <div>
    整数
    <z-input-number v-model="inputVal" :precision="0"></z-input-number>
    <br />
    6位小数
    <z-input-number v-model="inputVal2" :precision="6"></z-input-number>
    <br />
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue'
const inputVal: Ref<string> = ref()
const inputVal2: Ref<string> = ref()
</script>
