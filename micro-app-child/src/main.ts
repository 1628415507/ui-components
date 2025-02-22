/*
 * @Author: Hongzf
 * @Date: 2022-11-17 16:00:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-22 17:57:05
 * @Description:
 */
import { createApp } from 'vue'
import App from '@/App.vue'
// 引入全局样式
import '@/style.css'
// import './styles/index.scss' // global css(放到vite.config.ts中配置才有效)
// 引入基础库
import router from '@/router'
import { store } from '@/store'
// 路由守卫，权限设置
import '@/permission'

// 引入UI组件库、图标
import ElementPlus from 'element-plus'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus).use(router).use(store).mount('#microAppChildId')
// 全局注册图标组件
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }
// 卸载应用
window.unmount = () => {
  console.log('【 卸载应用 】-31')
  app.unmount()
}
