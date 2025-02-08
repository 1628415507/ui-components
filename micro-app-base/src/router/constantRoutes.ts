/*
 * @Description: 固定的路由，跟用户权限无关的菜单，例如 404 页面、首页等
 * @Author: Hongzf
 * @Date: 2022-11-25 09:42:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-06 17:47:42
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue' // 引入布局页面

const constantRoutes: Array<RouteRecordRaw> = [
  // 基础布局
  // {
  //   path: '/home',
  //   component: Layout,
  //   // hidden: true,
  //   meta: { title: '首页', hidden: true },
  //   children: [
  //     {
  //       path: '/home',
  //       meta: { title: '', hidden: true },
  //       component: () => import('@/views/home/index.vue')
  //     }
  //   ]
  // },
  {
    path: '/',
    redirect: '/login',
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    // path: '/microChildApp/:appCode/:page*',
    path: '/microChildApp',
    name: 'MicroChildApp',
    meta: {  hidden: true },
    component: () => import('@/views/micro/childApp.vue')
  },
  // {
  // 替代vue2中的'*'通配符路径
  // { path: '/:pathMatch(.*)*', redirect: '/' }
]
export default constantRoutes
