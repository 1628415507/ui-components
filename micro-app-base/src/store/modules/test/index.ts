/*
 * @Description: 计算模块
 * @Author: Hongzf
 * @Date: 2022-11-21 18:51:07
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 18:13:58
 */
// import { ActionTree, ActionContext } from 'vuex'
import { ActionTree, Module, MutationTree } from 'vuex'
import { RootState } from '@/store'

// 定义数据类型
export interface CountState {
  count: number
}
// 定义state
const state: CountState = {
  count: 0
}

// 定义mutations：同步修改数据， mutation内部的函数会把state作为参数，
const mutations: MutationTree<CountState> = {
  // 修改侧边栏的伸缩状态
  add(state: CountState, value) {
    // 我们直接操作state.count就可以完成数据的修改。
    state.count += 1
  }
}

// 定义actions：异步修改数据
const actions: ActionTree<CountState, RootState> = {
  asyncAdd({ commit }) {
    setTimeout(() => {
      commit('add') // 可以调⽤commit来执⾏mutations去更新数据。
    }, 1000)
  }
}

const getters = {
  double(state: CountState) {
    return 2 * state.count
  }
}
export const store: Module<CountState, RootState> = {
  // namespaced: true,
  state,
  mutations,
  actions,
  getters
}
export default store
