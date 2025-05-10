import { withInstall } from '../../../utils/withInstall.ts';
import InputNumber from './src/index.vue'

export const ZInputNumber = withInstall(InputNumber)//给组件添加install方法
export default ZInputNumber

export * from './src/index.vue'
export * from './src/type';