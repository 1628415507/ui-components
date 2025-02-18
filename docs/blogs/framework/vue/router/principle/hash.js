
class VueRouter {
  constructor(routes = []) {
    this.routes = routes // 路由映射
    this.currentHash = '' // 当前的hash
    this.refresh = this.refresh.bind(this)
    // 监听页面加载load
    window.addEventListener('load', this.refresh, false)
    // 监听hashchange事件
    window.addEventListener('hashchange', this.refresh, false)
  }

  // 【hash路由切换时刷新页面】
  refresh(event) {
    console.log('【 refresh-路由切换 】-19', event)
    // URL hash发生改变的时候，拿到当前的hash
    let newHash = ''
    let oldHash = null
    if (event.newURL) {
      oldHash = getUrlPath(event.oldURL || '') // 旧的路由
      newHash = getUrlPath(event.newURL || '') // 新的路由
    } else {
      newHash = getUrlPath(window.location.hash)
    }
    console.log('【 newHash 】-30', newHash)
    this.currentHash = newHash
    this.matchComponent() // 匹配路由对应的页面
  }
  // 【匹配路由对应的页面】
  matchComponent() {
    let curRoute = this.routes.find((route) => route.path === this.currentHash)
    console.log('【 curRoute 】-91', curRoute)
    if (!curRoute) {
      // 当前URL中的hash不存在的时候，默认取第一个，当然真实场景下，可能会有各种情况，取决于业务逻辑
      curRoute = this.routes.find((route) => route.path === '/')
    }
    const { component } = curRoute
    document.querySelector('#content').innerHTML = component
  }
}
// 【获取路径】
function getUrlPath(url) {
  const index = url.indexOf('#')
  const hash = index >= 0 ? url.slice(index + 1) : '/' // 获取hash
  return hash
}