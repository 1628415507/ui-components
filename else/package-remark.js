// package.json注释解析
const packageRemark = {
  name: 'z-ui-comp', //node_modules包名
  version: '0.0.1',
  type: 'module',
  scripts: {
    dev: 'vite',
    build: 'vue-tsc && vite build',//加上vue-tsc ，ts语法错时会打包不成功
    'build:npm': 'vite build', //打成压缩包命令去除vue-tsc
    preview: 'vite preview',
    'docs:dev': 'vitepress dev docs', //组件库预览
    'docs:build': 'vitepress build docs',
    'docs:preview': 'vitepress preview docs'
  },
  files: ['dist'],
  main: './dist/z-ui-comp.umd.js', //入口文件
  module: './dist/z-ui-comp.es.js',
  exports: {
    '.': {
      import: './dist/z-ui-comp.es.js',
      require: './dist/z-ui-comp.umd.js'
    },
    // https://blog.csdn.net/u010973051/article/details/136229473
    './style.css': './dist/style.css' //可以单独引入css文件
  },
  dependencies: {
    axios: '^1.7.2',
    chalk: '^5.3.0',
    consola: '^3.2.3',
    'crypto-js': '^4.2.0',
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
    sass: '^1.72.0',
    typescript: '^5.2.2',
    'unplugin-auto-import': '^0.18.2',
    'unplugin-vue-components': '^0.27.3',
    vite: '^5.2.0',
    'vite-plugin-dts': '^4.0.2',
    vitepress: '^1.2.3',
    'vue-tsc': '^2.0.6'
  }
}
