/*
 * @Description: 插件
 * @Date: 2025-02-08 15:58:38
 * @LastEditTime: 2025-02-08 17:55:47
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
