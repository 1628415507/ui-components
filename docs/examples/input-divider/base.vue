<template>
  <div>
    默认
    <z-input-divider v-model="inputVal"></z-input-divider>
    小写自动转大写
    <z-input-divider v-model="inputVal2" :uppercase="true"></z-input-divider>
    限制只能输入半角字符
    <z-input-divider v-model="inputVal3" :limitHalfWidth="true"></z-input-divider>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue'
const inputVal: Ref<string> = ref('ABCDEABCDEABCDEABCDEABCDEABCDEABCDE')
const inputVal2: Ref<string> = ref('')
const inputVal3: Ref<string> = ref('')
</script>
