class VueRouter {
  constructor(routes = []) {
    this.routes = routes // 路由映射
    this.currentPath = '' // 当前的hash
    this.refresh = this.refresh.bind(this)
    history.pushState = this._wr('pushState')// 重写history.pushState
    history.replaceState = this._wr('replaceState')// 重写history.replaceState方法
    this.addEventListener()
    // 监听浏览器的前进后退改变
    window.onpopstate = (event) => {
      console.log('【 window.onpopstate 】-11')
      this.refresh(event)
    }
  }
  // 【重写history.pushState和history.replaceState方法】可以触发 window.addEventListener
  _wr(type) {
    let orig = history[type] //调用原来的history.pushState和history.replaceState方法
    return function () {
      let rv = orig.apply(this, arguments) // arguments为37行执行时传入的参数
      let e = new Event(type) // 创建函数
      e.arguments = arguments
      // 调用 dispatchEvent() 是触发一个事件的最后一步。
      // 被触发的事件应事先通过 Event() 构造函数创建并初始化完毕。
      window.dispatchEvent(e)
      return rv // 返回重写后的方法
    }
  }
  // 【添加事件监听】
  addEventListener() {
    window.addEventListener('load', this.refresh, false)
    // 给按钮添加事件
    this.routes.forEach((route) => {
      const target = document.querySelector(route.target)
      target.addEventListener('click', () => {
        history.pushState({ state: 1 }, null, route.path)// 因为pushState被重写了，所以这里触发的是重写的pushState
      })
    })
    // 通过监听pushState来获取路由变化
    window.addEventListener('pushState', (e) => {
      console.log('【 pushState 】-43', e)
      //监听pushState自定义事件，拿到上面通过pushState传入的参数，做出对应的页面渲染，
      this.refresh(e)
    })
  }
  // 【路由切换时刷新页面】
  refresh(event) {
    this.currentPath = getUrlPath()
    this.matchComponent() // 匹配路由对应的页面
  }
  // 【切换页面组件】
  matchComponent() {
    let curRoute = this.routes.find((route) => route.path === this.currentPath)
    if (!curRoute) {
      // 当前URL中的hash不存在的时候，默认取第一个，具体取决于业务逻辑
      curRoute = this.routes.find((route) => route.path === '/')
    }
    const { component } = curRoute
    document.querySelector('#content').innerHTML = component
  }
}
// 获取路由
function getUrlPath() {
  const path = window.location.pathname
  return path
}