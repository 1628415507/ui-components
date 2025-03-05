# [前端埋点监控 SDK 设计思路](https://zhuanlan.zhihu.com/p/497413927)

## SDK 需求与设计

### 需求

- ⾃动化上报 **⻚⾯ PV、UV**，如能⾃动化上报 **⻚⾯性能**，⽤⼾**点击路径**⾏为等；
- ⾃动上报 **⻚⾯异常**；
- 发送埋点信息的时候，不影响性能，不阻碍⻚⾯主流程加载和请求发送；
- 能够 **⾃定义**⽇志发送， ⽇志 scope、key、value。

### 设计

- SDK 初始化
- 数据发送
- ⾃定义错误上报
- 初始化错误监控
- ⾃定义⽇志上报

## 实现 StatisticSDK 方法

### 1. 定义数据发送方法

- [`Navigator.sendBeacon`](https://zhuanlan.zhihu.com/p/699561796) 是一个用于**发送少量数据**到服务器的 API，尤其适用于在**页面即将卸载时**发送数据，如日志记录、用户行为分析等
- 使用`navigator.sendBeacon()`发送数据的优点
  |优点|描述|
  |----|----|
  |支持异步操作|会在后台异步地发送数据，不会阻塞⻚⾯的其他操作，<br>即使⻚⾯正在卸载或关闭，该⽅法也可以**继续**发送数据，确保数据的可靠性。|
  |⽀持跨域|⽀持跨域发送数据|
  |支持 `POST` 请求|发送的数据是以 POST 请求的形式发送到服务器|

```js{3,9}
function send(query = {}, url) {
  // 组装发送的参数
  let data = new URLSearchParams()
  data.append('productID', this.productID)// 项目id
  for (const [key, value] of Object.entries(query)) {
    data.append(key, value)
  }
  // 发送数据
  navigator.sendBeacon(url || this.baseURL, data)
}
```

### 2. 定义⽤⼾⾏为⽇志上报方法

- 捕捉用户的点击事件

```js{2,5}
function event(key, value = {}) {
  this.send({ event: key, ...value }, this.eventURL)
}
// 使用
window.insSDK.event('click', { remark: '点击了按钮' })
```

### 3. 定义 PV、UV 方法

- PV：页面访问次数
- UV：页面访问人数

```js
function pv() {
  this.event('pv')
}
```

### 4. 定义性能上报方法

- 比如页面加载时间、白屏时间等
  ||描述|
  |---|---|
  |`FP`(firstPaint)|页面首次渲染时间|
  |`DCL`(DOMContentEventLoad)|DOM 加载完成|

```js
function initPerformance() {
  this.send({ event: 'performance', performanceTiming: JSON.stringify(performance.timing) }, this.performanceURL)
}
```

### 5. 定义错误上报方法

- 错误捕获和上报的优先级：Vue 组件内部处理`onErrorCaptured`>Vue 全局挂载`app.config.errorHandler`> `window.addEventListener('error')`
- 若存在`onErrorCaptured`或`errorHandler`，`window.addEventListener('error')`将不会触发

```js{3,6}
function error(err, errInfo = {}) {
  const { message, stack } = err
  // 发送错误
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
```

错误上报分两类

#### (1)运⾏时报错

##### ① 组件内部错误捕获`onErrorCaptured`

- 当引用的**子组件**渲染错误时才会触发 `onErrorCaptured`，自身的渲染错误不会触发 `onErrorCaptured`
- 使用示例

```vue{9}
<!-- 错误组件ErrorCapturedDemo -->
<template>
  <div>
    <div>我是子组件：组件渲染报错时会被父组件的onErrorCaptured捕获</div>
  </div>
</template>
<script setup>
// 以下报错，会被onErrorCaptured或app.config.errorHandler捕获
handlePromiseError2() //运行未申明的方法
</script>
```

```vue{3,10,12}
<template>
  <!-- 引用错误组件 -->
  <ErrorCapturedDemo></ErrorCapturedDemo>
</template>
<script setup>
import { onMounted, onErrorCaptured } from 'vue'
import ErrorCapturedDemo from './ErrorCapturedDemo.vue'

// 捕获子组件的渲染错误
onErrorCaptured((error, vm, info) => {
  // 发送错误汇报
  window.insSDK.error('error', { ...error, remark: '子组件渲染错误' })
  return false
})
</script>
```

##### ② 组件全局渲染错误处理`errorHandler`

```js{5,7,10,11}
// src/index.ts
// ...
import { createApp } from 'vue'
import App from '@/App.vue'
import StatisticSDK from './StatisticSDK'

window.insSDK = new StatisticSDK('sdk-12345') //全局挂载
const app = createApp(App)
// 渲染错误处理
app.config.errorHandler = (error, vm, info) => {
  window.insSDK.event('error', { remark: '全局-组件渲染报错' })
}
```

##### ③ 运⾏时报错`addEventListener('error')`

- `dom` 操作错误与 `JS` 错误报警，也是常说的运⾏时报错，该类报错直接可以通过`addEventListener('error')`监控即可；

```js{1}
window.addEventListener('error', (error) => {
  console.log('【 代码运⾏时报错 】-44', error)
  this.error(error)// 发送错误
})

```

- 使用示例  
   点击按钮调用下面的方法会触发`addEventListener('error')`
  > 若存在`onErrorCaptured`或`errorHandler`，`window.addEventListener('error')`将不会触发

```js{2}
function handleError() {
  console.log('【 引用未声明的变量： 】-24', aa) //模拟代码错误
}
```

#### (2)Promise 内部抛出的错误？？

`Promise` 内部抛出的错误是⽆法被 error 捕获到的，这时需要⽤ `unhandledrejection` 事件

## 示例

::: example
blogs/framework/performance/SDK/index
:::

```js{15,22,25,33,44,57}
// StatisticSDK.js
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
      // console.log('【 StatisticSDK-运⾏时报错 】-44', error)
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
```
