/*
 * @Description:
 * @Author: Hongzf
 * @Date: 2022-12-01 18:21:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-20 20:38:26
 */
export const menuData = [
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
  // {
  //   resourceUrl: '/demo',
  //   redirect: '/router', // 重定向到第一个菜单
  //   component: '',
  //   resourceTitle: '测试 demo',
  //   childrenResourceList: [
  //     {
  //       resourceUrl: '/router',
  //       resourceTitle: '路由-demo',
  //       component: '/demo/router-demo'
  //     },
  //     {
  //       resourceUrl: '/store',
  //       resourceTitle: 'Store-demo',
  //       component: 'demo/store-demo'
  //     },
  //     {
  //       resourceUrl: '/request',
  //       name: 'Request',
  //       resourceTitle: '请求-demo',
  //       component: 'demo/http-demo'
  //     }
  //   ]
  // }
]

const userInterface = [
  {
    url: '/mock/api/login',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {
          accessToken: '123'
        }
      }
    }
  },
  {
    url: '/mock/api/queryResource',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: menuData
      }
    }
  },
  {
    url: '/mock/api/getAppInfo',
    method: 'get',
    response: () => {
      return {
        code: 200,
        resourceTitle: 'mock请求测试'
      }
    }
  }
]

export default userInterface
