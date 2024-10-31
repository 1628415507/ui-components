import axios from 'axios'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 1000
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 判断是否有 token
    if (getToken()) {
      config.headers['Permission-Token'] = getToken()
    }
    // 添加待处理请求
    config.urlData = config.data ? JSON.stringify(config.data) : '' // 记录初始的传参
    config.urlParams = config.params ? JSON.stringify(config.params) : '' // 记录初始的传参
    addPendingRequest(config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    removePendingRequest(response)
    const res = response.data
    return Promise.resolve(res.data)
  },
  (error) => {
    if (axios.isCancel(error)) {
      removePendingRequest(error)
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)
//
function generateReqKey(config) {
  // 请求得到的config.data是对象格式，响应回来的response.config.data是字符串格式，需要转换成对象
  // if (typeof config.data === 'string') {
  //   config.data = JSON.parse(config.data)
  // }
  const { url, method, urlParams, urlData } = config
  return [url, method, urlParams, urlData].join('&')
}
let pendingRequestList = [] //记录待处理请求(使用对象保存，key过长取值会存在问题，所有改用数组存储)
// 添加、取消待处理请求
function addPendingRequest(config) {
  const controller = new AbortController()
  config.signal = controller.signal
  const requestKey = generateReqKey(config) // 生成请求的唯一键，用于标识不同的请求
  const flag = pendingRequestList.some((item) => item.key === requestKey)
  // 如果相同请求已在进行中，则取消当前请求
  if (flag) {
    console.error('【 `重复请求已取消` 】', config.url)
    controller.abort()
  } else {
    // 如果没有相同的请求在进行中，则设置取消令牌并存储请求键和取消函数的映射
    pendingRequestList.push({
      key: requestKey,
      abort: controller.signal
    })
  }
}
// 请求完成后，移除记录
function removePendingRequest(response) {
  // 如果 response.config 返回的是 undefined，表示是取消请求，则不处理
  if (response.config) {
    // 生成请求的唯一键，用于标识不同的请求
    const requestKey = generateReqKey(response.config)
    const flag = pendingRequestList.some((item) => item.key === requestKey)
    console.log('【 flag==== 】-250', pendingRequestList, flag)
    // 判断是否有这个 key，有就删除
    if (flag) {
      pendingRequestList = pendingRequestList.filter((item) => item.key !== requestKey)
      console.log('【 pendingRequestList 】-253', pendingRequestList)
    }
  }
}
export default service
