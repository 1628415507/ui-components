<!--
 * @Description: 阻止元素被浮动元素覆盖
 * @Date: 2024-10-09 16:28:17
 * @LastEditTime: 2024-10-10 15:47:15
-->
<template>
  <div>
    BFC 的特性
    <div class="content">
      <div class="block">Box1</div>
      <div class="block">Box2</div>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.content {
  background: var(--box-bg);
}
.block {
  width: 100px;
  height: 100px;
  background: var(--theme-color);
  // 属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
