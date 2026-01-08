<template>
  <div>
    <z-info-card>
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px">
          <el-icon><InfoFilled /></el-icon>
          <span>自定义标题内容</span>
          <el-tag size="small" type="success">新</el-tag>
        </div>
      </template>
      使用 header 插槽可以完全自定义标题区域的内容和样式
    </z-info-card>
  </div>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
</script>
