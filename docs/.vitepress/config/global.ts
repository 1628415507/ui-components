/*
 * @Description: 全局变量设置
 * @Date: 2024-06-27 09:32:32
 * @LastEditTime: 2024-06-27 13:05:20
 */
import { resolve } from 'path'

// 项目目录
export const projRoot = resolve(__dirname, '..', '..', '..')

// 项目名称
export const docsDirName = 'docs'

// 文档库目录
export const docRoot = resolve(projRoot, docsDirName)

