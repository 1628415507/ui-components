<template>
  <div>
    <el-radio-group v-model="resizeType" style="margin-bottom: 20px">
      <el-radio-button label="vertical">vertical</el-radio-button>
      <el-radio-button label="horizontal">horizontal</el-radio-button>
      <el-radio-button label="both">both</el-radio-button>
      <el-radio-button label="none">none</el-radio-button>
    </el-radio-group>
    <z-info-card header="标题" :resizable="true" :resize-type="resizeType">
      {{ description[resizeType] }}
    </z-info-card>
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref, watch } from 'vue'

const resizeType: Ref = ref('vertical')
const description = ref({
  vertical: '竖向收缩',
  horizontal: '横向收缩',
  both: '横竖向收缩',
  none: '不可收缩'
})
</script>
