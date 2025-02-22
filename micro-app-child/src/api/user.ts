/*
 * @Description: 用户相关的接口
 * @Author: Hongzf
 * @Date: 2022-12-01 18:18:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-22 17:58:39
 */
import request from '@/utils/request'
const menuData = [
  // 首页
  {
    resourceUrl: '/home',
    component: 'home/index',
    // redirect: '/home', // 重定向到第一个菜单
    resourceTitle: '首页'
    // childrenResourceList: [
    //   {
    //     resourceUrl: '/home',
    //     resourceTitle: '',
    //     component: '/home/index'
    //   }
    // ]
  },
  // demo
  {
    resourceUrl: '/demo',
    redirect: '/router', // 重定向到第一个菜单
    component: '',
    resourceTitle: '测试 demo',
    childrenResourceList: [
      {
        resourceUrl: '/router',
        resourceTitle: '路由-demo',
        component: '/demo/router-demo'
      },
      {
        resourceUrl: '/store',
        resourceTitle: 'Store-demo',
        component: 'demo/store-demo'
      },
      {
        resourceUrl: '/request',
        name: 'Request',
        resourceTitle: '请求-demo',
        component: 'demo/http-demo'
      }
    ]
  }
]

// 登录
export function login(data: Object) {
  return new Promise((resolve, reject) => {
    const res = {
      code: 200,
      data: menuData
    }
    resolve(res)
  })
  // return request({
  //   url: '/mock/api/login',
  //   // url: '/lvscm-security/login',
  //   method: 'post',
  //   data
  //   // : {
  //   //   username: 'admin',
  //   //   password: '654321',
  //   //   clientId: 'wl-train-xzt', // process.env.VUE_APP_CLIENT_ID,
  //   //   checkMoveId: ' ',
  //   //   xWidth: 0
  //   // }
  // })
}

// TODO:退出登录

// 获取菜单
export function queryResource() {
  return new Promise((resolve, reject) => {
    const res = {
      code: 200,
      data: {
        accessToken: '123'
      }
    }
    resolve(res)
  })
  // return request({
  //   url: '/mock/api/queryResource',
  //   // url: '/lvscm-security/login',
  //   method: 'get'
  //   // data
  // })
}
