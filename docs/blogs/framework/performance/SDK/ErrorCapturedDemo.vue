<template>
  <div>
    <div>我是子组件：组件渲染报错时会被父组件的onErrorCaptured捕获</div>
  </div>
</template>
<script setup>
// 以下报错，会被onErrorCaptured或app.config.errorHandler捕获
handlePromiseError2() //运行未申明的方法
</script>
