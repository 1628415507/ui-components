<!--
 * @Description: 
 * @Date: 2024-10-10 17:32:39
 * @LastEditTime: 2024-10-10 17:57:50
-->
<template>
  <div>
    <el-form label-width="250px" label-position="left">
      <el-form-item label="1px">
        <div class="line one-px"></div>
      </el-form-item>
      <el-form-item label="0.5px">
        <div class="line half-px"></div>
      </el-form-item>
      <el-form-item label="1px + scaleY(0.5)">
        <div class="line scale-half"></div>
      </el-form-item>
      <el-form-item label="linear-gradient(0deg, #fff, #000)">
        <div class="line gradient"></div>
      </el-form-item>
      <el-form-item label="svg">
        <svg xmlns="http://www.w3.org/2000/svg" width="300px" height="1px">
          <line x1="0" y1="0" x2="100%" y2="0" stroke="#000"></line>
        </svg>
      </el-form-item>
      <!-- <el-form-item label="svg(base64)">
        <div class="line svg-base64"></div>
      </el-form-item> -->
      <el-form-item label="boxshadow">
        <div class="line boxshadow"></div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 5px;
}
.line {
  width: 300px;
  background-color: #000;
  &.scale-half {
    height: 1px;
    transform: scaleY(0.5);
    transform-origin: 50% 100%;
  }
  &.half-px {
    height: 0.5px;
  }
  &.one-px {
    height: 1px;
  }
  &.gradient {
    height: 1px;
    background: linear-gradient(0deg, #fff, #000);
  }
  &.boxshadow {
    height: 1px;
    background: none;
    box-shadow: 0 0.5px 0 #000;
  }
  &.svg-base64 {
    background: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='1px'><line x1='0' y1='0' x2='100%' y2='0' stroke='#000'></line></svg>");
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzFweCc+PGxpbmUgeDE9JzAnIHkxPScwJyB4Mj0nMTAwJScgeTI9JzAnIHN0cm9rZT0nIzAwMCc+PC9saW5lPjwvc3ZnPg==');
  }
}
</style>
