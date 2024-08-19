<template>
  <div>
    <z-input-expand  type="order"  v-model="inputVal" v-model:textarea="textareaVal"></z-input-expand>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue'
const inputVal: Ref<string> = ref('')
const textareaVal: Ref<string> = ref('')
</script>
