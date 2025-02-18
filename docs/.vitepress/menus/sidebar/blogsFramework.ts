/*
 * @Description:
 * @Date: 2024-10-14 17:14:53
 * @LastEditTime: 2025-02-07 14:30:14
 */
export default [
  { text: '汇总', link: '/blogs/framework/index.md' },
  {
    text: 'Vue',
    items: [
      { text: 'vue', link: '/blogs/framework/vue/index.md' },
      {
        text: 'API',
        items: [
          { text: 'vue 的生命周期', link: '/blogs/framework/vue/lifeCycle.md' },
          { text: 'Vue组件之间的通信方式', link: '/blogs/framework/vue/emitOn.md' }
        ]
      },
      { text: 'vue-router', link: '/blogs/framework/vue/router/router.md' },
      { text: 'vue3', link: '/blogs/framework/vue/vue3.md' },
      { text: 'MVC与MVVM模式的区别', link: '/blogs/framework/vue/mvvm.md' },
      {
        text: 'Vue 原理',
        items: [
          { text: '浏览器原生路由实现', link: '/blogs/framework/vue/router/principle.md' },
          { text: '虚拟DOM与Diff算法分析', link: '/blogs/framework/vue/diff/index.md' },
          { text: 'vue 的双向绑定的原理', link: '/blogs/framework/vue/vModel/index.md' },
          { text: '插槽的实现原理', link: '/blogs/framework/vue/slots/index.md' }
        ]
      }
    ]
  },
  { text: 'TypeScript入门', link: '/blogs/framework/typeScript/index.md' },
  {
    text: 'Cli',
    items: [
      { text: 'Cli相关', link: '/blogs/framework/cli/index.md' },
      { text: 'Webpack的基础配置', link: '/blogs/framework/cli/base.md' },
      { text: 'Webpack', link: '/blogs/framework/cli/webpack.md' }
    ]
  },
  {
    text: '小程序',
    items: [{ text: 'uni-app', link: '/blogs/framework/uniapp/index.md' }]
  },
  {
    text: '微前端',
    items: [{ text: 'micro-app', link: '/blogs/framework/micro/micro-app/index.md' }]
  }
]
