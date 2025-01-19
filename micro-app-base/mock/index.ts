/*
 * @Description: 模拟数据接口
 * @Author: Hongzf
 * @Date: 2022-12-01 10:20:10
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 18:38:37
 */
// 导入用户相关的接口
import userInterface from './interface/user'
console.log('【 userInterface 】-10', userInterface)

// 导出所有接口
const allInterface = [...userInterface]
export default allInterface
