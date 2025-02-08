/*
 * @Description:
 * @Author: Hongzf
 * @Date: 2022-11-21 18:11:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-08 17:56:58
 */
import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import createVitePlugins from './vite/plugins'
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV, VITE_APP_CONTEXT_PATH } = env
  console.log('【 VITE_APP_CONTEXT_PATH 】', VITE_APP_ENV, VITE_APP_CONTEXT_PATH)
  return {
    base: VITE_APP_CONTEXT_PATH,//`${process.env.NODE_ENV === 'production' ? 'http://my-site.com' : ''}/child-vite/`,
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // base: VITE_APP_ENV === 'production' ? VITE_APP_CONTEXT_PATH : VITE_APP_CONTEXT_PATH,
    // 插件
    plugins: createVitePlugins(env, command),
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src') // resolve('./src')
      }
    },
    // 配置公共样式文件
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/index.scss";'
        }
      }
    },
    server: {
      port: 3001, // 服务端口号
      open: true, // 服务启动时是否自动打开浏览器
      // 微前端，设置当前子应用支持跨域(vite默认开启跨域支持，不需要额外配置。)
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
      // cors: true ,// 允许跨域
      // 代理
      // proxy: {
      //   '/api': {
      //     target: 'http://dev.lvscm.lvscm-front-ui.dps.gillion.com.cn/lvscm-gateway/',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   }
      // }
    }
  }
})
