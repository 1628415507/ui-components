## axios 请求超时⾃动重新请求

<!-- - 详见`docs\examples\blogs\business\fetchWithRetries.ts`
https://zhuanlan.zhihu.com/p/668882474 -->

```js{5,6,8,11,13,19,26,30,39}
import axios from 'axios'
const request = axios.create({
  baseURL: globalParamsEnv?.BASE_API || 'http://192.168.11.79/',
  timeout: 1000,
  retry: 2, // 重新请求次数
  retryInterval: 1000 // 重新请求间隙
})
// 重新请求
function requestAgain(config){
  //设置⼀个变量记录重新请求的次数
  config.retryCount = config.retryCount || 0
  // 检查重新请求的次数是否超过设定的请求次数
  if (config.retryCount >= config.retry) {
      return Promise.reject(error)
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
request.interceptors.response.use(
  (res) => {
    // ...请求成功
  },
  (error) => {
    // ...
    //如果配置不存在或重试属性未设置，抛出promise错误
    if (!config || !config.retry) return Promise.reject(error)
    // 重新请求
    return requestAgain(error.config)

  }
)
```

## [axios 是否可以取消请求](https://www.jb51.net/javascript/327288df7.htm)

### 使用 cancelToken（已弃用）

- 在 Axios 中，取消请求的基本思路是创建一个用于取消的标记（cancel token），并将其与特定请求关联。当需要取消请求时，我们可以使用这个标记通知 Axios 取消发送该请求。
- 确保在组件卸载时取消请求，以免造成内存泄漏。
- 取消标记只能取消尚未完成的请求，无法取消已经完成的请求。
- 取消标记只能在特定的请求上使用一次，一旦使用过，就需要重新创建。
- 注意: 可以使用同一个 cancel token 取消多个请求
- 如果在开始 axios request 之前执行了取消请求，则并不会发出真实的请求。
- 支持 cancelToken 取消请求，cancelToken 可以通过工厂函数产生，也可以通过构造函数生成；
- 支持 Fetch API 的 AbortController 取消请求；
- 一个 token/signal 可以取消多个请求，一个请求也可同时使用 token/signal；

::: example
blogs/business/cancelToken/cancelToken
:::

```js{17,29,35,43,80,84,}
import Axios from 'axios'

// 创建一个实例
const service = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 1000
})

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // 判断是否有 token
    if (getToken()) {
      config.headers['Permission-Token'] = getToken()
    }
    // 添加待处理请求
    addPendingRequest(config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 移除挂起的请求
    removePendingRequest(response)
    const res = response.data
    return res
  },
  (error) => {
    // 移除挂起的请求
    removePendingRequest(error)
    // 是否是取消请求
    if (Axios.isCancel(error)) {
      console.log('err:', error)
      return Promise.reject(error)
    } else {
      console.log('请求有问题:', error.message)
      // 当请求超时、断网等问题时重发
      return requestAgain(error)
    }
  }
)

export default service

const pendingRequest = new Map()
/**
 * 添加待处理请求
 * @description 该函数用于管理重复请求，避免同一接口的多个请求同时进行
 * @param {Object} config - axios请求配置对象
 */
function addPendingRequest(config) {
  // 创建axios的取消令牌源，用于请求的取消控制
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  // 生成请求的唯一键，用于标识不同的请求
  const requestKey = generateReqKey(config)

  // 方法一
  // 如果相同请求已在进行中，则取消当前请求
  if (pendingRequest.has(requestKey)) {
    config.cancelToken = source.token
    source.cancel(`${config.url} 请求已取消`)
  } else {
    // 如果没有相同的请求在进行中，则设置取消令牌并存储请求键和取消函数的映射
    config.cancelToken = source.token
    pendingRequest.set(requestKey, source.token)
  }

  // 方法二
  // 如果相同请求已在进行中，则取消当前请求
  if (pendingRequest.has(requestKey)) {
    config.cancelToken = new Axios.CancelToken((cancel) => {
      // cancel 函数的参数会作为 promise 的 error 被捕获
      cancel(`${config.url} 请求已取消`)
    })
  } else {
    config.cancelToken = new Axios.CancelToken((cancel) => {
      pendingRequest.set(requestKey, cancel)
    })
  }

  // 以上两种方式都能取消请求，但是从 Axios `v0.22.0` 开始已被弃用，从 `v0.22.0` 开始，Axios 支持以 fetch API 方式—— `AbortController`取消请求
}

/**
 * 移除挂起的请求
 * @description 当收到响应时，检查并移除与该响应相关的挂起请求
 * @param {Object} response - 响应对象，包含请求配置信息
 */
function removePendingRequest(response) {
  // 如果 response.config 返回的是 undefined，表示是取消请求，则不处理
  if (response.config) {
    // 生成请求的唯一键，用于标识不同的请求
    const requestKey = generateReqKey(response.config)

    // 判断是否有这个 key，有就删除
    if (pendingRequest.has(requestKey)) {
      pendingRequest.delete(requestKey)
    }
  }
}

/**
 * 生成请求的唯一键
 * @description 这个函数的目的是根据请求配置生成一个唯一的键，用于缓存请求数据
 * @param {Object} config - 请求配置对象，包含了url、method、params和data属性
 * @returns {string} - 返回一个根据请求配置生成的唯一键
 */

function generateReqKey(config) {
  // 请求得到的config.data是对象格式，响应回来的response.config.data是字符串格式，需要转换成对象
  if (typeof config.data === "string") {
    config.data = JSON.parse(config.data);
  }
  const { url, method, params, data } = config;
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join("&");
}

```

### 使用 AbortController

```js
function hanldleAbortController() {
  const controller = new AbortController()
  axios.get('/foo/abortController', { signal: controller.signal }).then(function (response) {
    //...
  })
  controller.abort()
}
```
