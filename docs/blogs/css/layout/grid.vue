<!--
 * @Description: 用 CSS 实现三角符号
 * @Date: 2024-10-10 15:33:28
 * @LastEditTime: 2024-10-10 15:36:01
-->
<template>
  <div class="grid-wrap">
    <div class="item" v-for="(item, index) in 8" :key="index">item{{ item }}</div>
  </div>
</template>
<script setup></script>

<style lang="scss" scoped>
.grid-wrap {
  box-sizing: border-box;
  padding: 10px;
  background: #bcf;
  display: grid;
  grid-template-columns: repeat(5, minmax(100px, 1fr)); //五等分，最小宽度150
  gap: 8px 16px; //网格间距
  width: 100%;
}
.item {
  background: #bfc;
  width: 100%;
  height: 100%;
}
</style>
