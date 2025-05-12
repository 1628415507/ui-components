<template>
  <div>
    <z-input-order v-model="inputVal"></z-input-order>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue'
const inputVal: Ref<string> = ref('')
</script>
