<!--
 * @Description: 
 * @Date: 2024-10-18 09:15:10
 * @LastEditTime: 2024-10-18 11:10:09
-->
<template>
  <div>
    <div>
      方式一：在浮动元素后添加一个空标签
      <el-button @click="addClearDiv = !addClearDiv" class="mb-05">添加一个空标签</el-button>
    </div>
    <div style="min-height: 150px">
      <div class="container">
        <div class="box float-left">左浮动</div>
        <div class="box float-left">左浮动</div>
        <div class="box float-right">右浮动</div>
        <div v-if="addClearDiv" class="clear"></div>
      </div>
    </div>
    <hr />
    <div>
      方式二：clearfix(推荐)
      <el-button @click="addClearfix = !addClearfix" class="mb-05">添加clearfix</el-button>
    </div>
    <div style="min-height: 150px">
      <div class="container" :class="{ clearfix: addClearfix }">
        <div class="box float-left">左浮动</div>
        <div class="box float-left">左浮动</div>
        <div class="box float-right">右浮动</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const addClearDiv = ref(false)
const addClearfix = ref(false)
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  border: solid 3px pink;
  background-color: var(--box-bg);
  .box {
    float: left;
    width: 200px;
    height: 100px;
    background-color: var(--theme-color);
    margin: 0 5px;
    &.float-left {
      float: left;
    }
    &.float-right {
      float: right;
    }
  }
}
.clearfix:after {
  /*在类名为“clearfix”的元素内最后面加入内容；*/
  content: ''; /*内容为“.”就是一个英文的句号而已。也可以不写。*/
  display: block; /*加入的这个元素转换为块级元素。*/
  clear: both; /*清除左右两边浮动。*/
  visibility: hidden; /*可见度设为隐藏。仍然占据空间，只是看不到而已*/
  height: 0; /*高度为0； */
  font-size: 0; /*字体大小为0;*/
}
.clear {
  clear: both;
}
</style>
