<template>
  <div class="scroll-selector">
    <z-info-card 
      header="滚动容器联动" 
      :resizable="true" 
      scroll-selector=".scroll-selector"
    >
      <div style="padding: 20px;">
        <p>当信息框处于滚动容器中时，调整信息框高度会自动滚动容器。</p>
        <p>通过设置 <code>scroll-selector</code> 属性指定滚动容器。</p>
        <p>向下拖拽卡片底部边缘，可以看到容器会自动滚动。</p>
        <div style="height: 500px; background: #f0f0f0; padding: 20px; margin-top: 20px;">
          <p>这是额外的内容区域，用于演示滚动效果。</p>
        </div>
      </div>
    </z-info-card>
  </div>
</template>
<script lang="ts" setup>
</script>
<style scoped>
.scroll-selector {
  height: 300px;
  overflow: auto;
  border: 1px solid #dcdfe6;
  padding: 10px;
}
</style>
