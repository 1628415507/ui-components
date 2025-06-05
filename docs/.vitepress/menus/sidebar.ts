/*
 * @Description:左侧菜单
 * @Date: 2024-06-27 16:50:06
 * @LastEditTime: 2025-06-05 13:26:24
 */
import { sidebarExamples } from './sidebar/examples'  // 左侧菜单
import { sidebarGuide } from './sidebar/guide'  // 左侧菜单
import resourcesComponents from './sidebar/resourcesComponents'  // 左侧菜单
import resourcesDirective from './sidebar/resourcesDirective'  // 左侧菜单
import resourcesMethods from './sidebar/resourcesMethods'  // 左侧菜单

// 左侧菜单
export const sidebar = {
  '/guide': sidebarGuide,// 指南
  '/examples': sidebarExamples,  // 组件示例
  // 资源
  '/resources/businesscomp': resourcesComponents,  // 业务组件
  '/resources/directive': resourcesDirective,  // 业务组件
  '/resources/methods': resourcesMethods  // 业务组件
}
