/*
 * @Description: 将组件的默认导出，也就是经过withInstall处理的vue组件插件导入进来，封装成一个数组，给下面的入口文件使用
 * @Date: 2025-05-10 13:53:33
 * @LastEditTime: 2025-05-12 16:49:23
 */
// 表单控件
import ZInputNumber from './form/input-number';
import ZInputOrder from './form/input-order';
import ZInputDivider from './form/input-divider';

export default [ZInputDivider, ZInputOrder, ZInputNumber];
