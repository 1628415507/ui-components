/*
 * @Description: markdown配置
 * @Date: 2024-06-26 16:30:11
 * @LastEditTime: 2024-09-27 14:07:34
 */
import { defineConfig } from 'vitepress'
import { mdPlugin } from './config/plugins' // 引入插件
import menus from './menus/index' // 菜单

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/ui-components/', //基本路径
  title: 'UI-COMPONENTS',
  description: '组件库文档',
  head: [
    ['link', { rel: 'icon', href: '/tiger.png' }] // 添加 favicon 链接
    // 其他配置...
  ],
  themeConfig: {
    logo: '/tiger.png', // 左上角-logo
    // https://vitepress.dev/reference/default-theme-config
    nav: menus.nav, //顶部菜单
    sidebar: menus.sidebar, //左侧菜单
    i18nRouting: true, //开启多语言
    socialLinks: [{ icon: 'github', link: 'https://gitee.com/sunshine365D/z-ui' }],
    //右侧锚点目录配置
    outline: {
      level: [2, 6], //只能配置2-6级标题
      label: '目录'
    },
    // 设置搜索框的样式
    search: {
      provider: 'local', //本地搜索
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    }
    // 页脚配置
    // footer: {
    //   copyright: 'Created in 2024'
    // }
  },
  markdown: {
    lineNumbers: true, //代码显示行号
    headers: {
      level: [0, 0]
    },
    // light: #f9fafb, dark: --vp-code-block-bg
    theme: { light: 'github-light', dark: 'github-dark' },
    config: (md) => mdPlugin(md) //解析vue文件
  }
})
