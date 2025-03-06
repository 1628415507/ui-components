# keepAlive 的实现原理

- keep-alive 是 vue 中的内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染 DOM
- keep-alive 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们
- keep-alive keep-alive 有一个最大缓存限制，使用的是 LRU 算法
  > LRU(Least Recently Used)算法:（最久未使用法，使用了就放到最上边，先删最下边）

## 【基本用法】

```vue
<keep-alive>
 <component :is="view"></component>
</keep-alive>
```

### 1. 属性

- keep-alive 可以设置以下 props 属性:

| 属性      | 描述                                                   |
| --------- | ------------------------------------------------------ |
| `include` | 字符串或正则表达式。只有**名称**匹配的组件会被缓存     |
| `exclude` | 字符串或正则表达式。任何**名称**匹配的组件都不会被缓存 |
| `max`     | 数字。最多可以缓存多少组件实例                         |

### 2. 生命周期钩子

设置了 `keep-alive` 缓存的组件，会多出两个生命周期钩子(`activated` 与 `deactivated`):

- 首次进入组件时:`beforeRouteEnter`>`beforeCreate` >`created`> `mounted` > **`activated`** >..>`beforeRouteLeave` >**`deactivated`**
- 再次进入组件时:`beforeRouteEnter`>**`activated`**>..>`beforeRouteLeave`>**`deactivated`**

### 3. 使用作用场景

- 如 tabs 标签页 后台导航，vue 性能优化
- router-view 也是一个组件,如果直接被**包在 keep-alive 里面**,所有路径匹配到的视图组件都会被缓存

## 【源码解析】

- 该组件没有 template，而是用了`render`，**在组件渲染的时候会自动执行 render 函数**
- 它将满足条件（pruneCache 与 pruneCache）的组件在 cache 对象中缓存起来，在需要重新渲染的时候再将 vnode 节点从 cache 对象中取出并渲染
- this.cache 是一个对象，用来存储需要缓存的组件，它将以如下形式存储:

```js
this.cache = {
  key1: '组件1',
  key2: '组件2'
  //  ...
}
```

### 1. keep-alive 组件

```js{16,28,31,40,41,53,55,56,59,60,63}
export default {
  name: 'keep-alive',
  abstract: true,
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },
  created() {
    this.cache = Object.create(null) // 创建空缓存对象
    this.keys = []
  },
  // 组件销毁时
  destroyed() {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys) // 销毁时删除缓存的组件
    }
  },
  mounted() {
    // 监听include和exclude参数，缓存规则变化时，更新缓存的组件
    this.$watch('include', (val) => {
      pruneCache(this, (name) => matches(val, name)) // 更新缓存的组件
    })
    this.$watch('exclude', (val) => {
      pruneCache(this, (name) => !matches(val, name)) // 更新缓存的组件
    })
  },
  // 【在组件渲染的时候会自动执行 render 函数】
  render() {
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot) /* 【获取默认插槽中的第一个组件节点】 */
    /* 获取该组件节点的 componentOptions */
    const componentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      /* 【获取该组件节点的名称，优先获取组件的name字段，如果name不存在则获取组件的tag】*/
      const name = getComponentName(componentOptions)
      const { include, exclude } = this
      /* 【如果name不在inlcude中或者存在于exclude中则表示不缓存，直接返回vnode】 */
      if (
        (include && (!name || !matches(include, name))) || // name不在inlcude中
        (exclude && name && matches(exclude, name)) // 或者存在于exclude中
      ) {
        return vnode // 直接返回vnode
      }
      const { cache, keys } = this
      /* 【获取组件的key值】 */
      const key =
        vnode.key == null
          ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag} ` : '') // same constructor may get registered as different local components,so cid alone is not enough (#3269)
          : vnode.key
      /* 【拿到key值后去this.cache对象中去寻找是否有该值，如果有则表示该组件有缓存，即命中缓存，，则直接从缓存中拿 vnode 的组件实例 】*/
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // 调整该组件key的顺序，将其从原来的地方删掉并重新放在最后一个（最后面代表是最新使用的） */
        remove(keys, key)
        keys.push(key) // 将最新用到的缓存组件移到最后，代表最新使用的
      } else {
        /* 【如果没有命中缓存，则将其设置进缓存】 */
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        /* 【如果配置了max并且缓存的长度超过了this.max，则从缓存中删除第一个(越前面的代表越久没有使用的】) */
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode) //移除超出限制的多余的缓存组件
        }
      }
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```

### 2. pruneCacheEntry 移除组件缓存

```ts{8,10,12,13}
function pruneCacheEntry(
  cache: VNodeCache, //所有缓存的组件
  key: string, // 组件KEY
  keys: Array<string>, //所有key
  current?: VNode //当前渲染的组件
) {
  const cached = cache[key]
  /* 判断当前没有处于被渲染状态的组件，将其销毁*/
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()//调用销毁方法，真正删除组件
  }
  cache[key] = null
  remove(keys, key)
}
```

### 3. pruneCache 更新组件缓存

- 如果 `include` 或 `exclude` 发生了变化，即表示定义需要缓存的组件的规则或者不需要缓存的组件的规则发生了变化，那么就执行 pruneCache 函数，更新组件缓存
- 在该函数内对 `this.cache` 对象进行遍历，取出每一项的 name 值，用其与新的缓存规则进行匹配，如果匹配不上，则表示在新的缓存规则下该组件已经不需要被缓存，则调用 pruneCacheEntry 函数将其从 this.cache 对象剔除即可
- 函数如下:
  - keepAliveInstance：keepAlive 组件的实例
  - filter:判断组件是否存在于缓存规则中

```ts{8,9}
function pruneCache(keepAliveInstance, filter) {
  const { cache, keys, _vnode } = keepAliveInstance
  // 对 `this.cache` 对象进行遍历
  for (const key in cache) {
    const cachedNode = cache[key]
    if (cachedNode) {
      const name = getComponentName(cachedNode.componentOptions) //取出name 值
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode) //如果匹配不上，则删除组件缓存
      }
    }
  }
}
```

## 【缓存后如何获取数据】

解决方案可以有以下两种:

- beforeRouteEnter
- actived
