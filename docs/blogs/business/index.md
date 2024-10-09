<!--
 * @Description: https://gitee.com/yanleweb/interview-question/issues/I7W2KU
 * @Date: 2024-08-23 16:04:10
 * @LastEditTime: 2024-10-08 16:48:05
-->

# 业务场景

<!-- 1. ⽤⼾访问**系统1** 的受保护资源，系统 1 发现⽤⼾未登录，跳转⾄ **sso 认证中⼼**，**并将⾃⼰的地址作
为参数**
2. sso认证中⼼ 发现⽤⼾未登录，将⽤⼾引导⾄**登录⻚⾯**
3. ⽤⼾输⼊⽤⼾名密码提交登录申请
4. sso 认证中⼼校验⽤⼾信息，创建⽤⼾与 sso 认证中⼼之间的会话，称为全局会话，同时创建授权
令牌
5. sso 认证中⼼**带着令牌跳转会最初的请求地址**（系统 1）
6. 系统 1 拿到令牌，去 sso 认证中⼼校验令牌是否有效
7. sso 认证中⼼校验令牌，返回有效，注册系统 1
8. 系统 1 使⽤该令牌创建与⽤⼾的会话，称为局部会话，返回受保护资源
9. ⽤⼾访问**系统 2** 的受保护资源
10. 系统 2 发现⽤⼾未登录，跳转⾄ **sso 认证中⼼**，并将⾃⼰的地址作为参数
11. sso 认证中⼼发现⽤⼾已登录，**跳转回系统 2 的地址，并附上令牌**
12. 系统 2 拿到令牌，去 sso 认证中⼼校验令牌是否有效
13. sso 认证中⼼校验令牌，返回有效，注册系统 2
14. 系统 2 使⽤该令牌创建与⽤⼾的局部会话，返回受保护资源 -->

## 1. Web ⽹⻚如何禁⽌别⼈移除⽔印

- `MutationObserver` 可以观察 DOM 树的变化，并在变化发⽣时触发回调函数。
- 可以在回调函数中使用`mutation.removedNodes`检查是否有⽔印被删除，
- MutationObserver API 是现代浏览器提供的功能，在⽼旧的浏览器中可能不⽀持。因此，在实际使⽤时，需要注意对浏览器的兼容性进⾏测试和处理。
  ::: example
  blogs/business/watermark
  :::

## 2. JS 执⾏ 100 万个任务， 如何保证浏览器不卡顿？

- 浏览器主线程一次只能处理一个任务（任务按照队列执行）,当遇到长任务（执行超过 50 毫秒，就会被称为长任务(Long Task)）时，需要等长任务执行完才能进行下一步操作，这个过程就会造成阻塞

```html{25}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>普通长任务示例</title>
    <style></style>
  </head>
  <body>
    <script>
      // 主线程代码
      let body = document.querySelector('body') //获取某个真实的dom元素
      const params = { start: 0, end: 100000 }
      // --------------- 主线程长任务 Start---------------
      function longTask() {
        const { start, end } = params
        let sum = 0
        for (let i = start; i <= end; i++) {
          console.log('【 主线程长任务... 】-39')
          sum += i
        }
        let div = document.createElement('div')
        div.innerHTML = '主线程长任务完成:' + sum
        body.appendChild(div)
      }
      longTask() // 执行长任务
      // --------------- 主线程长任务 End---------------
      // -- 主线程任务
      let mainDiv = document.createElement('div')
      mainDiv.innerHTML = '主线程任务'
      body.appendChild(mainDiv)
    </script>
  </body>
</html>

```

### 方案 1：web worker 越过主线程阻塞问题

- 详见`docs\examples\blogs\business\longTask\web-worker`
- `web worker`是**运行在 Main 线程之外的一个线程**，叫做 worker 线程。我们可以把一些计算量大的任务放到 worker 中去处理。
  ```html{14,16,18}
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>web worker示例</title>
      <style></style>
    </head>
    <body>
      <script>
        // 主线程代码
        let body = document.querySelector('body') //获取某个真实的dom元素
        const params = { start: 0, end: 100000 }
        // --------------- worker Start ---------------
        const worker = new Worker('./worker.js') // 创建一个新的Web Worker
        // 向子线程通过 postMessage 发送消息，
        worker.postMessage(params) //100000 向Web Worker发送消息
        // 通过 onmessage 监听子线程返回的数据。
        worker.onmessage = function (event) {
          const result = event.data
          let div = document.createElement('div')
          div.innerHTML = '子线程任务完成：' + result
          body.appendChild(div)
          console.log('子线程任务完成：', result)
        }
        // --------------- worker End ---------------
        // -- 主线程任务
        let mainDiv = document.createElement('div')
        mainDiv.innerHTML = '主线程任务'
        body.appendChild(mainDiv)
      </script>
    </body>
  </html>
  ```
- 适用于不需要实时通讯的场景
  ```js{10}
  // worker.js
  onmessage = function (event) {
    console.log('【 onmessage 】-2', '子线程任务开始')
    const { start, end } = event.data
    let sum = 0
    for (let i = start; i <= end; i++) {
      sum += i
    }
    setTimeout(() => {
      postMessage(sum) // 任务完成向主线程发送消息
    }, 3000)
  }
  ```
- 如果需要实时通信结果，依然会被卡死
  ```js{7}
  // worker.js
  onmessage = function (event) {
  const { start, end } = event.data
  let sum = 0
    for (let i = start; i <= end; i++) {
      sum = i + 1
      postMessage(sum) // 实时向主线程发送消息，依然会被卡死
    }
  }
  ```

### 方案 2：（推荐）利用 requestAnimationFrame 实现任务调度

#### 一个 100 万个函数硬执行

- 详见`docs\examples\blogs\business\longTask\requestAnimationFrame\test.html`
- 执行下面的代码，页面会一直处于卡顿，然后最后结果闪出来

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>一个 100 万个函数硬执行</title>
  </head>
  <body>
    <p id="result"></p>
    <script>
      const $result = document.getElementById('result')
      /* ==============================  长任务 - Start ============================== */
      const bigArray = Array.from({ length: 1000000 }, (_, i) => i + 1)
      // 定义一个处理函数，例如对数组中的每个元素进行平方操作
      function processChunk(chunk) {
        return `chunk: ${chunk}`
      }

      for (const item in bigArray) {
        $result.innerText = processChunk(item)
      }
      //  ==============长任务 - End ================
    </script>
  </body>
</html>
```

#### [使用 chunkSize 来对长任务进行切分](https://blog.csdn.net/qq_53109172/article/details/135320963).

- `requestAnimationFrame(callback)`触发的时机是**浏览器在下次重绘之前调用指定的回调函数更新动画**
- `cancelAnimationFrame`：取消 requestAnimationFrame 执行
- 在大多数遵循 W3C 建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配，这个时间取决于当前电脑的刷新率，如果为**60Hz（1s 执行 60 次，每次消耗时间是 16.7ms 左右）**，如果是 120Hz 那就是 8.3ms 执⾏⼀次
- requestAnimationFrame() 运行在后台标签页或者隐藏的 `<iframe>` 里时，会被**暂停调用**以提升性能和电池寿命
- requestAnimationFrame 也是个定时器，它的执行是一次性的，也属于**宏任务**，但不同于 setTimeout ，它的时间不需要⼈为指定，这个时间取决于当前电脑的刷新率，如果是 60Hz ，那么就是 16.7ms 执⾏⼀次，

```html{26,31,35,37,41}
 <!-- 详见`docs\examples\blogs\business\longTask\requestAnimationFrame\3.processArrayWithDynamicChunkSize.html` -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>使用 chunkSize动态 来对长任务进行切分</title>
  </head>

  <body>
    <p id="result"></p>
    <script>
      const $result = document.getElementById('result')
      const bigArray = Array.from({ length: 1000000 }, (_, i) => i + 1) // 假设有一个包含大量元素的数组
      let index = 0
      // 定义业务处理函数，对数组中的每个元素执行一次
      function bizTask() {
        if (index < bigArray.length) {
          const result = `chunk: ${bigArray[index]}`
          $result.innerText = result
          index++
        }
      }
      let chunkSize = 1000 // 初始的 chunkSize
      // 动态调整 chunkSize 的优化方式
      function processArrayWithDynamicChunkSize() {
        function processChunkWithRAF() {
          const startTime = performance.now() // 记录每次轮询的开始时间
          // 每chunkSize一个轮询
          for (let i = 0; i < chunkSize; i++) {
            bizTask() //业务任务
          }
          const endTime = performance.now() // 记录每次轮询的结束时间
          const timeTaken = endTime - startTime // 计算处理时间
          // 根据处理时间动态调整 chunkSize
          if (timeTaken > 16) {
            chunkSize = Math.floor(chunkSize * 0.9) // 减小10%，如果处理时间超过一帧的时间（16毫秒），则减小 chunkSize
          } else if (timeTaken < 16) {
            chunkSize = Math.floor(chunkSize * 1.1) // 增加10% （如果处理时间远小于一帧的时间（8毫秒），则增加 chunkSize）
          }
          // 开始下一个轮询
          if (index < bigArray.length) {
            requestAnimationFrame(processChunkWithRAF) // 第n次轮询，继续处理下一个小块
          }
        }
        requestAnimationFrame(processChunkWithRAF) // 第1次轮询：开始处理大数组
      }
      // 开始调用
      processArrayWithDynamicChunkSize()
    </script>
  </body>
</html>
```

## 3. 虚拟混动加载原理及实现

### 前置知识点

| 分支                               | 说明                                                         |     |
| ---------------------------------- | ------------------------------------------------------------ | --- |
| clientHeight                       | 获取屏幕可视区域的高度                                       |     |
| clientWidth                        | 获取屏幕可视区域的宽度                                       |     |
| offsetTop                          | 元素相对于文档顶部的高度。                                   |     |
| document.documentElement.scrollTop | 浏览器窗口顶部与文档顶部之间的距离，也就是滚动条滚动的距离。 |     |

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/9f4c4b681b2a49dbb1aa980fe8fc5f87~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP6I2J5byA6Iqx:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNjE2MjA1Mjg1MDY1MjA4In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724723528&x-orig-sign=%2BVkJnxWIB2JfM280LLZJJDzWGlw%3D)

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/5bab161be9b749aeaac7e59c7b9091a3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP6I2J5byA6Iqx:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNjE2MjA1Mjg1MDY1MjA4In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724723755&x-orig-sign=GgBBRBgMGC7a%2BOGhTrGKkZAoMjM%3D)

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/84fd23b803b64ecb89c01fa78921b09c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP6I2J5byA6Iqx:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNjE2MjA1Mjg1MDY1MjA4In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724723780&x-orig-sign=ivoR%2BcQjZXJBPRyBC55pcO6lhBY%3D)

### 虚拟滚动的核心原理

- 虚拟滚动的核心原理是**仅渲染用户可视范围内的列表项**，以此减少 DOM 操作的数量和提高性能。
- 实现虚拟滚动
  - 监听滚动事件，了解当前滚动位置。
  - 根据滚动位置计算当前应该渲染哪些列表项目（即在视口内的项目）。
  - 只渲染那些项目 ，并用占位符（比如一个空的 div）占据其它项目应有的位置，保持滚动条大小不变。
  - 当用户滚动时，重新计算并渲染新的项目。

## 4. [DocumentFragment](https://github.com/pro-collection/interview-question/issues/722)

> 详见`docs\examples\blogs\business\documentFragment.html`

DocumentFragment 是 Web API 中的一部分，它是 DOM （文档对象模型）的一个非常轻量级的节点，代表一组 DOM 节点的集合。

- 它不是一个真实存在于 DOM 中的实体
- 通常用来作为**临时**的 DOM 节点仓库。
- 一旦整个 DocumentFragment 插入到 DOM 的一个**永久节点**上，那么在 DocumentFragment 内进行的更改将会触发 DOM 的重新渲染。

### DocumentFragment API 有几个关键的特点和用途：

- 轻量级：DocumentFragment 不会引起布局重排，因为其不是真实渲染的一部分。
- 节点集合：可以在 DocumentFragment 中节点集合进行分组，这个集合可以一次性插入到 DOM 的某一部分中。
- 性能优化：通过在一个 DocumentFragment 中构建好一大块 DOM 树，然后将它整体插入到主 DOM 中，从而减少重排次数，提高效率。
- 事件不冒泡：因为 DocumentFragment 不是真实渲染的一部分，所以它的事件不会冒泡到上层的 DOM 元素，除非它被插入到了 DOM 中。

### 使用场景

以下是一些使用 DocumentFragment 的常见场景：

- 批量操作：当你想要一次性添加多个节点到 DOM 树中时，使用 DocumentFragment 可以将这些节点预先堆放在一个轻量级对象中，然后一次性添加。
- 离屏操作：如果你需要创建复杂的 DOM 结构，可以通过 DocumentFragment 在不触发页面重排和重绘的情况下进行。
- 内容填充：在填充 DOM 元素内容之前，可以先创建一个 DocumentFragment 完成所有节点的添加和排序，然后把它添加到 DOM 树中。
- 避免内存泄漏：在某些情况下，它可以作为防止因移动节点而造成的内存泄漏的一个办法。

## 5. 在表单校验场景中， 如何实现⻚⾯视⼝滚动到报错的位置

> 详见`docs\examples\blogs\business\validationForm.html`

- 滚动指定位置：`element.scrollIntoView({ block: "center", behavior: "smooth" }); `

## 6. [检测网页是否为空闲状态](https://www.jb51.net/javascript/318807ud9.htm)

> 详见`docs\examples\blogs\business\检测网页是否为空闲状态`

1. 监听⿏标移动事件 `mousemove` ；
2. 监听键盘按下事件 `mousedown` ；
3. 监听页面隐藏情况 `visibilitychange` ；
4. 在⽤⼾进⼊⽹⻚后，设置延时跳转，如果触发以上事件，则移除延时器，并重新开始。

## 7. axios 请求超时⾃动重新请求

<!-- - 详见`docs\examples\blogs\business\fetchWithRetries.ts`
https://zhuanlan.zhihu.com/p/668882474 -->

```js{5,6,15,17,25,33}
import axios from 'axios'
const request = axios.create({
  baseURL: globalParamsEnv?.BASE_API || 'http://192.168.11.79/',
  timeout: 1000,
  retry: 2, // 重新请求次数
  retryInterval: 1000 // 重新请求间隙
})
request.interceptors.response.use(
  (res) => {
    // ...请求成功
  },
  (resp) => {
    // ...
    //如果配置不存在或重试属性未设置，抛出promise错误
    if (!config || !config.retry) return Promise.reject(error)
    //设置⼀个变量记录重新请求的次数
    config.retryCount = config.retryCount || 0
    // 检查重新请求的次数是否超过我们设定的请求次数
    if (config.retryCount >= config.retry) {
      return Promise.reject(resp)
    }
    //重新请求的次数⾃增
    config.retryCount += 1
    // 创建新的Promise来处理重新请求的间隙
    let back = new Promise(function (resolve) {
      console.log('接⼝' + config.url + '请求超时，重新请求', config.retryCount)
      setTimeout(function () {
        resolve()
      }, config.retryInterval || 1)
    })
    //返回axios的实体，重试请求
    return back.then(function () {
      return request(config)
    })
  }
)
```

## 8. [前端⽇志埋点 SDK 设计思路](https://zhuanlan.zhihu.com/p/497413927)

### （1）StatisticSDK 方法实现

#### 数据发送方法 `navigator.sendBeacon()`

- navigator.sendBeacon() ⽅法会在后台异步地发送数据，不会阻塞⻚⾯的其他操作,即使⻚⾯正在卸载或关闭，该⽅法也可以继续发送数据，确保数据的可靠性。
- navigator.sendBeacon() ⽅法⽀持**跨域**发送数据。
- navigator.sendBeacon() ⽅法发送的数据是以 **POST 请求**的形式发送到服务
  器
  ::: example
  blogs/business/SDK/index
  :::

```js{15,25,33,44,57}
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

### （2）组件错误上报

- 错误组件示例`ErrorCapturedDemo.vue`

```vue{7}
<template>
  <div>
    <div>我是子组件：组件渲染报错时会被父组件的onErrorCaptured捕获</div>
  </div>
</template>
<script setup>
handlePromiseError2() //运行未申明的方法
</script>
```

#### 全局挂载挂载`errorHandler`

```js{5,7,10}
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
  console.error('【 全局-组件渲染报错处理 】-116', error, vm, info)
}
```

#### 组件内部处理`onErrorCaptured`

- 当引用的**子组件**渲染错误时才会走 onErrorCaptured
- 自身的渲染错误不会走 onErrorCaptured

```vue{5,9}
<template>
  <ErrorCapturedDemo></ErrorCapturedDemo>
</template>
<script setup>
import { onMounted, onErrorCaptured } from 'vue'
import ErrorCapturedDemo from './ErrorCapturedDemo.vue'

// 子组件渲染错误处理
onErrorCaptured((error, vm, info) => {
  console.error('【 子组件-渲染错误 】-47', error, vm, info)
  window.insSDK.error('error', { ...error, remark: '子组件渲染错误' })
  return false
})
</script>
```
## [indexedDB](https://deepinout.com/javascript/javascript-questions/110_hk_1709940124.html)
- open方法返回一个IDBOpenDBRequest对象，同时这是一个**异步**操作，open操作并不会立马打开数据库或者开启事务，我们可以通过监听`request`的事件来进行相应的处理。
- `open(name,version)`：open方法传入两个参数，第一个参数是数据库的名字，第二个参数是数据库的版本号(**整数**)。
- 当你创建或升级一个现有的数据库版本的时候，将会触发一个`onupgradeneeded`事件，并在事件中传入`IDBVersionChangeEvent`，我们可以通过event.target.result来获取到IDBDatabase对象，然后通过这个对象来进行数据库的版本升级操作

::: example
blogs/business/indexedDB/index
:::
