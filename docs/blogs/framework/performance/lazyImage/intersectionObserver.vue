<template>
  <div class="lazy-container">
    <img class="lazy" :src="initSrc" />
    <img v-for="(item, index) in 10" :key="index" class="lazy" :src="initSrc" :data-url="dataUrl" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
// 默认图片
const initSrc = ref('https://img1.baidu.com/it/u=2330492836,3702189489&fm=253&fmt=auto?w=1422&h=800')
// 实际图片
const dataUrl = ref('https://img0.baidu.com/it/u=619631022,1486696001&fm=253&fmt=auto&app=138&f=JPEG?w=1280&h=800')
// 创建观察者对象
let observer = new IntersectionObserver(callback) //传入回调函数
onMounted(() => {
  // 获取观察对象
  const lazyImages = [...document.querySelectorAll('.lazy')]
  lazyImages.forEach(function (image) {
    observer.observe(image) //观察指定DOM对象
  })
})
// 回调
function callback(entries) {
  entries.forEach(function (entry) {
    // 当元素进入视口时
    if (entry.isIntersecting) {
      const lazyImage = entry.target
      if (lazyImage.dataset.url) {
        //用定时器方便观察替换效果，实际可以不用定时器
        setTimeout(() => {
          lazyImage.src = lazyImage.dataset.url //替换
          observer?.unobserve(lazyImage) //停止观察特定的 DOM 节点
        }, 1000)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.lazy-container {
  height: 300px;
  overflow: auto;
}
</style>
