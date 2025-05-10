/*
 * @Description: 
 * @Date: 2024-06-26 11:40:35
 * @LastEditTime: 2024-08-19 09:42:19
 */
// ============= 导出
import { App } from 'vue'
import { installComponents } from './components/installComponents.ts'
// console.log('【 components 】-22', components)
// import * as components from './components/components.ts'
// console.log('【 components 】-24', components,components.default)

// 按需引入
import ZInputNumber from "./components/form/input-number"; // 引入封装好的组件
import ZInputDivider from "./components/form/input-divider" // 分割线文本域
import ZInputOrder from "./components/form/input-order" // 短杆分割线输入框
import ZInputExpand from "./components/form/input-expand"
import ZAssociateSelect from "./components/form/associate-select"
import ZExpandMore from "./components/expand-more"
import ZInfoCard from "./components/info-card"
import ZPlusminusButton from "./components/plusminus-button"
// ============= 全局引入 ============= 
const install: any = (app: App, params?: any) => {
  app.config.globalProperties.globalParams = params
  // window['globalParams'] = params || { value: 'globalParams' }
  console.log('【  app.config 】-30', app.config)
  installComponents(app)//全局注册组件
}
export default { install };
// ============= 按需引入 =============
export { ZInputNumber, ZInputDivider, ZInputOrder, ZInputExpand, ZAssociateSelect, ZExpandMore, ZInfoCard, ZPlusminusButton };// 单个的引入