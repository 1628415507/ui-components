<template>
  <div>
    <el-button id="btnPay" @click="handlePay" class="mb-05">确认并⽀付</el-button>
    <div style="color: red">
      {{ tip }}
    </div>
    <div class="canvas-wrap">
      <canvas id="canvasMovies" width="500" height="300">您的浏览器不支持canvas！</canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
// 获取画布和按钮元素
let canvas //= document.getElementById('canvas')
let btnPay // = document.getElementById('btnPay')
const width = 30
const gap = width + 20 // 间距20
const tip = ref('') // 间距20

// 初始化座位
onMounted(() => {
  canvas = document.getElementById('canvasMovies')
  btnPay = document.getElementById('btnPay')
  initSeat()
  canvas.addEventListener('click', handleClick) // 绑定点击事件和确认并⽀付按钮点击事件
})
let seats = []
// 绘制座位
function drawSeat(x, y, state) {
  let ctx = canvas.getContext('2d') //生成 2D 图案
  switch (state) {
    case 'selectable':
      ctx.fillStyle = '#ccc' // 可选座位
      break
    case 'sold':
      ctx.fillStyle = '#f00' // 已售座位
      break
    case 'selected':
      ctx.fillStyle = '#42b983' // 已选座位
      break
    default:
      ctx.fillStyle = '#000' // 其他座位
      break
  }
  ctx.fillRect(x * gap, y * gap, width, width)
}
// 初始化座位数组
function initSeat() {
  for (let i = 0; i < 10; i++) {
    seats[i] = []
    for (let j = 0; j < 10; j++) {
      seats[i][j] = 'selectable' // 初始状态为可选
      drawSeat(i, j, 'selectable') // 绘制座位
    }
  }
}
// 统计已选座位数量和位置
function countSelectedSeats() {
  let selectedSeats = []
  let count = 0
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (seats[i][j] == 'selected') {
        selectedSeats.push([i, j])
        count++
      }
    }
  }
  return [count, selectedSeats]
}
// 更新座位状态和颜⾊
function updateSeat(x, y) {
  if (seats[x][y] == 'selectable') {
    seats[x][y] = 'selected' // 更改为已选状态
  } else if (seats[x][y] == 'selected') {
    seats[x][y] = 'selectable' // 更改为可选状态
  }
  drawSeat(x, y, seats[x][y]) // 更新颜⾊
}
// 检查座位状态是否可选
function checkSeat(x, y) {
  if (seats[x][y] == 'sold') {
    tip.value = '该座位已售出，请选择其他座位！'
    return false
  } else if (seats[x][y] == 'selected') {
    tip.value = '该座位已被选中，请选择其他座位！'
    return false
  }
  return true
}
// 点击事件处理函数
function handleClick(e) {
  console.log('【 handleClick(e 】-90', e)
  let diffX = e.offsetX - canvas.offsetLeft < 0 ? 0 : e.offsetX - canvas.offsetLeft
  let diffY = e.offsetY - canvas.offsetTop < 0 ? 0 : e.offsetY - canvas.offsetTop
  // console.log('【 diffX 】-94', diffX, diffY, e.offsetY, canvas.offsetTop)
  let x = parseInt(diffX / gap)
  let y = parseInt(diffY / gap)
  console.log('【 坐标 】-99', x, y)
  if (x >= 0 && x < 10 && y >= 0 && y < 10) {
    if (checkSeat(x, y)) {
      updateSeat(x, y)
      let count = countSelectedSeats()[0]
      if (count > 0) {
        btnPay.innerHTML = '确认并⽀付（已选 ' + count + ' 座位）'
      } else {
        btnPay.innerHTML = '确认并⽀付'
      }
    }
  }
}
// 确认并⽀付按钮点击事件处理函数
function handlePay() {
  let selectedSeats = countSelectedSeats()[1]
  console.log('【 selectedSeats 】-99', selectedSeats)
  if (selectedSeats.length == 0) {
    tip.value = '请选择座位！'
    return
  }
  if (confirm('您已选中以下座位：' + selectedSeats.join('、') + '，确认⽀付吗？')) {
    // 向后台发送选票信息，并进⾏⽀付处理
    tip.value = '⽀付成功！请前往指定影院取票！'
    initSeat() // 重新初始化座位
    btnPay.innerHTML = '确认并⽀付'
  }
}
</script>

<style>
.canvas-wrap {
  position: relative;
}
</style>
