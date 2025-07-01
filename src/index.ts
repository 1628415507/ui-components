/*
 * @Description:
 * @Date: 2024-06-26 11:40:35
 * @LastEditTime: 2024-09-27 15:42:41
 */
// ============= 预览
// import { createApp } from 'vue'
// import App from '@/App.vue'
// import '@/style.css'

// import ElementPlus from 'element-plus'
// // import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import 'element-plus/dist/index.css'

// const app = createApp(App)
// app.use(ElementPlus).mount('#app')

// ============= 导出
import { App } from 'vue'
import { installComponents } from './components/installComponents.ts'
// console.log('【 components 】-22', components)
// import * as components from './components/components.ts'
// console.log('【 components 】-24', components,components.default)

// 按需引入
import ZInputNumber from './components/form/input-number' // 引入封装好的组件
import ZInputDivider from './components/form/input-divider' // 分割线文本域
import ZInputOrder from './components/form/input-order' // 短杆分割线输入框
import ZInputExpand from './components/form/input-expand'
import ZAssociateSelect from './components/form/associate-select'
import ZExpandMore from './components/expand-more'
import ZInfoCard from './components/info-card'
import ZPlusminusButton from './components/plusminus-button'
// ============= 全局引入 =============
const install: any = (app: App, params?: any) => {
  app.config.globalProperties.globalParams = params
  // window['globalParams'] = params || { value: 'globalParams' }
  console.log('【  app.config 】-30', app.config)
  installComponents(app) //全局注册组件
  // 渲染错误处理
  app.config.errorHandler = (error, vm, info) => {
    console.error('【 全局-组件渲染报错处理 】-116', error, vm, info)
  }
}
export default { install }
// ============= 按需引入 =============
export {
  ZInputNumber,
  ZInputDivider,
  ZInputOrder,
  ZInputExpand,
  ZAssociateSelect,
  ZExpandMore,
  ZInfoCard,
  ZPlusminusButton
} // 单个的引入
