<!--
 * @Description: 
 * @Date: 2024-08-19 11:19:22
 * @LastEditTime: 2025-05-10 17:17:17
-->
<template>
  <div>
    <z-input-number ref="inputRef" v-model="inputVal"></z-input-number>
  </div>
</template>
<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import type { InputNumberInstance } from '../../../src/index.ts'
const inputRef = ref<InputNumberInstance>()
onMounted(() => {
  console.log('【 inputRef 】-16', inputRef.value)
})
const inputVal: Ref<string> = ref('')
</script>
