/*
 * @Description:
 * @Date: 2024-06-27 16:50:06
 * @LastEditTime: 2024-08-22 17:14:25
 */
import { DefaultTheme } from 'vitepress';

// 顶部菜单
export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '指南', link: '/guide' },
  { text: '组件', link: '/examples' },
  {
    text: '工具',
    items: [
      {
        text: '指令',
        link: '/examples' // 对应docs/column/Algorithm下的idnex.md文件
      },
      {
        text: '方法',
        link: '/examples' // 对应docs/column/Algorithm下的idnex.md文件
      }
    ]
  },
  // { text: '组件', link: '/markdown-examples' }
]
// 左侧菜单
export const sidebar = {
  // 指南
  '/guide': [
    {
      text: '写在前面',
      items: [
        // { text: 'Readme', link: '/readme' },
        { text: '安装', link: '/guide/installation.md' },
        { text: '使用', link: '/guide/quickstart.md' },
        { text: 'Github Pages发布', link: '/guide/github-pages.md' },
        { text: 'Markdown 语法', link: '/guide/markdown-examples' },
        { text: 'API Examples', link: '/guide/api-examples' },
      ]
    }
  ],
  // 组件示例
  '/examples': [
    {
      text: '写在前面',
      items: [
        { text: 'Readme', link: '/readme' },
      ]
    },
    {
      text: 'Form 表单组件',
      items: [
        { text: 'Input Number 数字输入框', link: '/examples/input-number/doc.md' },
        { text: 'Input Divider 35字符分割线', link: '/examples/input-divider/doc.md' },
        { text: 'Input Expand 扩展输入框', link: '/examples/input-expand/doc.md' },
        { text: 'Input Order 单号输入框', link: '/examples/input-order/doc.md' },
        { text: 'Associate Select 联想控件', link: '/examples/associate-select/doc.md' }
      ]
    },
    {
      text: 'Data 数据展示',
      items: [
        { text: 'Expand More 展开更多', link: '/examples/expand-more/doc.md' },
        { text: 'Info Card 信息框', link: '/examples/info-card/doc.md' }
      ]
    },
    {
      text: 'Operation 操作交互',
      items: [{ text: 'Plusminus Button 加减按钮', link: '/examples/plusminus-button/doc.md' }]
    }]
}
