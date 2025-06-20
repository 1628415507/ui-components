/*
 * @Description:package.json说明文件
 * @Date: 2025-05-10 14:09:30
 * @LastEditTime: 2025-05-12 17:49:13
 */
const obj = {
  name: 'z-ui-comp', //npm包的名称
  version: '0.0.8', //npm包的版本
  description: '组件库练习', //npm包的描述
  type: 'module',
  scripts: {
    dev: 'vite',
    // build: 'vue-tsc && vite build', //执行的打包命令的文件路径
    build: 'gulp -f build/gulpfile.js', //执行的打包命令的文件路径
    'build:npm': 'vite build',
    preview: 'vite preview',
    'docs:dev': 'vitepress dev docs', //本地运行命令
    'docs:build': 'vitepress build docs',
    'docs:preview': 'vitepress preview docs'
  },
  files: ['dist'], //打包出来的文件夹名称
  main: './dist/z-ui-comp.umd.js', //组件库的入口文件
  module: './dist/z-ui-comp.es.js',
  // 用于测试打包后的文件导入：如docs中使用  import ZUiComp from "z-ui-comp";
  exports: {
    '.': {
      import: './dist/z-ui-comp.es.js',
      require: './dist/z-ui-comp.umd.js'
    },
    './style.css': './dist/style.css'
  },
  dependencies: {
    axios: '^1.7.2',
    'bignumber.js': '^9.3.0',
    chalk: '^5.3.0',
    consola: '^3.2.3',
    'crypto-js': '^4.2.0',
    echarts: '^5.5.1',
    'echarts-gl': '^2.0.9',
    'element-plus': '^2.6.3',
    'escape-html': '^1.0.3',
    'js-cookie': '^3.0.5',
    'markdown-it': '^14.1.0',
    'markdown-it-container': '^4.0.0',
    'normalize.css': '^8.0.1',
    prismjs: '^1.29.0',
    'vite-plugin-compression': '^0.5.1',
    'vite-plugin-vue-setup-extend': '^0.4.0',
    vue: '^3.4.21'
  },
  devDependencies: {
    '@types/node': '^20.12.2',
    '@vitejs/plugin-vue': '^5.0.4',
    faker: '^6.6.6',
    sass: '^1.72.0',
    typescript: '^5.2.2',
    'unplugin-auto-import': '^0.18.2',
    'unplugin-vue-components': '^0.27.3',
    vite: '^5.2.0',
    'vite-plugin-dts': '^4.0.2', //vite-plugin-dts 用来生成类型声明文件：
    vitepress: '^1.2.3',
    'vue-tsc': '^2.0.6',
    vuedraggable: '^4.1.0'
  }
}
