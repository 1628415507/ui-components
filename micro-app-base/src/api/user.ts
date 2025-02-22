/*
 * @Description: 用户相关的接口
 * @Author: Hongzf
 * @Date: 2022-12-01 18:18:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-22 17:06:37
 */
import request from '@/utils/request'
// 登录
export function login(data: Object) {
  return request({
    url: '/mock/api/login',
    // url: '/lvscm-security/login',
    method: 'post',
    data
    // : {
    //   username: 'admin',
    //   password: '654321',
    //   clientId: 'wl-train-xzt', // process.env.VUE_APP_CLIENT_ID,
    //   checkMoveId: ' ',
    //   xWidth: 0
    // }
  })
}

// TODO:退出登录

// 获取菜单
export function queryResource() {
  return request({
    url: '/mock/api/queryResource',
    // url: '/lvscm-security/login',
    method: 'get'
    // data
  })
}
