<template>
  <div>
    <div class="mb-05">
      <el-button @click="setRem(40)">基准字体大小为40px</el-button>
      <el-button @click="setRem(16)">基准字体大小为16px</el-button>
    </div>
    <div class="rem-box">根据html的大小适配</div>
  </div>
</template>
<script setup>
function setRem(num) {
  document.getElementsByTagName('html')[0].style.fontSize = num + 'px'
}
</script>
<style scoped lang="scss">
html {
  font-size: 16px; //默认16
}
// 当屏幕最大宽度 为640时
@media screen and (max-width: 640px) {
  html {
    font-size: 14px !important; // 设置基准字体大小为14px
  }
}
.rem-box {
  font-size: 1rem; // 字体为基准字体大小的1倍
  width: 10.5rem; // 宽度为基准字体大小的10.5倍
  height: 2rem; // 高度为基准字体大小的2倍
  background: var(--theme-color);
}
</style>
