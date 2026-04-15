<template>
  <el-button class="btn" @click="mapSet('A')">set</el-button>
  <el-button class="btn" @click="mapGet()">name:{{ mapGet() }}</el-button>
  <el-button class="btn" @click="mapFor()">遍历</el-button>
  <el-button class="btn" @click="mapSize">size</el-button>
</template>
<script setup>
// 声明
let map = new Map()
map.set('age', 18)

// 设置
function mapSet(val) {
  map.set('name', val)
}
// 遍历
function mapFor() {
  for (let [key, value] of map) {
    console.log('【 key, value 】-16', key, value)
  }
  for (let item of map) {
    console.log('【 item 】-16', item)
  }
}
// 获取
function mapGet() {
  console.log('【  map.get("name") 】-23', map.get('name'))
  return map.get('name')
}
// 长度
function mapSize() {
  console.log('【  map.size 】-27', map.size)
  return map.size
}
</script>

<style scoped></style>
