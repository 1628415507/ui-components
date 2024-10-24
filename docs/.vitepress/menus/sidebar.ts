/*
 * @Description:左侧菜单
 * @Date: 2024-06-27 16:50:06
 * @LastEditTime: 2024-10-14 17:14:45
 */
import { sidebarExamples } from './sidebar/examples' // 左侧菜单
import { sidebarGuide } from './sidebar/guide' // 左侧菜单
import blogsBusiness from './sidebar/business' // 左侧菜单
import blogsCss from './sidebar/css' // 左侧菜单
import blogsJavaScript from './sidebar/javaScript' // 左侧菜单
import blogsFramework from './sidebar/framework' // 左侧菜单
import blogsNetwork from './sidebar/network' // 左侧菜单

// 左侧菜单
export const sidebar = {
  // 指南
  '/guide': sidebarGuide,
  // 组件库示例
  '/examples': sidebarExamples,
  // 专栏
  '/blogs/css': blogsCss, //CSS
  '/blogs/javaScript': blogsJavaScript, //javaScript
  '/blogs/network': blogsNetwork, //浏览器
  '/blogs/business': blogsBusiness, //应用场景
  '/blogs/framework': blogsFramework //应用场景
}
