/*
 * @Description:
 * @Date: 2024-06-27 16:50:06
 * @LastEditTime: 2024-10-18 11:14:36
 */
//
import { DefaultTheme } from 'vitepress'
// 博客目录参考： https://www.kancloud.cn/surahe/front-end-notebook/482370
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
  //       link: '/examples' // 对应docs/column/Algorithm下的index.md文件
  //     },
  //     {
  //       text: '方法',
  //       link: '/examples' // 对应docs/column/Algorithm下的index.md文件
  //     }
  //   ]
  // },
  {
    text: '专栏',
    items: [
      // {
      //   text: 'HTML',
      //   link: '/blogs/css' // 对应docs/column/Algorithm下的index.md文件
      // },
      {
        text: 'HTML&CSS',
        link: '/blogs/css' // 对应docs/column/Algorithm下的index.md文件
      },
      {
        text: 'JavaScript',
        link: '/blogs/javaScript' // 对应docs/column/Algorithm下的index.md文件
      },
      {
        text: '计算机网络',
        link: '/blogs/network' // 对应docs/column/Algorithm下的index.md文件
      },
      {
        text: '前端框架', //算法。浏览器‘正则表达式
        link: '/blogs/framework' // 对应docs/column/Algorithm下的index.md文件
      },
      {
        text: '业务场景',
        link: '/blogs/business' // 对应docs/column/Algorithm下的index.md文件
      }
      // {
      //   text: '方法',
      //   link: '/examples' // 对应docs/column/Algorithm下的index.md文件
      // }
    ]
  }
  // { text: '组件', link: '/markdown-examples' }
]
