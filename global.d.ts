/*
 * @Description:用于给vscode的volar插件提示组件的属性的类型
 * @Date: 2025-05-10 14:05:12
 * @LastEditTime: 2025-05-10 14:32:19
 */
declare module 'vue' {
  export interface GlobalComponents {
    // package.json里面的name
    ZInputNumber: (typeof import('z-ui-comp'))['ZInputNumber'];
  }

  interface ComponentCustomProperties { }
}

