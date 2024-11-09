/*
 * @Description: 全局配置
 * @Date: 2024-06-26 16:30:11
 * @LastEditTime: 2024-08-22 16:41:25
 */
import DefaultTheme from 'vitepress/theme' // https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import '../assets/styles/index.scss'
// ===== 引入element-plus =====
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// import locale from 'element-plus/lib/locale/lang/zh-cn'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 图标并进行全局注册
// ===== 引入自定义组件 =====
// 本地调试
import ZUiComp from '../../../src/index.ts' // 引入自定义组件库中的所有组件
// 包测试：以下方式需要运行npm run build:zip打包才能引用到
// import ZUiComp from 'z-ui-comp'// 引入自定义组件库中的所有组件
// import 'z-ui-comp/style.css'

import { ExampleContainer } from '../customMdContainer' // 引入自定义md容器组件

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册ElementPlus
    app.use(ElementPlus, {
      locale: zhCn // 语言设置
    })
    // 注册所有图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
    // 全局注册组件库
    // app.use(ZUiComp, {})
    app.use(ZUiComp, {
      // 组件需要的配置参数名称
      env: {
        // VITE_API_IS_DECRYPT: import.meta.env.VITE_APP_ENCRYPT_ENABLED,
        // VITE_API_PARTNER_CODE: import.meta.env.VITE_APP_ENCRYPT_PARTNER_CODE,
        // VITE_API_DECRYPT_KEY: import.meta.env.VITE_APP_ENCRYPT_AES_KEY,
        // VITE_API_SECURITY_KEY: import.meta.env.VITE_APP_ENCRYPT_SECURET_KEY,
        // VITE_APP_CODE: import.meta.env.VITE_APP_CODE,
        // BASE_API: import.meta.env.VITE_APP_BASE_API,
        TOKEN_NAME_KEY: 'token',
        USER_ID_KEY: 'id',
        USER_CODE_KEY: 'name',
        COMPANY_CODE_KEY: 'currentCompanyCode'
      },
      // 项目的store数据
      store: {
        user: {
          token:
            'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5MWRmM2M1Mi1lNmM3LTRkMDEtYjIyNy01YzlkY2E2NjM1YmMiLCJpYXQiOjE3MjExMTA5MjgsImV4cCI6MTcyMTE0NjkyOCwic3ViIjoie1xuICBcInVzZXJJZFwiIDogXCI3MDA4MzU4MTAwOTk1MTQ1NzI4XCIsXG4gIFwidXNlckNvZGVcIiA6IFwiTElOUFlcIixcbiAgXCJ1c2VyTmFtZUNuXCIgOiBcIuael-actOa6kFwiLFxuICBcInVzZXJuYW1lXCIgOiBcIkxJTlBZXCIsXG4gIFwib2ZmaWNlSWRcIiA6IFwiMjk1MlwiLFxuICBcIm9mZmljZU5hbWVcIiA6IFwi5YyX5Lqs5YiG5YWs5Y-4XCIsXG4gIFwib2ZmaWNlQ29kZVwiIDogXCIwMTI3MDRcIixcbiAgXCJzZXR0bGVPZmZpY2VJZFwiIDogXCI3MTk1OTc4MDk4MTA0NTAwMjI0XCIsXG4gIFwic2V0dGxlT2ZmaWNlQ29kZVwiIDogXCIwMTk4MDRcIixcbiAgXCJzZXR0bGVPZmZpY2VOYW1lXCIgOiBcIuWMl-S6rOWIhuWFrOWPuDMzMzMzMzMzMzMzMzMzMzMzXCIsXG4gIFwib2ZmaWNlTWRtSWRcIiA6IFwiQkpBXCIsXG4gIFwiY29ycE1kbUlkXCIgOiBcIkJKQVwiLFxuICBcImNvcnBTaG9ydENvZGVcIiA6IFwiQkpBXCIsXG4gIFwiZGVwdE9mZmljZVwiIDogXCI3MTk1OTc5MTUyNDMwODkxMDA4XCIsXG4gIFwiaXNTdXBlckFkbWluXCIgOiBcIjFcIixcbiAgXCJ1c2VyTm9cIiA6IFwiMTIzXCJcbn0ifQ.jPmqaX9gL42wSGTZYOaLo1yLQRDqLWzpDAXBxCxRsj8',
          id: '7008358100995145728',
          name: 'LINPY',
          avatar: '/air/src/assets/images/profile.png',
          currentMicroAppCode: 'AIR',
          currentProjectCode: 'AIR-AE',
          currentProjectName: '空运出口',
          currentCompanyCode: 'BJA',
          createOrgId: '2952',
          createOrgCode: 'BJA',
          createOrgName: '北京分公司',
          settleOfficeId: '7195978098104500224',
          settleOfficeCode: 'BJA',
          settleOfficeName: '北京分公司',
          deptOfficeId: '7195979152430891008',
          deptOfficeCode: '004',
          deptOfficeName: '北方',
          tokenExpireDate: '2024-07-17 00:21:08'
        }
      }
    })
    // 全局注册示例模板组件
    app.component('ExampleContainer', ExampleContainer) //自定义示例模板
  }
} satisfies Theme
