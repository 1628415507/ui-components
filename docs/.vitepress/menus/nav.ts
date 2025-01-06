/*
 * @Description:
 * @Date: 2024-06-27 16:50:06
 * @LastEditTime: 2025-01-06 15:52:10
 */
import { DefaultTheme } from 'vitepress';

// 顶部菜单
export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '指南', link: '/guide' },
  { text: '组件', link: '/examples' },
  // { text: '工具', link: '/tools' },
  {
    text: '实战',
    items: [
      {
        text: '业务组件',
        link: '/resources/businesscomp'
      },
      {
        text: '自定义指令',
        link: '/resources/directive'
      },
      // {
      //   text: '常用方法',
      //   link: '/tools/methods'
      // },
    ]
  },
  // {
  //   text: '组件',
  //   items: [
  //     {
  //       text: '基础组件',
  //       link: '/examples/base' 
  //     },
  //     {
  //       text: '业务组件',
  //       link: '/examples/business' 
  //     }
  //   ]
  // },
  // {
  //   text: '专栏',
  //   items: [
  //     {
  //       text: 'CSS',
  //       link: '/examples' // 对应docs/column/Algorithm下的idnex.md文件
  //     },
  //     {
  //       text: 'JavaScript',
  //       link: '/examples' // 对应docs/column/Algorithm下的idnex.md文件
  //     },
  //     {
  //       text: '方法',
  //       link: '/examples' // 对应docs/column/Algorithm下的idnex.md文件
  //     }
  //   ]
  // },
  // { text: '组件', link: '/markdown-examples' }
]
