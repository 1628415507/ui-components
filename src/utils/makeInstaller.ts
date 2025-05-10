// makeInstaller 实际上也是一个vue插件，
// 他将组件插件循环进行安装，也是从element - plus复制的
import type { App, Plugin } from 'vue';
export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    // 将组件插件循环进行安装
    components.forEach((c) => app.use(c));
  };
  return {
    install,//返回一个install方法，将组件插件循环进行安装(
    // 作用: 处理成一个支持整体导入的插件)
  };
};