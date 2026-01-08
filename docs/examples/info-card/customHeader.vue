<template>
  <z-info-card>
    <template #header>
      <div style="display: flex; align-items: center; gap: 10px">
        <el-icon><InfoFilled /></el-icon>
        <span>自定义标题内容</span>
        <el-tag size="small" type="success">NEW</el-tag>
      </div>
    </template>
    <div style="padding: 20px">
      <p>
        通过
        <code>header</code>
        插槽可以自定义标题内容。
      </p>
      <p>可以在标题中添加图标、标签等自定义元素。</p>
    </div>
  </z-info-card>
</template>
<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
</script>
