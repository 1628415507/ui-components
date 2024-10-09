<!--
 * @Description: 清除浮动
 * @Date: 2024-10-09 16:28:17
 * @LastEditTime: 2024-10-09 17:36:31
-->
<template>
  <div style="min-height: 150px">
    <el-button @click="flag = !flag" class="mb-05">给父元素创建 BFC</el-button>
    <div class="par" :class="{ bfc: flag }">
      <div class="child"></div>
      <div class="child"></div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const flag = ref(false)
</script>
<style lang="scss" scoped>
.par {
  border: 5px solid var(--theme-color);
  width: 300px;
}

.child {
  border: 5px solid #ccc;
  width: 100px;
  height: 100px;
  float: left;
}
.bfc {
  overflow: hidden; //计算BFC的高度时，浮动元素也参与计算
}
</style>
