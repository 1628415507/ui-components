/*
 * @Description:
 * @Date: 2024-10-09 16:08:42
 * @LastEditTime: 2025-01-06 17:11:23
 */
export default [
  { text: 'TODO', link: '/blogs/javaScript/todo.md' },
  { text: '引言', link: '/blogs/javaScript/index.md' },
  {
    text: '变量、作用域与内存', //4
    items: [{ text: '垃圾回收机制 & 内存泄露', link: '/blogs/javaScript/memory.md' }]
  },
  { text: '数据类型', link: '/blogs/javaScript/dataType.md' },
  {
    text: '对象、类与面向对象编程',
    items: [{ text: '原型', link: '/blogs/javaScript/prototype/index.md' }]
  },
  // 函数12
  {
    text: '函数',
    items: [
      { text: '函数', link: '/blogs/javaScript/function.md' },
      { text: '闭包', link: '/blogs/javaScript/closure.md' }
    ]
  },
  // 异步
  { text: 'promise与async/await', link: '/blogs/javaScript/promise/index.md' },
  { text: '事件循环（Event loop）', link: '/blogs/javaScript/eventLoop/index.md' },
  { text: 'ES6 新特性', link: '/blogs/javaScript/es6/index.md' },
  //  事件17
  { text: '事件', link: '/blogs/javaScript/event/index.md' },
  {
    text: '手写代码',
    items: [
      { text: '浅拷贝深拷贝', link: '/blogs/javaScript/code/clone/clone.md' },
      { text: '节流与防抖', link: '/blogs/javaScript/code/debounce/index.md' },
      { text: '其他', link: '/blogs/javaScript/code/code.md' }
    ]
  }
  // {
  //   text: 'CSS 拓展',
  //   items: [
  //     { text: '汇总', link: '/blogs/javaScript/index.md' },
  //     { text: 'BFC', link: '/blogs/javaScript/bfc.md' },
  //   ]
  // }
]
