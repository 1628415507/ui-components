/*
 * @Description: 方法
 * @Author: Hongzf
 * @Date: 2022-12-02 13:47:16
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-02 18:48:22
 */
import Layout from '@/layout/index.vue' // 引入布局页面
import { RouteRecordRaw } from 'vue-router'

interface asyncRoute {
  resourceUrl: string
  component: string
  resourceTitle: string
  icon?: string
  childrenResourceList: asyncRoute[]
}
// 遍历后台传来的路由字符串，转换为路由需要的组件对象,
// 最终渲染所需的格式参考src\router\asyncRoutes.ts，转换过程根据后台的数据自行修改
export function filterAsyncRoutes(routes: asyncRoute[], level = 1) {
  const res: any[] = []
  routes.forEach((routeItem: asyncRoute) => {
    console.log('【 routeItem 】-23', routeItem)
    // const iconUrl = routeItem.resourceLogo || require('@/assets/menu-icon/default_icon.png')
    const icon = '' // level === 1 ? iconUrl : '' // 图标
    let tmp: any // = {} // : RouteRecordRaw
    // 父级菜单没有子菜单
    if (level === 1 && !(routeItem.childrenResourceList && routeItem.childrenResourceList.length)) {
      console.log('【 父级菜单没有子菜单-routeItem 】-31', routeItem)
      tmp = {
        path: '/',
        component: Layout,
        redirect: routeItem.resourceUrl,
        children: [
          {
            path: routeItem.resourceUrl,
            component: () => import('@/views/' + routeItem.component + '.vue'),
            name: '', // routeItem.resourceTitle,
            meta: {
              title: routeItem.resourceTitle,
              icon
              // affix: true
            }
          }
        ]
      }
      console.log('【 tmp 】-31', tmp)
    } else {
      // 父级菜单有子菜单
      // tmp = {
      //   // ...routeItem,
      //   path: routeItem.resourceUrl,
      //   name: routeItem.resourceTitle,
      //   meta: { title: routeItem.resourceTitle, icon }
      //   // children: routeItem.childrenResourceList
      // }
      // 加载路由页面
      // if (routeItem.component) {
      //   if (routeItem.component === 'Layout') {
      //     // Layout组件特殊处理
      //     tmp.component = Layout
      //   } else {
      //     tmp.component = _import(routeItem.component)
      //   }
      // }
      // // 子菜单
      // if (tmp.children) {
      //   tmp.children = filterAsyncRoutes(tmp.children, level + 1)
      // }
    }
    res.push(tmp)
  })
  return res
}

function _import(file: string) {
  try {
    // import QRCode = require('./qrcode')
    // return () => import('@/views/' + file + '/index')
    return require('@/views/' + file + '.vue').default
  } catch (err) {
    console.error(err) // 当组件不存在时，不抛出异常阻塞网站
  }
}
