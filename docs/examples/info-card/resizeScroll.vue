<template>
  <div class="scroll-selector">
    <z-info-card header="标题" :resizable="true" scrollSelector=".scroll-selector">
     我会根据高度滚动
    </z-info-card>
  </div>
</template>
<script lang="ts" setup>
</script>
<style>
.scroll-selector {
  height: 300px;
  overflow: auto;
}
</style>
