# Vue3

## 【Vue2 / Vue3 的区别】

### 1. 概括

| 区别                    | Vue2                         | Vue3                                                                        |
| ----------------------- | ---------------------------- | --------------------------------------------------------------------------- |
| 响应式对比              | 使用 `Object.defineProperty` | 使用 `Proxy`                                                                |
| API 差异                | 使用 `Options API`           | 使用 `Composition API`                                                      |
| v-model 用法            | 默认是绑定 value 属性        | 支持多个绑定属性和事件自定义                                                |
| Fragments（多个根元素） | 只能有一个根元素             | 支持多个根元素(`Fragments`)                                                 |
| v-if 和 v-for 的优先级  | v-for 的优先级高于 v-if      | v-if 的优先级高于 v-for                                                     |
| diff 算法不同           | 比较每一个节点               | 在初始化的时候会给每一个虚拟节点添加一个 `patchFlagsd`<br/>是一种优化的标识 |

### 2. Vue3.0 里为什么要用 Proxy API 替代 defineProperty API ?

- `Object.defineProperty` 只能遍历**对象**属性进行劫持
- Proxy 直接**可以劫持整个对象**，并**返回一个新对象**，我们可以只操作新的对象达到响应式目的
- Proxy 可以直接监听数组的变化(`push`、`shift` 、`splice` )
- Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等，这是 Object.defineProperty 不具备的,正因为 defineProperty 自身的缺陷，导致 Vue2 在实现响应式过程需要实现其他的方法辅助(如重写数组方法、增加额外 set、delete 方法)
- Proxy 不兼容 IE，也没有 polyfill；defineProperty 能支持到 IE9

#### (1) defineProperty API 的问题

- 检测不到对象属性的**添加和删除**，需要用到 `this.$set`
- **数组 API**方法无法监听到
- 需要对每个属性进行遍历监听，如果嵌套对象，需要**深层监听**，造成性能问题

#### (2) Proxy API

- Proxy 的监听是**针对一个对象**的，那么对这个对象的所有操作会进入监听操作，这就完全可以代理所有属性了

  ::: example
  blogs/framework/vue/myreactive
  :::

- [Reflect.get()](https://blog.csdn.net/dingshuo168/article/details/137891732)  
   Reflect.get() 是 JavaScript 的一个内置方法，它用于获取对象上某个属性的值。与直接使用点（.）或方括号（[]）访问属性的方式类似

```js{6,12,14,19,25}
function myReactive(obj) {
  if (typeof obj !== 'object' && obj != null) {
    return obj
  }
  // Proxy相当于在对象外层加拦截
  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)//类似于obj.key
      console.log(`获取${key}:${res}`)
      // return res //这里直接return 复杂嵌套（ state2.bar.a ）无法触发set
      // 解决嵌套无法进入代理set的问题，需要在 get 之上再进行一层代理 myReactive(res)
      return typeof res == 'object' ? myReactive(res) : res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      console.log(`设置${key}:${value}`)
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      console.log(`删除${key}:${res}`)
      return res
    }
  })
  return observed
}
```

### 3. Vue3`Composition API`与 Vue2`Options API` 有什么不同?

- `Options API`：当组件的逻辑比较复杂时，会更加的**碎片化**，在处理单个逻辑关注点时，我们必须不断地“**跳转**”相关代码的选项块，这种碎片化使得理解和维护复杂组件变得困难
- 在 `Vue3 Composition API` 中，组件**根据逻辑功能来组织**的，一个功能所定义的所有 API 会放在一起(更加的**高内聚，低耦合**)

### 4. v-if 和 v-for 的优先级的区别

- **在 Vue2 中 v-for 的优先级高于 v-if**，可以放在一起使用，但是不建议这么做，会带来性能上的浪费
- **在 Vue3 中 v-if 的优先级高于 v-for**，**一起使用会报错**。可以通过在外部添加一个标签，将 v-for 移到外层

### 5. diff 算法不同

Vue2

- **遍历每一个虚拟节点**，进行虚拟节点对比，并返回一个 patch 对象，用来存储两个节点不同的地方。用 patch 记录的消息去更新 dom
- 缺点：比较每一个节点，而对于一些不参与更新的元素，进行比较是有点消耗性能的。  
   特点：特别要提一下 Vue 的 patch 是即时的，并不是打包所有修改最后一起操作 DOM，也就是在 vue 中边记录边更新。（React 则是将更新放入队列后集中处理）。

Vue3

- **在初始化的时候会给每一个虚拟节点添加一个 patchFlags，是一种优化的标识**。  
  只会比较 patchFlags 发生变化的节点，进行识图更新。而对于 patchFlags 没有变化的元素作静态标记，在渲染的时候直接复用。

## 【Vue3.0 性能提升主要是通过哪几方面体现的?】

### 1.编译阶段

- 回顾 Vue2 ，我们知道每个组件实例都对应一个 watcher 实例，它**会在组件渲染的过程中把用到的数据 property 记录为依赖，当依赖发生改变，触发 setter ，则会通知 watcher ，从而使关联的组件重新渲染**
- Vue3 在编译阶段，做了进一步优化。主要有如下:

#### (1)diff 算法优化——增加静态标记

- Vue3 在 diff 算法中相比 Vue2 增加了**静态标记**
- 关于这个静态标记，其作用是为了**会发生变化的地方添加一个 flag 标记**，下次发生变化的时候直接找该地方进行比较
  下图这里，已经标记静态节点的 p 标签在 diff 过程中则不会比较，把性能进一步提高
  ![alt text](image.png)

#### (2)静态提升——不参与更新的元素，只会被创建一次

Vue3 中对不参与更新的元素，会做静态提升，**只会被创建一次，在渲染时直接复用，这样就免去了重复的创建节点**，大型应用会受益于这个改动，免去了重复的创建操作，优化了运行时候的内存占用
![alt text](./img/image-2.png)
![alt text](./img/image-5.png)

#### (3)事件监听缓存

![alt text](./img/image-4.png)

#### SSR 优化

- 当静态内容大到一定量级时候，会用 createStaticVNode 方法在客户端去生成一个 static node，这些静态 node ，**会被直接 innerHtml(直接以 html 的形式返回)，** 就不需要创建对象，然后根据对象渲染
  ![alt text](./img/image-3.png)

### 2.源码体积

相比 Vue2 ， Vue3 整体体积变小了，**除了移出一些不常用的 AP!**，再重要的是 Tree shanking 任何一个函数，如 ref、reavtived、computed 等，**仅仅在用到的时候才打包**，没用到的模块都被摇掉，打包的整体体积变小

### 3.响应式系统

- Vue2 中采用 defineProperty 来劫持整个对象，然后进行深度遍历所有属性，给每个属性添加 getter 和 setter，实现响应式
- Vue3 采用 proxy 重写了响应式系统，因为 **proxy 可以对整个对象进行监听**，所以不需要深度遍历
  - 可以监听动态属性的添加
  - 可以监听到数组的索引和数组 length 属性
  - 可以监听删除属性

## 【Vue 3.0 中 Treeshaking 特性?】

- `Tree shaking` 是一种通过**清除多余代码**方式来优化项目打包体积的技术，
- 在 Vue2 中，无论我们使用什么功能，它们最终都会出现在生产代码中。主要原因是 **Vue 实例在项目中是单例的**，捆绑程序无法检测到该对象的哪些属性在代码中被使用到

```js
import Vue from 'vue'
Vue.nextTick(() => {})
```

- 而 Vue3 源码引入 tree shaking 特性，将全局 API 进行分块。如果您**不使用其某些功能，它们将不会包含在您的基础包中**

```js
import { nextTick, observable } from 'vue'
nextTick(() => {})
```

- 通过 Tree shaking ,Vue3 给我们带来的好处是:
  - 减少程序体积(更小)
  - 减少程序执行时间(更快)
  - 便于将来对程序架构进行优化(更友好)
