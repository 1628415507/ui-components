<template>
  <div>
    自动根据⽤⼾的电脑设置应⽤暗⿊模式或明亮模式（ 明亮模式背景自动变成粉色，暗⿊模式背景自动变成黑色）
    <div class="theme-page">
      <div>{{ text }}</div>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss">
.theme-page {
  height: 100px;
}
/* 监听操作系统自带的(电脑)主题模式 */
// 当用户电脑为深色模式时的背景色
@media (prefers-color-scheme: dark) {
  .theme-page {
    background-color: #1e2a34;
  }
}
// 当用户电脑为浅色模式时的背景色
@media (prefers-color-scheme: light) {
  .theme-page {
    background-color: pink;
  }
}
</style>
