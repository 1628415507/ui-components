<!--
 * @Description: 
 * @Date: 2025-07-07 16:26:00
 * @LastEditTime: 2025-07-07 17:19:05
-->
<template>
  <div>
    <el-button @click="myClickEvent">点击</el-button>
  </div>
</template>

<script setup lang="ts">

// function changeHeight() {
//   block1.style.height = "100px";
//   setTimeout(() => {
//     block1.style.height = "200px";
//   });
// }

function myClickEvent() {
  eventLoop();
}

function fn1() {
  console.log("fn1");
}

function fn2Timer() {
  console.log("fn2");
}

function fn2() {
  setTimeout(fn2Timer);
}

function fn3() {
  console.log("fn3");
}

function eventLoop() {
  fn1();
  fn2();
  fn3();
}

// Task
// fn1
// fn2
// setTimeout
// install Timer
</script>

<style scoped></style>
