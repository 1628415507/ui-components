<template>
  <div>
    <z-info-card header="自动展开收缩" :collapsible="true">
      <div style="padding: 20px">
        <p>点击标题右侧的箭头图标可以展开/收缩内容区域。</p>
        <p>
          通过
          <code>expand-change</code>
          事件监听展开/收缩状态变化。
        </p>
      </div>
    </z-info-card>
    <hr />
    <el-button @click="isExpanded = !isExpanded">{{ isExpanded ? '收缩' : '展开' }}卡片</el-button>
    <z-info-card header="手动控制收缩" :expand="isExpanded" @expand-change="handleExpandChange">
      <div style="padding: 20px">
        <p>
          当前状态：
          <strong>{{ isExpanded ? '展开' : '收缩' }}</strong>
        </p>
        <p>
          通过
          <code>expand</code>
          属性控制默认展开状态。
        </p>
        <p>
          通过
          <code>expand-change</code>
          事件监听展开/收缩状态变化。
        </p>
      </div>
    </z-info-card>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const isExpanded = ref(true)

const handleExpandChange = (expanded: boolean) => {
  console.log('展开状态变化:', expanded)
}
</script>
