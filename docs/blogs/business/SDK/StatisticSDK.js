class StatisticSDK {
  constructor(productID, baseURL) {
    console.log('【 StatisticSDK-初始化 】-3', productID, baseURL)
    this.productID = productID
    this.baseURL = baseURL
    this.performanceURL = '/sdk-performance' //接口路径 'http://performance/'
    this.errorURL = '/sdk-error'
    this.eventURL = '/sdk-event'
    //
    this.initErrorListenner() // 初始化错误监控
    this.initPerformance() //初始化性能上报
  }
  // 1.数据发送:使⽤navigator.sendBeacon 来发送请求
  send(query = {}, url) {
    console.log('【 StatisticSDK-数据发送 】-9', query)
    query.productID = this.productID
    let data = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      data.append(key, value)
    }
    navigator.sendBeacon(url || this.baseURL, data)
  }
  // 2.⽤⼾⾏为与⽇志上报
  event(key, value = {}) {
    this.send({ event: key, ...value }, this.eventURL)
  }
  // PV（页面访问次数）、UV（页面访问人数）
  pv() {
    this.event('pv')
  }
  // 3.性能上报（比如页面加载时间、白屏时间等。）
  initPerformance() {
    // 页面首次渲染时间FP(firstPaint)：
    // const {domLoading,navigationStart,domContentLoadedEventEnd,navigationStart}=performance.timing
    // const fp = domLoading - navigationStart
    // DOM加载完成：DCL(DOMContentEventLoad)
    // const dcl = domContentLoadedEventEnd-navigationStart
    // 图片、样式等外链资源加载完成：L(Load)=loadEventEnd-navigationStart
    console.log('【 initPerformance 】-27', performance.timing)
    this.send({ event: 'performance', performanceTiming: JSON.stringify(performance.timing) }, this.performanceURL)
  }
  // 4.错误上报
  error(err, errInfo = {}) {
    const { message, stack } = err
    this.send(
      {
        event: 'error',
        message,
        stack,
        ...errInfo
      },
      this.errorURL
    )
  }
  // 4-1.错误上报分两类
  initErrorListenner() {
    // console.log('【 StatisticSDK-错误上报 】-41')
    // ① 第1类：dom 操作错误与JS错误报警，也是常说的运⾏时报错，该类报错直接可以通过addEventListener('error')监控即可；
    window.addEventListener('error', (error) => {
      console.log('【 代码运⾏时报错 】-44', error)
      this.error(error)
    })
    // ② （待验证）第2类：Promise内部抛出的错误是⽆法被error捕获到的，这时需要⽤ unhandledrejection 事件。
    window.addEventListener('unhandledrejection', (event) => {
      console.log('【 StatisticSDK-Promise内部错误 】-44', event)
      this.error(new Error(event.reason), { type: 'unhandledrejection' })
    })
  }
}
export default StatisticSDK
