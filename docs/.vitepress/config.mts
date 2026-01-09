/*
 * @Description: markdown配置
 * @Date: 2024-06-26 16:30:11
 * @LastEditTime: 2025-07-25 11:52:31
 */
import { defineConfig } from 'vitepress'
import { mdPlugin } from './config/plugins'  // 引入插件
import menus from './menus/index'  // 菜单
import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from 'path'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/ui-components/',//基本路径
  title: "UI-COMPONENTS",
  description: "组件库文档",
  head: [
    ['link', { rel: 'icon', href: '/ui-components/tiger.png' }]// 添加 favicon 链接
    // 其他配置...
  ],
  themeConfig: {
    logo: '/tiger.png', // 左上角-logo
    // https://vitepress.dev/reference/default-theme-config
    nav: menus.nav,//顶部菜单
    sidebar: menus.sidebar,//左侧菜单
    i18nRouting: true,//开启多语言
    socialLinks: [
      { icon: 'github', link: 'https://github.com/1628415507/ui-components' },
      { 
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>'
        }, 
        link: 'https://1628415507.github.io/ui-components/' 
      }
    ],
    //右侧锚点目录配置
    outline: {
      level: [2, 6],//只能配置2-6级标题
      label: '目录'
    },
    // 设置搜索框的样式
    search: {
      provider: "local",//本地搜索
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
    // 页脚配置
    // footer: {
    //   copyright: 'Created in 2024'
    // }
  },
  markdown: {
    lineNumbers: true,//代码显示行号
    headers: {
      level: [0, 0],
    },
    // light: #f9fafb, dark: --vp-code-block-bg
    theme: { light: 'github-light', dark: 'github-dark' },
    config: (md) => mdPlugin(md), //解析vue文件
  },
  // 以下为vitepress的mock数据配置（vite.config.ts中配置在vitepress中不生效，所以这里要单独再配一次）
  vite: {
    plugins: [
      viteMockServe({
        mockPath: 'mock', // 共享的 mock 目录
        localEnabled: true, // 开发环境启用
        prodEnabled: false, // 生产环境禁用
        logger: true,
        supportTs: true
      })
    ],
    resolve: {
      alias: {
        //     '@': resolve(__dirname, '../src'),
        '@mock': resolve(__dirname, '../../mock')
      }
    },
    server: {
      proxy: {
        '^/mock': {
          target: 'http://localhost:5173',
          changeOrigin: true
        }
      }
    }
  }
})
