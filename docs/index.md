---
# 首页部分的配置
# https://vitepress.dev/reference/default-theme-home-page
# 提供三种布局，doc、page和home https://vitepress.dev/reference/default-theme-layout
layout: home


hero:
  name: "UI-COMPONENTS"
  text: "Vue3组件库"
  tagline: 基于Vue3+Element-plus二次封装基础组件文档
  #  image:
  #     src: /tiger.svg
  #     alt: 背景图
  actions:
    - theme: brand
      text: Markdown Examples
      link: /markdown-examples
    - theme: alt
      text: 组件总览
      link: /api-examples
# 方块配置
features:
  # - icon: 🤹‍♀️
  #   title: Web后端
  #   details: 某厂程序猿，国内某互联网厂搬砖。
  #   # link: /column/views/guide
  - title: 指南/Guide
    details: 安装教程安装教程安装教程安装教程安装教程安装教程
    link: /guide
  - title: 组件/Components
    details: 组件使用教程组件使用教程组件使用教程组件使用教程组件使用教程组件使用教程组件使用教程
    link: /examples
  - title: Feature C
    details: 描述
#显示最后更新时间
lastUpdated: true
---

<!-- 自定义组件 -->
<!-- <script setup>
import demo from './components/custom-demo/demo.vue';
</script>

<demo /> -->