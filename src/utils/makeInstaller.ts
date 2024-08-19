// makeInstaller 实际上也是一个vue插件，他将组件插件循环进行安装，也是从element-plus复制的
import type { App, Plugin } from 'vue';
export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    console.log(components);
    components.forEach((c) => app.use(c));
  };
  return {
    install,
  };
};