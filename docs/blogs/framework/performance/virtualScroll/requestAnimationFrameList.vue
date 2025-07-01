<template>
  <div class="demo-box">
    <ul id="requestAnimationFrameListId"></ul>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
let total = 100000 // 插入十万条数据
let once = 20 // 一次插入 20 条
let index = 0 //每条记录的索引
let ul
//循环加载数据
function loop(curTotal, curIndex) {
  if (curTotal <= 0) {
    return false
  }
  let pageCount = Math.min(curTotal, once) //每页多少条
  // 【时间分片】
  window.requestAnimationFrame(function () {
    // 虚拟dom操作
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < pageCount; i++) {
      let li = document.createElement('li')
      li.innerText = curIndex + i + ' : ' + ~~(Math.random() * total)
      fragment.appendChild(li)
    }
    ul.appendChild(fragment)
    loop(curTotal - pageCount, curIndex + pageCount)
  })
}
onMounted(() => {
  //需要插入的容器
  ul = document.getElementById('requestAnimationFrameListId')
  loop(total, index)
})
</script>

<style scoped lang="scss"></style>
