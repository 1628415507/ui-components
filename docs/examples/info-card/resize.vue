<template>
  <div>
    <el-radio-group v-model="resizeType" style="margin-bottom: 20px">
      <el-radio-button label="vertical">vertical</el-radio-button>
      <el-radio-button label="horizontal">horizontal</el-radio-button>
      <el-radio-button label="both">both</el-radio-button>
      <el-radio-button label="none">none</el-radio-button>
    </el-radio-group>
    <z-info-card 
      header="可调整大小的信息卡片" 
      :resizable="true" 
      :resize-type="resizeType"
    >
      <div style="padding: 20px;">
        <p>当前调整方向：<strong>{{ description[resizeType] }}</strong></p>
        <p>拖拽卡片边缘可以调整大小（当 resize-type 不为 none 时）。</p>
        <ul>
          <li>vertical: 只能垂直调整</li>
          <li>horizontal: 只能水平调整</li>
          <li>both: 可以垂直和水平调整</li>
          <li>none: 不可调整</li>
        </ul>
      </div>
    </z-info-card>
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref } from 'vue'

const resizeType: Ref<string> = ref('vertical')
const description = ref({
  vertical: '竖向调整',
  horizontal: '横向调整',
  both: '横竖向调整',
  none: '不可调整'
})
</script>
