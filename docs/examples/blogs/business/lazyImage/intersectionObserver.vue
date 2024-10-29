<template>
  <div class="lazy-container">
    <img class="lazy" :src="initSrc" />
    <img v-for="(item, index) in 10" :key="index" class="lazy" :src="initSrc" :data-url="dataUrl" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const initSrc = ref('https://img1.baidu.com/it/u=2330492836,3702189489&fm=253&fmt=auto?w=1422&h=800')
const dataUrl = ref('https://img0.baidu.com/it/u=619631022,1486696001&fm=253&fmt=auto&app=138&f=JPEG?w=1280&h=800')
onMounted(() => {
  // 创建观察对象
  let observer = new IntersectionObserver(callback) //传入回调函数
  const lazyImages = [...document.querySelectorAll('.lazy')]
  lazyImages.forEach(function (image) {
    observer.observe(image) //观察指定DOM对象
  })
})
function callback(entries) {
  entries.forEach(function (entry) {
    // 当元素进入视口时
    if (entry.isIntersecting) {
      const lazyImage = entry.target
      console.log('【 lazyImage 】-43', lazyImage)
      if (lazyImage.dataset.url) {
        //用定时器方便观察替换效果，实际可以不用定时器
        setTimeout(() => {
          lazyImage.src = lazyImage.dataset.url
          observer?.unobserve(lazyImage)
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
