<template>
  <div class="bg0">
    <p>原比例</p>
    <p>background-position: center;</p>
    <p>background-repeat: no-repeat;</p>
    <p>background-size: 100%;</p>
  </div>
  <div class="flex-sb">
    <div class="repeat">
      <p>重复背景</p>
      <p>background-position: center;</p>
      <p>background-repeat: repeat;</p>
      <p>background-size: 100%;</p>
    </div>
    <div class="bg1">
      <p>按中心点等比放大</p>
      <p>background-position: center;</p>
      <p>background-repeat: no-repeat;</p>
      <p>background-size: 215%;</p>
    </div>
    <div class="bg2">
      <p>中心点偏移（）</p>
      <p>background-position: 150% 140%</p>
      <p>background-repeat: no-repeat;</p>
      <p>background-size: 130%;</p>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.bg0,
.repeat,
.bg1,
.bg2 {
  margin-right: 10px;
  position: relative;
  width: 300px;
  height: 200px;
  overflow: hidden;
  border: 1px solid red;
  p {
    position: relative;
    z-index: 22;
  }
  // 背景图
  &::after {
    position: absolute;
    top: 0;
    left: 0px;
    content: ' ';
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(./img/bg2.png);
    z-index: 1;
    // background-attachment: fixed;
  }
}
.bg0 {
  &::after {
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
  }
}
.repeat {
  &::after {
    background-position: center;
    background-repeat: repeat;
    background-size: 100%;
  }
}
.bg1 {
  &::after {
    background-position: center; //按中心点
    background-repeat: no-repeat;
    background-size: 215%; //等比放大
  }
}
.bg2::after {
  background-position: 150% 150%; //左偏，下偏//第一个值是水平位置，第二个值是垂直位置。
  background-repeat: no-repeat;
  background-size: 100%;
}
</style>
