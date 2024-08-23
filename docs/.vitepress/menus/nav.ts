/*
 * @Description:
 * @Date: 2024-06-27 16:50:06
 * @LastEditTime: 2024-08-23 17:52:34
 */
import { DefaultTheme } from 'vitepress';

// 顶部菜单
export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '指南', link: '/guide' },
  { text: '组件', link: '/examples' },
  // {
  //   text: '工具',
  //   items: [
  //     {
  //       text: '指令',
  //       link: '/examples' // 对应docs/column/Algorithm下的idnex.md文件
  //     },
  //     {
  //       text: '方法',
  //       link: '/examples' // 对应docs/column/Algorithm下的idnex.md文件
  //     }
  //   ]
  // },
  {
    text: '专栏',
    items: [
      // {
      //   text: 'CSS',
      //   link: '/blogs/css' // 对应docs/column/Algorithm下的idnex.md文件
      // },
      {
        text: '业务场景',
        link: '/blogs/business' // 对应docs/column/Algorithm下的idnex.md文件
      },

      // {
      //   text: 'JavaScript',
      //   link: '/examples' // 对应docs/column/Algorithm下的idnex.md文件
      // },
      // {
      //   text: '方法',
      //   link: '/examples' // 对应docs/column/Algorithm下的idnex.md文件
      // }
    ]
  },
  // { text: '组件', link: '/markdown-examples' }
]
