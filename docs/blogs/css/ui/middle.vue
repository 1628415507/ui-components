<template>
  <div class="wrap demo-box">
    <div class="box"></div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.wrap {
  position: relative;
  .box {
    background-color: #bfa;
    width: 60%;
    height: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); //向左和向上移动元素的一半宽度和一半高度
  }
}
</style>
