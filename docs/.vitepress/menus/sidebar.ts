/*
 * @Description:左侧菜单
 * @Date: 2024-06-27 16:50:06
 * @LastEditTime: 2024-12-31 13:39:40
 */
import { sidebarExamples } from './sidebar/examples'  // 左侧菜单
import { sidebarGuide } from './sidebar/guide'  // 左侧菜单
import resourcesComponents from './sidebar/resourcesComponents'  // 左侧菜单
import resourcesDirective from './sidebar/resourcesDirective'  // 左侧菜单
// 左侧菜单
export const sidebar = {
  '/guide': sidebarGuide,// 指南
  '/examples': sidebarExamples,  // 组件示例
  // 资源
  '/resources/businesscomp': resourcesComponents,  // 业务组件
  '/resources/directive': resourcesDirective  // 业务组件
}
