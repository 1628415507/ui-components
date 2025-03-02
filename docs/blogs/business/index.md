<!--
 * @Description: https://gitee.com/yanleweb/interview-question/issues/I7W2KU
 * @Date: 2024-08-23 16:04:10
 * @LastEditTime: 2024-11-18 13:30:23
-->

# 业务场景

<https://juejin.cn/post/7401060368087728166?searchId=202410142012222C5A2537F9C76AD11A25>

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

## 2. JS 执⾏ 100 万个任务， 如何保证浏览器不卡顿？

- 浏览器主线程一次只能处理一个任务（任务按照队列执行）,当遇到长任务（执行超过 50 毫秒，就会被称为长任务(Long Task)）时，需要等长任务执行完才能进行下一步操作，这个过程就会造成阻塞

### 普通长任务

- 执行之后页面会一直处于卡顿空白，然后最后结果闪出来
  ::: example
  blogs/business/longTask-长任务/web-worker/generalLongTask
  :::

### 方案 1：web worker 越过主线程阻塞问题

<!--
::: example
blogs/business/longTask-长任务/web-worker/webWorker
::: -->

- 详见`docs\blogs\business\longTask-长任务\web-worker\index.html`
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

#### [使用 chunkSize 来对长任务进行切分](https://blog.csdn.net/qq_53109172/article/details/135320963)

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

## [【检测网页是否为空闲状态】](https://www.jb51.net/javascript/318807ud9.htm)

1. 监听⿏标移动事件 `mousemove` ；
2. 监听⿏标按下事件 `mousedown` ；
3. 监听页面隐藏情况 `visibilitychange` ；
4. 在⽤⼾进⼊⽹⻚后，设置延时跳转，如果触发以上事件，则移除延时器，并重新开始。
   ::: example
   blogs/business/onIdleDetection/index
   :::

## 8. [前端⽇志埋点 SDK 设计思路](https://zhuanlan.zhihu.com/p/497413927)

### SDK 需求与设计

需求

- ⾃动化上报 ⻚⾯ PV、UV。 如果能⾃动化上报 **⻚⾯性能**， ⽤⼾**点击路径**⾏为等。
- ⾃动上报 **⻚⾯异常**。
- 发送埋点信息的时候， 不影响性能， 不阻碍⻚⾯主流程加载和请求发送。
- 能够 **⾃定义**⽇志发送， ⽇志 scope、key、value。

设计

- SDK 初始化
- 数据发送
- ⾃定义错误上报
- 初始化错误监控
- ⾃定义⽇志上报

### （1）StatisticSDK 方法实现

#### 数据发送方法 `navigator.sendBeacon()`

- 异步操作：`navigator.sendBeacon()`⽅法会在后台**异步**地发送数据，不会阻塞⻚⾯的其他操作，即使⻚⾯正在卸载或关闭，该⽅法也可以**继续**发送数据，确保数据的可靠性。
- ⽀持跨域：`navigator.sendBeacon()`⽅法⽀持**跨域**发送数据。
- `navigator.sendBeacon()`⽅法发送的数据是以 **POST 请求**的形式发送到服务
  器
  ::: example
  blogs/business/SDK/index
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

### （2）组件错误上报

- 错误捕获和上报的优先级:
  - 组件内部处理`onErrorCaptured`>全局挂载挂载`app.config.errorHandler`> window.addEventListener('error')
  - 若存在`onErrorCaptured`或`errorHandler`，`window.addEventListener('error')`将不会触发
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

## 大文件上传

### 分片上传

- 把⼤⽂件进⾏分段 ⽐如 10M，发送到服务器携带⼀个标志，**可以使⽤当前的时间戳，⽤于标识⼀个完整的⽂件**
- 服务端保存各段⽂件
- 浏览器端所有分⽚上传完成，发送给服务端⼀个合并⽂件的请求
- 服务端根据⽂件标识、类型、各分⽚顺序进⾏⽂件合并
- 删除分⽚⽂件
  ::: example
  blogs/business/largeFileUpload/upload
  :::
  详见`docs\examples\blogs\business\largeFileUpload\sliceUpload.js`

```js{4,6,15,16,17,18,23,39}
// 分片上传
export function sliceUpload(file) {
  const num = 10 //分⽚⼤⼩10M
  const chunkSize = num * 1024 * 1024 //10M
  let chunks = [], //保存分⽚数据
    fileTag = +new Date(), //使用时间戳，⽤于标识⼀个完整的⽂件
    name = file.name,
    chunkCount = 0, //分片总数
    sendChunkCount = 0 //已发送分片数
  // 超过大小进行文件拆分
  if (file.size > chunkSize) {
    let start = 0
    let end = 0
    //拆分⽂件
    while (end < file.size) {
      end += chunkSize //截取的结束位置
      let blob = file.slice(start, end) //切割分片
      start += chunkSize //截取的开始位置
      //截取的数据为空 则结束
      if (!blob.size) {
        break //拆分结束
      }
      chunks.push(blob) //保存分段数据
    }
  } else {
    chunks.push(file.slice(0))
  }
  chunkCount = chunks.length //分⽚的个数
  //没有做并发限制，较⼤⽂件导致并发过多，
  // tcp 链接被占光 ，需要做下并发控制，⽐如只有4个在请求在发送
  for (let i = 0; i < chunkCount; i++) {
    const fd = new FormData() //构造FormData对象
    fd.append('f1', chunks[i])
    fd.append('index', i)
    xhrSend(fd, function () {
      //保存分片成功的回调
      sendChunkCount += 1
      //上传完成，发送合并请求
      if (sendChunkCount === chunkCount) {
        console.log('上传完成，发送合并请求')
        var formD = new FormData()
        formD.append('type', 'merge')
        formD.append('fileTag', fileTag)
        formD.append('chunkCount', chunkCount)
        formD.append('filename', name)
        xhrSend(formD)
      }
    })
  }
}
// 发送请求
function xhrSend(fd, cb) {
  var xhr = new XMLHttpRequest() //创建对象
  xhr.open('POST', 'http://localhost:8100/', true)
  xhr.onreadystatechange = function () {
    console.log('state change', xhr.readyState)
    if (xhr.readyState == 4) {
      console.log(xhr.responseText)
      cb && cb()
    }
  }
  xhr.send(fd) //发送
}

//绑定提交事件
// document.getElementById('btn-submit').addEventListener('click', sliceUpload)

```

### 断点续传

详见`docs\examples\blogs\business\largeFileUpload\sliceUploadContinue.js`

```js{29,32,33,34,43,72,77}
// 断点续传
function sliceUpload(file) {
  const num = 10 //分⽚⼤⼩10M
  const chunkSize = num * 1024 * 1024 //10M
  let chunks = [], //保存分⽚数据
    fileTag = +new Date(), //使用时间戳，⽤于标识⼀个完整的⽂件
    name = file.name,
    chunkCount = 0, //分片总数
    sendChunkCount = 0 //已发送分片数
  // 超过大小进行文件拆分
  if (file.size > chunkSize) {
    //拆分⽂件
    let start = 0,
      end = 0
    while (end < file.size) {
      end += chunkSize //截取的结束位置
      let blob = file.slice(start, end) //切割分片
      start += chunkSize //截取的开始位置
      //截取的数据为空 则结束
      if (!blob.size) {
        break //拆分结束
      }
      chunks.push(blob) //保存分段数据
    }
  } else {
    chunks.push(file.slice(0))
  }
  chunkCount = chunks.length //分⽚的个数
  let uploadedInfo = getUploadedFromStorage() //获得已上传的分段信息
  for (let i = 0; i < chunkCount; i++) {
    console.log('index', i, uploadedInfo[i] ? '已上传过' : '未上传')
    if (uploadedInfo[i]) { //对⽐分段
      sendChunkCount = i + 1 //记录已上传的索引
      continue //如果已上传则跳过
    }
    const fd = new FormData() //构造FormData对象
    fd.append('fileTag', fileTag)
    fd.append('f1', chunks[i])
    fd.append('index', i)
    xhrSend(fd, function () {
      //保存分片成功的回调
      sendChunkCount += 1 //将成功信息保存到本地
      setUploadedToStorage(index) //记录已上传的数据
      //上传完成，发送合并请求
      if (sendChunkCount === chunkCount) {
        console.log('上传完成，发送合并请求')
        let formD = new FormData()
        formD.append('type', 'merge')
        formD.append('fileTag', fileTag)
        formD.append('chunkCount', chunkCount)
        formD.append('filename', name)
        xhrSend(formD)
      }
    })
  }
}
// 发送请求
function xhrSend(fd, cb) {
  let xhr = new XMLHttpRequest() //创建对象
  xhr.open('POST', 'http://localhost:8100/', true)
  xhr.onreadystatechange = function () {
    console.log('state change', xhr.readyState)
    if (xhr.readyState == 4) {
      console.log(xhr.responseText)
      cb && cb()
    }
  }
  xhr.send(fd) //发送
}

//获得本地缓存的数据
function getUploadedFromStorage() {
  return JSON.parse(localforage.getItem(saveChunkKey) || '{}')
}

//写⼊缓存
function setUploadedToStorage(index) {
  let obj = getUploadedFromStorage()
  obj[index] = true
  localforage.setItem(saveChunkKey, JSON.stringify(obj))
}

```

## [如何实现⽹⻚加载进度条？](https://maimai.cn/article/detail?fid=1846750090&efid=IdmfyobQZPezeUGjGeOkIQ)

### 监听静态资源加载情况

- 可以使⽤ `window.performance.getEntries()` ⽅法获取⻚⾯上所有的资源加载信息。如每个资源的加载状态，计算加载时间等来实现
  详见`docs\examples\blogs\business\progress\progress.html`

### 实现进度条

1. 自定义
   ::: example
   blogs/business/progress/progress
   :::
2. 使⽤第三⽅库，如 nprogress
<!--

- https://juejin.cn/post/7307057492059471899
- https://juejin.cn/post/7401060368087728166?searchId=202410142012222C5A2537F9C76AD11A25#heading-4
- https://juejin.cn/post/7422848805044371471
  -->

## [【不同标签⻚或窗⼝间的主动通信】](https://juejin.cn/post/7359470175760957474)

- 频道内的通信 仅在同源浏览器上下⽂（具有相同的协议、域名和端⼝号）之间有效

### BroadcastChannel

详见`\tabMessage\BroadcastChannel\tab1.html`和`\tabMessage\BroadcastChannel\tab2.html`

- tab1

```js
// 在任何一个 tab 或 iframe 中创建一个广播频道
const channel = new BroadcastChannel('my-channel-name')
// 发送一个消息到频道
channel.postMessage('Hello from a tab!')
```

- tab2

```js
// 监听这个频道的消息
channel.addEventListener('message', function (event) {
  if (event.data === 'Hello from a tab!') {
    console.log('Message received: ', event.data)
  }
})
```

### Service Workers

- ServiceWorker 是一个**运行在浏览器背后**的独立线程，它拥有**访问网络的能力**，可以实现资源缓存、消息推送、后台数据同步等功能.

  - 资源缓存：它能拦截和缓存网络请求，提高加载速度和优化用户体验。
  - 消息推送：即便在应用或浏览器未运行的情况下，Service Worker 也能接收后台推送通知。
  - 后台数据同步：使用 Background Sync API, 它可以在后台同步数据，这在断网或网络不稳定时特别有用。

- 利用 Service Workers，各个标签页可以通过 `clients.matchAll()` 方法找到所有其他客户端（如打开的标签页），然后使用 `postMessage` 发送消息。
- Service Workers 可以通过 Focus 和 Navigate 事件来控制页面的焦点和导航等。
  详见`\tabMessage\ServiceWorker\tab1.html`和`\tabMessage\ServiceWorker\tab2.html`

```js{2}
navigator.serviceWorker
  .register('./sw.js')
  .then((registration) => {
  })
  .catch((error) => {
    console.log('注册失败:', error)
  })
// 发送消息
navigator.serviceWorker.controller.postMessage('This is from main page')
```

```js{1}
self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    windowClients.forEach((client) => {
      client.postMessage('New message for ' + client.id)
    })
  })
```

### 使用 iframe 的 message 事

详见`\tabMessage\iframe\index.html`和`\tabMessage\iframe\iframe.html`

- index.html

```js{5,8,17,21}
<h2 >Parent Page</h2>
<iframe src="./iframe.html"></iframe>
<div id="iframeText"></div>

let originUrl = window.location.origin.toString()
let count = 0
// 监听 iframe 发送的 message 事件
window.addEventListener('message', function (event) {
  if (event.origin !== originUrl) {
    return // 确保消息源是可信的
  }
  if (event.data && event.data.greeting) {
    count++
    const iframeText = document.getElementById('iframeText')
    iframeText.textContent = '来自iframe的消息:' + event.data.greeting + count
    // 回复iframe发送一些信息
    document.querySelector('iframe').contentWindow.postMessage(
      {
        response: 'Hello iframe! This is the parent window speaking.'
      },
      originUrl
    )
  }
})
```

- iframe.html

```js{4,10,20}
<h2>Iframe Page</h2>
<div id="parentText"></div>

let originUrl = window.location.origin.toString() //发送的地址
let count = 0
// 假设我们有一些需要发送到父页面的信息
function sendMessageToParent() {
  setInterval(function () {
    // 向父页面发送消息
    parent.postMessage({ greeting: 'Hello, I am the iframe!' }, originUrl)
  }, 5000)
}

// 当页面加载完成后，给父页面发送消息
window.onload = function () {
  sendMessageToParent()
}

// 监听来自父页面的消息
window.addEventListener('message', function (event) {
  if (event.origin != originUrl) {
    // 反向验证消息源的可信度
    return
  }
  console.log('【 event.data 】-33', event.data)
  if (event.data && event.data.response) {
    count++
    const parentText = document.getElementById('parentText')
    parentText.textContent = '来自parent的消息:' + event.data.response + count
    console.log('来自父页面parent发送消息:', event.data)
    // 可根据消息实现特定的逻辑...
  }
})
```

## 如何禁⽌别⼈调试⾃⼰的前端⻚⾯代码?

### ⽆限 debugger

```js{3,4}
(() => {
  function ban() {
    setInterval(() => {
      debugger
    }, 50)
  }
  try {
    ban()
  } catch (err) {}
})()
```

### 禁⽌断点的对策

## 【如何在跨域请求中携带另外⼀个域名下的 Cookie】

### 配置

1. **服务端**设置**响应头部**的`Access-Control-Allow-Credentials`字段为`true`，
1. **服务端**需要设置**响应头部**的`Access-Control-Allow-Origin`字段为指定的域名，表⽰允许指定域名的跨域请求携带 Cookie。
1. **客⼾端**设置**请求头部**的`withCredentials`字段为`true`。

### ⽰例代码

- 服务端（Node.js）：

```js{5,7}
const express = require('express')
const app = express()
app.use((req, res, next) => {
  // 允许指定域名的跨域请求携带Cookie。
  res.setHeader('Access-Control-Allow-Origin', 'http://example.com')
  // 请求携带Cookie
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})
app.get('/api/data', (req, res) => {
  res.send('Response Data') // 处理请求
})
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

```

- 客户端（JavaScript）

```js{2}
fetch('http://example.com/api/data', {
// 在客⼾端发起跨域请求时，需要设置请求头部的`withCredentials`字段为`true`
  credentials: 'include'
})
  .then((response) => response.text())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
```

以上代码中，Access-Control-Allow-Origin 设置为'http://example.com'，表⽰允许该域名的跨域请求携带Cookie。fetch请求的参数中，credentials设置为'include'表⽰请求中携带Cookie

## 【后端⼀次性返回树形结构数据，数据量⾮常⼤, 前端该如何处理？】

1. **分批处理**：将⼤量的树形数据分为多个批次进⾏处理和渲染。前端可以通过**递归或循环**的⽅式，每次处理⼀部分数据，并在渲染完成后再处理下⼀部分数据。这样可以避免⼀次性处理⼤量数据造成栈溢出的问题。
2. **异步处理**：使⽤异步处理的⽅式进⾏数据的计算和渲染。前端可以利⽤ JavaScript 的异步特性，将数据处理和渲染任务分为多个异步任务，并通过事件循环机制依次执⾏这些任务。这样可以避免⼀次性计算和渲染⼤量数据导致栈溢出的问题。
3. **虚拟化渲染**：**使⽤虚拟化渲染技术，只渲染当前可⻅区域的树节点**，⽽不是全部节点。可以根据⻚
   ⾯的滚动位置和⽤⼾操作，只渲染当前需要展⽰的节点，⽽对于不可⻅的节点只保留其占位符。这样可以减少实际渲染的节点数量，降低内存占⽤和渲染时间。
4. **数据分级处理**：对于树形结构数据，可以考虑对数据进⾏分级处理。将数据根据节点的层级关系进⾏分组，**每次只处理和渲染当前层级的节点数据**。这样可以减少每次处理的数据量，降低栈溢出的⻛险。

根据具体的业务需求和技术实现情况，可以选择适合的处理⽅式来解决栈溢出问题。同时，也可以结合多种处理⽅式来提⾼⻚⾯性能和⽤⼾体验。

## 【在前端应⽤如何进⾏权限设计？】

### ⻆⾊与权限分离

- 将⽤⼾的权限分为不同的⻆⾊，每个⻆⾊拥有特定的权限。
- 这样可以简化权限管理，并且当需求变化时，只需要调整⻆⾊的权限，⽽不需要逐个修改⽤⼾的权限。

### 功能级权限控制

对于敏感操作或者需要权限控制的功能，需要在前端实现功能级的权限控制。

- 可以通过**按钮权限**控制
- 权限可以使⽤权限名或者权限码进⾏标识
- **⻆⾊与权限关联**：将权限与⻆⾊进⾏关联。确定每个⻆⾊具备哪些权限
- **⽤⼾与⻆⾊关联**：将⽤⼾与⻆⾊进⾏关联。确定每个⽤⼾属于哪些⻆⾊

### 路由级权限控制

- 对于不同的⻚⾯或路由，可以根据⽤⼾的⻆⾊或权限来进⾏权限控制。在前端路由中配置权限信息，
- 当⽤⼾访问特定路由时，前端会检查⽤⼾是否具备访问该路由的权限。
- 使⽤前端路由守卫机制，在路由跳转前进⾏权限验证。在路由守卫中，根据当前⽤⼾的
  权限信息和路由配置进⾏判断，决定是否允许⽤⼾访问该路由。如果⽤⼾没有相应的权限，可以进⾏跳转到⽆权限提⽰⻚⾯或者其他处理⽅式。
- **权限控制组件**：可以创建⼀个权限控制组件，在需要进⾏权限控制的路由组件上使⽤该组件进⾏包裹。该组件可以根据当前⽤⼾的权限和路由配置，动态显⽰或隐藏路由组件。
- **动态路由**：对于⼀些有权限控制的路由，可以在⽤⼾登录时根据权限配置动态⽣成。根据⽤⼾的权限配置，过滤路由表，⽣成⽤⼾可以访问的路由列表，并将该列表添加到路由配置中。

### 动态权限管理

在前端应⽤中，可以实现动态权限管理，即在⽤⼾登录时从服务器获取⽤⼾的权限信息，并在前端进⾏缓存。这样可以保证⽤⼾权限的实时性，同时也便于后端对权限进⾏调整和管理。

### UI 级的权限控制

对于某些敏感信息或操作，可以通过前端的界⾯设计来进⾏权限控制。例如，隐藏某些敏感字段或操作按钮，只对具有相应权限的⽤⼾可⻅或可操作。

### 异常处理与安全验证

在前端应⽤中，需要实现异常处理机制，当⽤⼾越权操作时，需要给予相应提⽰并记录⽇志。同时，对于敏感操作，需要进⾏**⼆次验证**，例如通过输⼊密码或短信验证码等⽅式进⾏安全验证。

### 安全性考虑

在设计前端应⽤的权限时，需要考虑安全性，例如防⽌跨站脚本攻击（XSS）、跨站请求伪造（CSRF）等攻击⽅式。可以采⽤合适的安全措施，如输⼊验证、加密传输等来保护应⽤的安全性。

- 综上所述，前端应⽤的权限设计应该考虑 **⻆⾊与权限分离、功能级与路由级的权限控制、动态权限管理、UI 级的权限控制、异常处理与安全验证以及安全性考虑等⽅⾯**。通过合理的权限设计，可以确保系统的安全性和⽤⼾权限的灵活管理。
