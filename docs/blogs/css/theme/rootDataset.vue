<template>
  <div>
    <el-button @click="toggleTheme">切换主题：{{ theme }}</el-button>
    <!-- 模拟主题页面 -->
    <div class="theme-page">
      <div>{{ text }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import faker from 'faker' //生成随机文本
let text = faker.lorem.sentences()
const theme = ref('light')
function toggleTheme() {
  const root = document.documentElement //获取html元素
  // 修改css变量
  if (root.dataset.theme === 'dark') {
    root.dataset.theme = 'light'
  } else {
    root.dataset.theme = 'dark'
  }
  theme.value = root.dataset.theme
}
</script>
<style lang="scss" scoped>
.theme-page {
  height: 100px;
  background-color: var(--theme-bg);
  color: var(--theme-text);
}
</style>
<style lang="scss">
:root {
  --theme-bg: var(--theme-color); /* 明亮主题⾊ */
  --theme-text: #fff; /* 明亮主题⽂本颜⾊ */
}
// 定义主题变量theme='dark'暗色主题
[data-theme='dark'] {
  --theme-bg: #1e2a34; /* 暗⿊主题⾊ */
  --theme-text: #04f5e9; /* 暗⿊主题⽂本颜⾊ */
}
</style>
