/*
 * @Description:左侧菜单
 * @Date: 2024-06-27 16:50:06
 * @LastEditTime: 2024-10-31 13:16:20
 */
import { sidebarExamples } from './sidebar/examples'  // 左侧菜单
import { sidebarGuide } from './sidebar/guide'  // 左侧菜单
// 资源
import resourcesComponents from './sidebar/resourcesComponents'  // 左侧菜单
import resourcesDirective from './sidebar/resourcesDirective'  // 左侧菜单
// 博客
import blogsBusiness from './sidebar/blogsBusiness'  // 左侧菜单
import blogsCss from './sidebar/blogsCss'  // 左侧菜单
import blogsJavaScript from './sidebar/blogsJavaScript'  // 左侧菜单
import blogsFramework from './sidebar/blogsFramework'  // 左侧菜单
import blogsNetwork from './sidebar/blogsNetwork' // 左侧菜单
// 左侧菜单
export const sidebar = {
  // 指南
  '/guide': sidebarGuide,
  // 组件库示例
  '/examples': sidebarExamples,
  // 资源
  '/resources/businesscomp': resourcesComponents,  // 业务组件
  '/resources/directive': resourcesDirective, // 业务组件
  // 专栏
  '/blogs/css': blogsCss, //CSS
  '/blogs/javaScript': blogsJavaScript, //javaScript
  '/blogs/network': blogsNetwork, //浏览器
  '/blogs/business': blogsBusiness, //应用场景
  '/blogs/framework': blogsFramework //应用场景
}
