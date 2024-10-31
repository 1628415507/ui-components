/*
 * @Description:左侧菜单
 * @Date: 2024-06-27 16:50:06
 * @LastEditTime: 2024-10-31 13:16:20
 */
import { sidebarExamples } from './sidebar/examples'  // 左侧菜单
import { sidebarGuide } from './sidebar/guide'  // 左侧菜单
import toolsComponents from './sidebar/toolsComponents'  // 左侧菜单
// 左侧菜单
export const sidebar = {
  '/guide': sidebarGuide,// 指南
  '/examples': sidebarExamples,  // 组件示例
  // 工具
  '/tools/businesscomp': toolsComponents  // 业务组件
}
