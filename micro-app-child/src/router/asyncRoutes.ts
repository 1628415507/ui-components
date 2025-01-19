/*
 * @Description: 异步请求的路由（菜单列表的路由）
 * @Author: Hongzf
 * @Date: 2022-11-25 09:43:18
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-11-29 16:19:26
 */

import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue' // 引入布局页面

const asyncRoutes: Array<RouteRecordRaw> = [
  // 首页
  {
    path: '/home',
    component: Layout,
    redirect: '/home', // 重定向到第一个菜单
    meta: { title: '首页', hidden: true },
    children: [
      {
        path: '/home',
        meta: { title: '', hidden: true },
        component: () => import('@/views/home/index.vue')
      }
    ]
  },
  // demo
  {
    path: '/demo',
    redirect: '/router', // 重定向到第一个菜单
    component: Layout,
    meta: { title: '测试 demo', hidden: true },
    children: [
      {
        path: '/router',
        meta: { title: '路由-demo' },
        component: () => import('@/views/demo/router-demo.vue')
      },
      {
        path: '/store',
        meta: { title: 'Store-demo', hidden: true },
        component: () => import('@/views/demo/store-demo.vue')
      },
      {
        path: '/request',
        name: 'Request',
        meta: { title: '请求-demo', hidden: true },
        component: () => import('@/views/demo/http-demo.vue')
      }
    ]
  },
  // 测试多级菜单
  {
    path: '/level',
    redirect: '/level-1', // 重定向到第一个菜单
    component: Layout,
    meta: { title: '测试多级菜单', hidden: true },
    children: [
      {
        path: '/level-1',
        meta: { title: '菜单1-1' },
        component: () => import('@/views/demo/http-demo.vue')
      },
      {
        path: '/level-2',
        meta: { title: '菜单1-2' },
        redirect: '/level-2-1', // 重定向到第一个菜单
        component: () => import('@/views/demo/router-demo.vue'),
        children: [
          {
            path: '/level-2-1',
            meta: { title: '菜单1-2-1' },
            component: () => import('@/views/demo/router-demo.vue')
          },
          {
            path: '/level-2-2',
            meta: { title: '菜单1-2-2' },
            component: () => import('@/views/demo/router-demo.vue')
          }
        ]
      }
    ]
  }
  // {
  // 替代vue2中的'*'通配符路径
  // { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default asyncRoutes
