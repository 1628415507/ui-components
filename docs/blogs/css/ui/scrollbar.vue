<template>
  <div class="scrollbar-wrap">
    <div class="box-wrap">
      <div class="box" v-for="item in 10">{{ item }}</div>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.box-wrap {
  height: 100px;
  overflow: auto;
  background: var(--box-bg);
  width: 100%;
  .box {
    width: 50%;
    line-height: 20px;
    background: var(--theme-color);
  }
}
.scrollbar-wrap {
  // 隐藏滚动条
  // ::-webkit-scrollbar {
  //   width: 0;
  //   height: 0;
  //   color: transparent;
  // }

  ::-webkit-scrollbar {
    width: 15px !important; /*滚动条的宽度*/
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 3px var(--theme-color); //底部背景颜色
    // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    // border-radius: 8px;
    background-color: pink;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    // border-radius: 8px;
    // -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
    // box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.1);
    background-color: var(--theme-color); //滚动条的颜色
  }
}
</style>
