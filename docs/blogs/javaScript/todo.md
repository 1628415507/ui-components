<!--
 * @Description:
 * @Date: 2024-10-09 18:05:54
 * @LastEditTime: 2024-10-11 16:19:37
-->
<!--
 * @Description:
 * @Date: 2024-10-09 18:05:54
 * @LastEditTime: 2024-10-10 15:22:47
-->

- ~~[内存泄漏排查、定位与修复 ❓](https://juejin.cn/post/6984188410659340324#heading-11)~~

## es6 Modules（模块）

### 为什么要使用模块化？都有哪几种方式可以实现模块化，各有什么特点？⭐⭐⭐

- 防止**命名冲突**
- 更好的分离，按需加载
- 更好的**复用性**
- 更高的**维护性**

### [exports 和 module.exports 有什么区别？](https://www.jianshu.com/p/beafd9ac9656) ⭐⭐⭐

- 导出方式不一样  
  使用 exports 只暴露自定义部分,大白话的意思就是**按需导出**，而使用 module.exports 暴露完整对象。
  - exports.xxx='xxx'
  - module.export = {}
- exports 是 module.exports 的引用，两个指向的是用一个地址，而 require 能看到的只有 module.exports
