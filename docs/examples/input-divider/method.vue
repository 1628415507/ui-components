<template>
  <div>
    <el-button type="primary" class="mb-05" @click="handleSplice">分割字符串</el-button>
    <z-input-divider ref="inputRef" v-model="inputVal"></z-input-divider>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue'
const inputVal: Ref<string> = ref('ABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDEABCDE')
const inputRef: Ref= ref()

const handleSplice = () => {
  inputRef.value.splitText()
}
</script>
