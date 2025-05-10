<!--
 * @Description: 
 * @Date: 2024-08-19 11:19:22
 * @LastEditTime: 2025-05-10 13:57:30
-->
<template>
  <div>
    <z-input-number ref="inputRef" v-model="inputVal"></z-input-number>
  </div>
</template>
<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
const inputRef = ref()
onMounted(() => {
  console.log('【 inputRef 】-16', inputRef.value)
})
const inputVal: Ref<string> = ref('')
</script>
