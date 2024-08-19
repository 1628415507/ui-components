/*
 * @Description: 
 * @Date: 2024-06-26 11:40:35
 * @LastEditTime: 2024-08-16 13:32:42
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import vueSetupExtend from 'vite-plugin-vue-setup-extend' // 在setup中使用vue3的语法
import viteCompression from 'vite-plugin-compression' // gzip静态资源压缩
import dts from 'vite-plugin-dts'//自动生成类型声明文件(*.d.ts)
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import vueJsx from '@vitejs/plugin-vue-jsx'

const resolve = (dir: string) => path.resolve(__dirname, '.', dir)

// https://blog.csdn.net/qq_63358859/article/details/133808112
// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      dts(),
      vueSetupExtend(),
      viteCompression({
        verbose: true,
        disable: false, // 不禁用压缩
        deleteOriginFile: false, // 压缩后是否删除原文件
        threshold: 10240, // 压缩前最小文件大小
        algorithm: 'gzip', // 压缩算法
        ext: '.gz', // 文件类型
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        // imports: ['vue'],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src')
      }
    },
    // 打包命令配置 这是一个包含构建选项的对象。
    build: {
      // outDir: 'lib',//打包输出的目录
      // 构建库的选项。
      lib: {
        // entry: path.resolve(__dirname, "src/index.ts"),//组件库打包和引入时的入口文件
        entry: path.resolve(__dirname, "src/index.ts"),//组件库打包和引入时的入口文件
        name: "z-ui-comp",//定义了组件库打包的名称
        fileName: (format) => `z-ui-comp.${format}.js`,//定义了输出文件的命名规则，使用了一个函数来生成不同格式的文件名
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ["vue"],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: "Vue",//这里将 "vue" 映射到 "Vue"，以确保在使用库时可以访问到 Vue.js。
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true,
      https: false,
      // proxy: {
      //   '^/mes': {
      //     target: `http://10.0.10.243:5000/mesv2/`,
      //     changeOrigin: true,
      //     rewrite: (p) => p.replace(/^\/mes/, ''),
      //   },
      //   '^/portal-user': {
      //     target: `http://10.0.10.240:8172`,
      //     changeOrigin: true,
      //     rewrite: (p) => p.replace(/^\/portal-user/, '/portal-user'),
      //   },
      //   '^/portal-sso': {
      //     target: `http://10.0.10.240:8171`,
      //     changeOrigin: true,
      //     rewrite: (p) => p.replace(/^\/portal-sso/, '/portal-sso'),
      //   },
      // },
    }
  }
})
