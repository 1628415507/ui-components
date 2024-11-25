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

## 【Vue 中为何不要把 `v-if` 和 `v-for` 同时⽤在同⼀个元素上,原理是什么？】

- 将 `v-if` 和 `v-for` 同时⽤在同⼀个元素上可能会导致性能问题。原因在于 `v-for` 具有⽐ `v-if` 更⾼的优先级，它会在每次渲染的时候都会运⾏。
- 这意味着，即使在某些情况下 v-if 的条件为 false ， v-for 仍然会对数据进⾏

```html{2}
<ul>
  <li v-for="item in items" v-if="item.isActive">{{ item.name }}</li>
</ul>
```

- 在 Vue 的渲染过程中，它会将模板解析为**AST（抽象语法树）**，然后将 AST 转换为渲染函数。对于上⾯的模板，渲染函数⼤致如下：

```js{7}
function render() {
  return _c(
    'ul',
    null,
    _l(items, function (item) {
      // 即使 `item.isActive` 为 false ，Vue 仍然会对它进⾏遍历和渲染
      return item.isActive ? _c('li', null, _v(_s(item.name))) : _e()
    })
  )
}
```

- 上⾯的代码中， `_l` 是由 `v-for` 指令⽣成的渲染函数。它接收⼀个数组和⼀个回调函数，并在每个**数组项**上调⽤回调函数。回调函数根据 `v-if` 条件来决定是否渲染 li 元素。
- **由于 v-for 的优先级⽐ v-if ⾼**，所以每次渲染时都会执⾏` v-for` 循环，⽆论 `v-if` 的条件是否为 `false` 。这意味着即使 `item.isActive` 为 false ，Vue 仍然会对它进⾏遍历和渲染。
- 此外，Vue 在渲染时会尽量复⽤已经存在的元素，⽽不是重新创建和销毁它们。但是当 v-for 遍历的数据项发⽣变化时，Vue 会使⽤具有相同 key 的元素。在上⾯的例⼦中，如果 item.isActive 从 true 变为 false ，Vue 会尝试复⽤之前的 li 元素，并在其上应⽤ v-if 条件。这可能会导致⼀些不符合预期的⾏为。
- 可以考虑使⽤计算属性或者 `v-for` 的过滤器来处理数据
