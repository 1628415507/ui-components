/*
 * @Description:用于给vscode的volar插件提示组件的属性的类型
 * @Date: 2025-05-10 14:05:12
 * @LastEditTime: 2025-05-15 15:13:51
 */
declare module 'vue' {
  export interface GlobalComponents {
    // package.json里面的name
    ZInputNumber: (typeof import('z-ui-comp'))['ZInputNumber'];
    ZInputOrder: (typeof import('z-ui-comp'))['ZInputOrder'];
    ZInputDivider: (typeof import('z-ui-comp'))['ZInputDivider'];
    ZInputExpand: (typeof import('z-ui-comp'))['ZInputExpand'];
    ZAssociateSelect: (typeof import('z-ui-comp'))['ZAssociateSelect'];
    ZEditLabel: (typeof import('z-ui-comp'))['ZEditLabel'];
    ZExpandMore: (typeof import('z-ui-comp'))['ZExpandMore'];
    ZInfoCard: (typeof import('z-ui-comp'))['ZInfoCard'];
    ZPlusminusButton: (typeof import('z-ui-comp'))['ZPlusminusButton'];
    ZRowSteps: (typeof import('z-ui-comp'))['ZRowSteps'];
    ZVerticalSteps: (typeof import('z-ui-comp'))['ZVerticalSteps'];
    ZCountdown: (typeof import('z-ui-comp'))['ZCountdown'];
  }

  interface ComponentCustomProperties { }
}

