<!--
 * @Description: 阻止元素被浮动元素覆盖
 * @Date: 2024-10-09 16:28:17
 * @LastEditTime: 2024-10-10 15:46:46
-->
<template>
  <div>
    <el-button @click="flag = !flag" class="mb-05">给元素B创建 BFC</el-button>
    <div :class="{ bfc: flag }">
      <div class="aside">A(float)</div>
      <div class="main">B</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const flag = ref(false)
</script>
<style lang="scss" scoped>
.aside {
  width: 100px;
  height: 150px;
  float: left;
  background:var(--theme-color);
}

.main {
  height: 200px;
  background: var(--box-bg);
}
.bfc {
  .main {
    overflow: hidden;
  }
}
</style>
