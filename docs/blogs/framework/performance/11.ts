function error(err, errInfo = {}) {
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
function initErrorListenner() {
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
