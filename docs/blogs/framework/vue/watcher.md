# vue 的三种 watcher

## watcher 的分类

Vue 的 watcher 主要分为以下三类：
|类别|描述|创建时间
|----|----|--|
|`computed watcher`|是 **computed 函数在自身内部**维护的一个 watcher，配合其内部的属性 `dirty` 开关来决定 computed 的值是需要重新计算还是直接复用之前的值| vue 的初始化阶段|
|`user watcher`|就是用户自定义的 export 导出对象的 watch 属性|vue 的初始化阶段|
|`render watcher`|用来维持数据响应式的，负责视图更新；|渲染节点|

- 这三种实际上都是通过 `class Watcher` 类来实现的
- 三种 watcher 的执行顺序为 `computed watcher`、`user watcher`、`render watcher`  
  当`computed watcher`、`user watcher` 将数据更新完成之后，要渲染到视图上的时候触发 `render watcher`

## [`computed watcher`](/blogs/framework/vue/computed/)

- **在 vue 的初始化阶段**，调用`initState`，判断对象的 computed 是否存在值，如果存在则调用 initComputed 初始化 computed，在这个方法中对 computed Watcher 进行了初始化。
- 在 `initComputed` 中，首先定义了一个空的 watchers 对象来存储所有的计算属性对应的 watcher；接着遍历组件中定义的计算属性，且对其添加 watcher 进行监听（调用 `defineComputed` 添加 get 和 set）
- computed 函数在自身内部维护的一个 watcher，配合其内部的属性 `dirty` 开关来决定 computed 的值是需要重新计算还是直接复用之前的值。
- computed 计算属性可以定义两种方式的参数
  > { [key: string]: Function | { get: Function, set: Function } }
- 计算属性直接定义在 Vue 实例中，**所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例**

## `user watcher`

- `user watcher`也是在**初始化阶段创建**的。不同的是 user watcher 是在 initWatch 中创建的，且它是一个个的去遍历创建。
  > 在 src/core/instance/state.js 文件中 initState 中调用 `initWatch()`初始化 User watcher.
- 类型`{ [key: string]: string | Function | Object | Array }`
- Vue 实例将会在实例化时调用$watch()，遍历 watch 对象的每一个 property
- 在 `user watcher` 中可以定义 `deep` 与 `immediate` 属性，分别为深度监听 watch 和立即执行回调的定义；  
  在 `render watch` 中定义数组的每一项由于性能与效果的折衷是不会直接被监听的，但是**使用 deep 就可以对其进行监听**
- 不应该使用箭头函数来定义 watcher 函数
  > 例如 searchQuery: newValue => this.updateAutocomplete(newValue)，理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.updateAutocomplete 将是 undefined

---

- https://blog.csdn.net/qq_42931285/article/details/137433379
- https://blog.csdn.net/youxinm24/article/details/142676128

## `render watcher`（Vue 的响应式原理）

| 类别     | 描述                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| Observer | 是这里的主要工作是递归地监听对象上的所有属性，在属性值改变的时候，触发相应的 Watcher。                                    |
| Watcher  | 观察者，当监听的数据值修改时，执行响应的回调函数，在 Vue 里面的更新模板内容                                               |
| Dep      | **链接 Observer 和 Watcher 的桥梁**，每一个 Observer 对应一个 Dep，它内部维护一个数组，保存与该 Observer 相关的 Watcher。 |

**当渲染模板时，一个 render watcher 被创建，模板中用到的所有数据属性都会触发 `getter`，并将 `render watcher` 记录到这些属性的 Dep 中**  
new Vue 实例化时，执行`_init` 方法(src\core\instance\init.js)

```js{9}
// 对传入的配置与默认配置合并
vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm)
vm._self = vm
initLifecycle(vm) // 初始化组件的$parent\$root\$children\$ref属性
initEvents(vm) // 初始化组件的事件监听
initRender(vm) // 初始化$slots属性, 定义 $createElement和vm._c方法(用于生成虚拟dom)，对组件的$listeners、$attrs做响应式处理
callHook(vm, 'beforeCreate') // 执行beforeCreate生命周期函数
initInjections(vm) // 获取组件的inject所有属性，并做响应式处理
initState(vm) // 组件数据的初始化以及响应式处理：按顺序 props => methods => data => computed => watch
initProvide(vm) // 获取组件的provide所有属性，并做响应式处理
callHook(vm, 'created') // 执行created生命周期函数
// 处理完组件相关的数据后，开始执行$mount方法
if (vm.$options.el) {
  vm.$mount(vm.$options.el) // $mount 在src\platforms\web\entry-runtime-with-compiler.js文件中执行了扩展
}
```
