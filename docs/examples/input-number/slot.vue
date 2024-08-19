<template>
  <div>
    <div>
      前缀图标prefix
      <z-input-number v-model="input1" placeholder="数值" prefix="￥"></z-input-number>
    </div>

    <div class="mt-4">
      后缀图标suffix
      <z-input-number v-model="input2" placeholder="数值" suffix="元"></z-input-number>
    </div>

    <div class="mt-4">
      后缀插槽append
      <z-input-number v-model="input3" placeholder="数值" :slotAppend="true">
        <template #slotAppend>
          <el-select v-model="select" placeholder="单位" style="width: 100px">
            <el-option label="厘米" value="1" />
            <el-option label="米" value="2" />
            <el-option label="千米" value="3" />
          </el-select>
        </template>
      </z-input-number>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const input1 = ref('')
const input2 = ref('')
const input3 = ref('')

const select = ref('')
</script>

<style></style>
