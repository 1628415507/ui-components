<!--
 * @Description: 
 * @Date: 2024-06-26 11:40:35
 * @LastEditTime: 2024-08-16 17:11:15
-->
## 参考文档
- 组件库搭建：https://www.cnblogs.com/wp-leonard/p/17894496.html
- 博客搭建：https://blog.csdn.net/WNX10086/article/details/137160521
## 组件库预览
- 执行`npm run docs:dev`

## 发布操作 npm
- 执行 npm run build
- 在 dist 文件夹下执行`npm init -y`,生成 package.json 文件
- 将 package-install.json 的内容复制到 package.json
  - 执行`npm version patch`命令行修改版本
  - 它会将 package.json 中的 version 版本加 0.0.1(npm 每次上传版本号要高于前一次版本号)
  - 自定义组件名(唯一，重名报错重新起一个就行),
- 在 dist 目录下打开 git， 执行 npm publish 发布或更新版本
  - 如果报错可能是版本号没有高于上一次的版本号
  - 首次上传报错可能是因为名称已存在，需要换个名称
  <!-- 其他 -->
## 若不发布操作 npm，而是打压缩包引入
 详见`docs\guide\installation.md`和`docs\guide\quickstart.md`

- 执行 npm run build:zip
- 打包完成后，将根目录下的package.json复制到dist目录中
  - 将复制的package.json中的`./dist/z-ui-comp.umd.js`改为`z-ui-comp.umd.js`
  - 将复制的package.json中的`./dist/z-ui-comp.es.js`改为`z-ui-comp.es.js`
- 在根目录下执行 `tar zcvf z-ui-comp.tar.gz -C ./dist .`打成压缩包
- 将打成的压缩包移到需要的项目目录下
- 在对应项目中执行 `npm install 压缩包地址`，解压到 node_modules 中 
  如 `npm install ./pkg/z-ui-comp.tar.gz`
- 全局引入组件库
```ts
  import ZUiComp from 'z-ui-comp'
  app.use(ZUiComp, {
    env: {
      // 根据实际项目传参
      // VITE_API_IS_DECRYPT: import.meta.env.VITE_APP_ENCRYPT_ENABLED,
      // VITE_API_PARTNER_CODE: import.meta.env.VITE_APP_ENCRYPT_PARTNER_CODE,
      // VITE_API_DECRYPT_KEY: import.meta.env.VITE_APP_ENCRYPT_AES_KEY,
      // VITE_API_SECURITY_KEY: import.meta.env.VITE_APP_ENCRYPT_SECURET_KEY,
      // VITE_APP_CODE: import.meta.env.VITE_APP_CODE,
      // BASE_API: import.meta.env.VITE_APP_BASE_API,
      // TOKEN_NAME_KEY: 'token',
      // USER_ID_KEY: 'id',
      // USER_CODE_KEY: 'name',
      // COMPANY_CODE_KEY: 'currentCompanyCode'
    },
    store: store.state.value
  })
```
# 其他
删除指定包版本
npm unpublish 【包名@版本号】

删除整个包
npm unpublish 【包名】 --force

<!-- ====================== -->
<!-- 
# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur

- Use [vue-tsc](https://github.com/vuejs/language-tools/tree/master/packages/tsc) for performing the same type checking from the command line, or for generating d.ts files for SFCs. -->
