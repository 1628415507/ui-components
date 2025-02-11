<template>
  <div>
    <div>停止输入1s后显示：{{ debounceVal }}</div>
    <div class="el-input"> <input id="input1"  type="text" name=""></input></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
const debounceVal = ref('')

function callback() {
  debounceVal.value =inputDom.value
}
// 防抖
function debounce(fn, delay = 500) {
  let timer = null // 创建一个标记用来存放定时器的返回值
  return function () {
    if (timer) {
      clearTimeout(timer) //未到时间触发，则重新开始延时，进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
    }
    timer = setTimeout(function () {
      fn() //，一定时间段内没有再触发事件，执行事件处理函数，进入该分支说明当前并没有在计时，那么就开始一个计时 //fn.apply(this, arguments);
      timer = null
    }, delay)
  }
}
let inputDom :any
onMounted(() => {
  inputDom = document.getElementById('input1') // 防抖函数
  inputDom?.addEventListener('keyup',debounce(callback,1000))
})
onUnmounted(() => {
  inputDom?.removeEventListener('keyup',debounce(callback))
})
</script>
<style>
.el-input {
  border: 1px solid #eee;
}
</style>
