/*
 * @Description:
 * @Author: Hongzf
 * @Date: 2022-11-21 18:11:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-22 16:01:03
 */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// mock
import { viteMockServe } from 'vite-plugin-mock'
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV, VITE_APP_CONTEXT_PATH } = env
  return {
    // base: './', // 打包路径
    base: VITE_APP_CONTEXT_PATH,//`${process.env.NODE_ENV === 'production' ? 'http://my-site.com' : ''}/child-vite/`,
    // 插件
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => /^micro-app/.test(tag)
          }
        }
      }),
      // 自定义插件
      // (function () {
      //   let basePath = ''
      //   return {
      //     name: "vite:micro-app",
      //     apply: 'build',
      //     configResolved(config) {
      //       basePath = `${config.base}${config.build.assetsDir}/`
      //     },
      //     writeBundle(options, bundle) {
      //       for (const chunkName in bundle) {
      //         if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
      //           const chunk = bundle[chunkName]
      //           if (chunk.fileName && chunk.fileName.endsWith('.js')) {
      //             chunk.code = chunk.code.replace(/(from|import\()(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
      //               return all.replace($3, new URL($3, basePath))
      //             })
      //             const fullPath = join(options.dir, chunk.fileName)
      //             writeFileSync(fullPath, chunk.code)
      //           }
      //         }
      //       }
      //     },
      //   }
      // })(),
      // mock 数据的 dev环境
      viteMockServe({
        // supportTs: true, // 是否开启支持ts
        mockPath: 'mock', // 设置mockPath为根目录下的mock目录
        localEnabled: command === 'serve', // 设置是否监视mockPath对应的文件夹内文件中的更改
        logger: true // 是否在控制台显示请求日志
      })
    ],
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
      port: 8888, // 服务端口号
      open: true, // 服务启动时是否自动打开浏览器
      // cors: true ,// 允许跨域
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      // 代理
      // proxy: {
      //   // '/api': {
      //   //   target: 'http://localhost:8888',
      //   //   changeOrigin: true,
      //   //   rewrite: (path) => path.replace(/^\/api/, '')
      //   // }
      // }
    }
  }
})
