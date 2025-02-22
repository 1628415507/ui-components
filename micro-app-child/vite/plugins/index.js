/*
 * @Description: 插件
 * @Date: 2025-02-08 15:58:38
 * @LastEditTime: 2025-02-22 18:01:07
 */
import vue from '@vitejs/plugin-vue'
// mock
import { viteMockServe } from 'vite-plugin-mock'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
// import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

export default function createVitePlugins(viteEnv, command) {
  const isBuild = command === 'build'
  const vitePlugins = [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => /^micro-app/.test(tag)
        }
      }
    }),
    // // 自定义插件
    // (function () {
    //   let basePath = ''
    //   return {
    //     name: "vite:micro-app",
    //     apply: 'build',
    //     configResolved(config) {
    //       basePath = `${config.base}${config.build.assetsDir}/`
    //     },
    //     writeBundle (options, bundle) {
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
  ]
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcon(isBuild))
  // vitePlugins.push(
  //   createStyleImportPlugin({
  //     resolves: [VxeTableResolve()]
  //   })
  // )
  vitePlugins.push(vueSetupExtend())
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  return vitePlugins
}
