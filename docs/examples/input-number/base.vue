<template>
  <div>
    <z-input-number v-model="inputVal"></z-input-number>
    <br />
  </div>
</template>
<script setup lang="ts">
// import {  ZInputNumber } from '../../../src/index.ts'
import { Ref, ref } from 'vue'
const inputVal: Ref<string> = ref('')
</script>
