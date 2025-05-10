/*
 * @Description: 组件库入口文件，
// 在这个文件里，需要导出components.ts 里代理的vue组件和类型，
// 并将installs.ts 导出的插件数组交给makeInstaller 处理成一个支持整体导入的插件：
 * @Date: 2025-05-10 13:58:53
 * @LastEditTime: 2025-05-10 16:48:55
 */

import { makeInstaller } from './utils/makeInstaller';
import installs from './components/installs';
export * from './components/components';//y引入所有组件

export default makeInstaller([...installs]);