/*
 * @Author: Hongzf
 * @Date: 2022-11-17 16:00:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-07 15:45:25
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
import '@/permission' // 路由守卫，权限设置

// 引入UI组件库、图标
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 微前端
import microApp from '@micro-zoe/micro-app'



const app = createApp(App)
app.use(ElementPlus).use(router).use(store).mount('#app')

microApp.start({
  iframe: true, // 全局开启iframe沙箱，默认为false
  'disable-memory-router': true, // 全局关闭虚拟路由系统，默认值false
  'keep-router-state': true, // 子应用在卸载时保留路由状态，默认值false
  tagName: 'micro-app-base'
})