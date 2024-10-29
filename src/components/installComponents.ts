/*
 * @Description:
 * @Date: 2024-06-26 11:40:35
 * @LastEditTime: 2024-10-29 09:59:54
 */
import { defineAsyncComponent } from 'vue'//异步加载组件的方法
import type { Component, App } from 'vue'

// const asyncComp = (path) => {
//   console.log('【 asyncComp 】-11', path)
//   return defineAsyncComponent({
//     // 加载函数
//     loader: () => import(path),

//     // 加载异步组件时使用的组件
//     // loadingComponent: LoadingComponent,
//     // 展示加载组件前的延迟时间，默认为 200ms
//     delay: 200,

//     // 加载失败后展示的组件
//     // errorComponent: '加载失败',
//     // 如果提供了一个 timeout 时间限制，并超时了
//     // 也会显示这里配置的报错组件，默认值是：Infinity
//     timeout: 3000
//   })
// }
// 实现按需引入
export const components: {
  [propName: string]: Component
} = {
  // 表单组件
  ZInputDivider: defineAsyncComponent(() => import('./form/input-divider/src/index.vue')), // 分割线文本域
  ZInputOrder: defineAsyncComponent(() => import('./form/input-order/src/index.vue')), // 短杆分割线输入框
  ZInputExpand: defineAsyncComponent(() => import('./form/input-expand/src/index.vue')),
  ZInputNumber: defineAsyncComponent(() => import('./form/input-number/src/index.vue')),
  ZAssociateSelect: defineAsyncComponent(() => import('./form/associate-select/src/index.vue')),
  // 其他组件
  ZExpandMore: defineAsyncComponent(() => import('./expand-more/src/index.vue')),
  ZInfoCard: defineAsyncComponent(() => import('./info-card/src/index.vue')),
  ZPlusminusButton: defineAsyncComponent(() => import('./plusminus-button/src/index.vue')),
  ZRowSteps: defineAsyncComponent(() => import('./steps/row-steps/src/index.vue')),
  ZVerticalSteps: defineAsyncComponent(() => import('./steps/vertical-steps/src/index.vue'))
}

// 插件声明：声明所有插件
// 插件注册：在 Vue 项目的入口文件中，通过 ( app.use(插件) ) 进行注册
export const installComponents = (app: App) => {
  for (const key in components) {
    app.component(key, components[key])
  }
}
