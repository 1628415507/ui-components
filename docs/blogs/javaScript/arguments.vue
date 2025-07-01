<template>
  <el-button class="btn" @click="forArguments('A', ' B')">循环访问</el-button>
  <el-button class="btn" @click="handleArguments('A', ' B')">arguments2</el-button>
  <el-button class="btn" @click="handleArguments('A', 'B', 'C', 'D')">arguments4</el-button>
  <el-button class="btn" @click="restFunc('A', 'B', 'C', 'D')">箭头函数参数</el-button>
</template>
<script setup>
function handleArguments() {
  console.log('【 arguments 】-13', arguments, arguments.length)
}
function forArguments() {
  console.log('【 arguments 】-13', arguments, arguments.length)
  for (let i = 0; i < arguments.length; i++) {
    console.log('【 通过`arguments[n]`来访问】-8', arguments[i])
  }
}

const restFunc = (...rest) => {
  console.log('【 rest 】-19', rest)
}
</script>

<style scoped></style>
