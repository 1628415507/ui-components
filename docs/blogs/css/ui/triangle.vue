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
  width: 0px; // 宽高均为零
  height: 0px; // 宽高均为零
  border: 20px solid transparent; // 三面边框皆透明
  border-top: 20px solid var(--theme-color); // 三角形的那头有颜色
}
</style>
