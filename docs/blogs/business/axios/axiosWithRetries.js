/*
 * @Description: 
 * @Date: 2024-11-14 16:01:36
 * @LastEditTime: 2024-11-14 16:03:12
 */
import axios from 'axios'
const request = axios.create({
  baseURL: globalParamsEnv?.BASE_API || 'http://192.168.11.79/',
  timeout: 1000,
  retry: 2, // 重新请求次数
  retryInterval: 1000 // 重新请求间隙
})
// 重新请求
function requestAgain(config) {
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
// 响应拦截
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
