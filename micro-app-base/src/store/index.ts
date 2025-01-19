/*
 * @Description: vuex相关配置
 * @Author: Hongzf
 * @Date: 2022-11-21 18:51:07
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-11-29 18:09:20
 */
import { createStore, Store } from 'vuex'
// 引入模块
import { store as app, AppState } from '@/store/modules/app' // 引入app文件模块
import { store as test, CountState } from '@/store/modules/test' // 引入test 文件模块

// 定义数据类型
export interface RootState {
  app: AppState
  test: CountState
}
// 创建一个store实例TODO:TS
export const store: Store<RootState> = createStore({
  modules: {
    app,
    test
  }
})

export function useStore() {
  return store
}
