/*
 * @Description: 路由守卫设置/权限设置
 * （在项目开发中每一次路由的切换或者页面的刷新都需要判断用户是否已经登录）
 * @Author: Hongzf
 * @Date: 2022-11-28 16:02:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-02-07 16:05:11
 */
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import router from '@/router'
import { useStore } from '@/store'
import { getToken } from '@/utils/cookies' // get token from cookie

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // console.log('【 to.path 】-40', to.path, from.path)
    if (window.__MICRO_APP_ENVIRONMENT__) {
      console.log('【 处于微前端环境中 】-20', window.__MICRO_APP_ENVIRONMENT__)
    //   // console.log('microData?.childAppName---- air----')
    //   // console.log(microData)

    //   // if (microData?.appCode) {
    //   //   if (microData?.sourceAppCode) {
    //   //     handleMicroData(microData)
    //   //   }
    //   // } else if (globalData?.appCode) {
    //   //   if (globalData?.sourceAppCode) {
    //   //     handleMicroData(globalData)
    //   //   }
    //   // }
    }
    // 是否是登录页
    if (to.path === '/login') {
      next()
    } else {
      const hasToken = getToken()
      // console.log('【 hasToken 】-18', hasToken)
      // 判断是否登录
      if (hasToken) {
        const store = useStore()
        const routes = store.state.app.routes
        // 有路由，说明是正常跳转
        if (routes.length) {
          next()
        } else {
          // 没有路由，可能是刷新页面
          // vuex中的数据刷新之后会消失，所以刷新之后需重新获取路由菜单
          store.dispatch('ACTION_SET_ROUTES')
          // 重新获取并加入新的动态路由
          const dynamicRoutes = store.state.app.dynamicRoutes
          dynamicRoutes.forEach((route: RouteRecordRaw) => {
            router.addRoute(route)
          })
          console.log('【 页面刷新，重新请求动态路由菜单 】')
          // next()没有参数会出现页面空白的情况，解决办法参考：https://blog.csdn.net/i_am_father_for_/article/details/124870543
          next({ ...to, replace: true }) // next(to.path),强制重新跳转到目标路由（中断当前路由跳转，进行新的一次跳转）
        }
      } else {
        // TODO：弹框提示
        console.log('【 登录失效，请重新登录 】-47')
        next({ path: '/login', replace: true })
      }
    }
  }
)
