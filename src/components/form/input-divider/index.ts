/*
 * @Description: 使用withInstall封装了一下导入的组件，并默认导出
 * @Date: 2024-08-15 18:00:25
 * @LastEditTime: 2024-08-16 15:57:08
 */
import { withInstall } from '../../../utils/withInstall.ts'; // Check if the file path is correct
import InputDivider from './src/index.vue'

export const ZInputDivider = withInstall(InputDivider)
export default ZInputDivider
export * from './src/type.ts';
