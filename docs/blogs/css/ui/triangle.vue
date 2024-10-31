<!--
 * @Description: 用 CSS 实现三角符号
 * @Date: 2024-10-10 15:33:28
 * @LastEditTime: 2024-10-10 15:36:01
-->
<template>
  <div class="triangle"></div>
</template>
<script setup></script>
<style lang="scss" scoped>
.triangle:after {
  content: ' ';
  $num:20px;
  width: 0px;
  height: 0px;
  border-right: $num solid transparent;
  border-top: $num solid var(--theme-color);
  border-left: $num solid transparent;
  border-bottom: $num solid transparent;
}
</style>
