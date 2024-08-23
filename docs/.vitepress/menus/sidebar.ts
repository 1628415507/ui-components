/*
 * @Description:左侧菜单
 * @Date: 2024-06-27 16:50:06
 * @LastEditTime: 2024-08-23 16:28:43
 */
import { sidebarExamples } from './sidebar/examples'  // 左侧菜单
import { sidebarGuide } from './sidebar/guide'  // 左侧菜单
import blogsBusiness from './sidebar/business'  // 左侧菜单

// 左侧菜单
export const sidebar = {
  '/guide': sidebarGuide,// 指南
  '/examples': sidebarExamples, // 组件示例
  // 专栏
  '/blogs/css': [
    {
      text: '写在前面',
      items: [
        { text: 'Readme', link: '/readme' },
        { text: '安装3', link: '/blogs/css/index.md' },
      ]
    }
  ],
  '/blogs/business': blogsBusiness,//应用场景
}
