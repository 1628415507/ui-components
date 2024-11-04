<!--
 * @Description:
 * @Date: 2024-10-31 17:36:21
 * @LastEditTime: 2024-11-04 11:17:52
-->

## 【vue 中 Scoped Styles 是如何实现样式隔离的， 原理是啥？】

在 Vue 中，`.vue` 单⽂件组件的 `<style>`标签可以添加⼀个 `scoped` 属性来实现样式的隔离。
通过这个 scoped 属性，Vue 会确保样式只应⽤到当前组件的模板中，⽽不会泄漏到外部的其他组件
中。
这个效果是通过 `PostCSS` **在构建过程中对 CSS 进⾏转换**来实现的。

### Scoped Styles 的⼯作原理：

1. 当你为 `<style>` 标签添加 `scoped` 属性时，Vue 的加载器（⽐如 vue-loader ）会处理你
   的组件⽂件。
2. `vue-loader` 使⽤ `PostCSS` 来处理 `scoped` 的 CSS。 **它为组件模板内的每个元素添加⼀个独
   特的属性（如 `data-v-f3f3eg9` ）** 。这个属性是随机⽣成的，确保唯⼀性（是在 Vue 项⽬构建
   过程中的 `hash` 值）。
3. 同时，所有的 CSS 规则都会被更新，**以仅匹配带有相应属性选择器的元素**。例如：如果你有⼀个
   .button 类的样式规则，它会被转换成类似`.button[data-v-f3f3eg9]` 的形式。这确保
   了样式只会被应⽤到拥有对应属性的 DOM 元素上。

### 示例

- 编译前

```vue{4}
<template>
  <button class="btn">点击</button>
</template>
<style scoped>
.btn {
  background-color: blue;
}
</style>
```

- 编译时为 scoped 组件模板内的每个元素添加⼀个独特的属性

```vue{1,3}
<button class="btn" data-v-f3f3eg9>点击</button>
<style >
.btn[data-v-f3f3eg9] {
  background-color: blue;
}
</style>
```
