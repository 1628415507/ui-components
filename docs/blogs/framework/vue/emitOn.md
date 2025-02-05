---
highlight: a11y-dark
---

# Vue 组件之间的通信方式

| 标题         |                                    |
| ------------ | ---------------------------------- |
| 父子组件通信 | props / $emit                      |
| 子父组件通信 | $emit / v-on                       |
| 兄弟组件通信 | EventBus / Vuex                    |
| 跨级组件通信 | EventBus / Vuex / provide / inject |
| 任意组件通信 | EventBus / Vuex                    |

## 1. 父传子——`props / $emit`

父组件通过 props 向子组件传递需要的信息。 在子组件中，用 props 就可以获取到这个值

- 父组件通过`v-bind:`/`:`传值，子组件通过`props`获取
- 或父组件通过`v-bind:`/`:`传值，子组件通过 `this.$attrs获取`
  - 当子组件没有设置 props 的时候可以使用
  - `this.$attrs`获取到的是一个对象（**所有父组件传过来的集合**）

## 2. 子传父——`$emit / v-on`

- 子组件的`$emit` + 父组件设置`v-on/@`

## 3. 兄弟组件通信

- 任意组件通信，新建一个**空的全局 Vue 对象**，利用`emit`发送，on 接收

```js
/* 1. 新建一个Vue实例作为中央事件总嫌 */
let event = new Vue();

/* 2. 触发事件 */
event.$emit('eventName', '要传的数据')

/* 3. 监听事件 */
event.$on('eventName', ('接收的数据') => {
    //......do something
});
```

## 4. 跨级组件通信

### （1）eventBus

- 类似的库：[mitt 库](https://www.jb51.net/article/251802.htm)，思路和 eventBus 类似
- `Event Bus`  实现跨组件通信  `Vue.prototype.$bus = new Vue()`  自定义事件

```js
Vue.prototype.$eventBus = new Vue()
$eventBus.$emit(事件名, 数据)
$eventBus.$on(事件名, (data) => {})
```

- 示例：
  - ① eventBus.js
  ```js
  import Vue from 'vue'
  export default new Vue({
    data: {
      isRefresh: false
    }
  })
  ```
  - ② 引用文件
  ```js
  import eventBus from './eventBus.js'
  // 操作数据
  eventBus.isRefresh = false
  // 监听数据
  eventBus.$watch('isRefresh', (newValue, oldValue) => {
    // console.log('【eventBus - newValue, oldValue 】-229', newValue, oldValue)
    newValue && this.getTableData() // 这个回调将在 `isRefresh` 改变后调用
  })
  ```

### （2）[Vuex](https://juejin.cn/post/7145391546647445511/)

### （3）Provide、inject

- [祖先组件使用 provide 提供数据，子孙组件通过 inject 注入数据](https://blog.csdn.net/weixin_41897680/article/details/121491584)

### （4）refs—$ref

- `parent、children` `Ref `**获取实例的方式**调用组件的属性或者方法

## 其他通信方式

### attrs 与 listeners

- 适用场景:祖先传递数据给子孙
- 设置批量向下传属性 `$attrs` 和 `$listeners`
- 包含了父级作用域中不作为 prop 被识别(且获取)的特性绑定(class 和 style 除外)。可以通过 `v-bind="$attrs"`传入内部组件
  [延伸问题]

## 1. [在 Vue 中，子组件为何不可以修改父组件传递的 Prop](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/60)

- 所有的 prop 都使得其父子 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。
- 这样会防止从子组件意外改变父级组件的状态，避免导致应用的**数据流向**难以理解。
