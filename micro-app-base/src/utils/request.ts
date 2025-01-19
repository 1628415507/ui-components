/*
 * @Description: axios封装
 * @Author: Hongzf
 * @Date: 2022-11-21 18:51:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-17 16:44:35
 */
import axios from 'axios'
import { getToken } from '@/utils/cookies'

// import { Message } from 'element-plus'
// 创建axios实例
// 创建请求时可以用的配置选项

const instance = axios.create({
  // TODO
  baseURL: '/',
  // withCredentials: true,
  timeout: 5000
})
// axios的全局配置
instance.defaults.headers.post = {
  'Content-Type': 'application/x-www-form-urlencoded'
}
instance.defaults.headers.common = {
  'Auth-Type': 'company-web',
  'X-Requested-With': 'XMLHttpRequest',
  // TODO
  token: 'sdfjlsdfjlsdjflsjflsfjlskd'
}

// 添加请求拦截器(post只能接受字符串类型数据)
// 对所有的http请求进⾏统⼀拦截，确保在请求发出之前，从本地存储中获取token，
instance.interceptors.request.use(
  (config) => {
    const token = getToken() // 获取token
    if (token && config.headers) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const errorHandle = (status: number, other: any) => {
  // switch (status) {
  //   case 400:
  //     // Message.error('信息校验失败')
  //     break
  //   case 401:
  //     Message.error('认证失败')
  //     break
  //   case 403:
  //     Message.error('token校验失败')
  //     break
  //   case 404:
  //     Message.error('请求的资源不存在')
  //     break
  //   default:
  //     Message.error(other)
  //     break
  // }
}

// 添加响应拦截器
// 后端数据如果出错的话，接⼝还要进⾏统⼀拦截，
// ⽐如接⼝返回的错误是登录状态过期，那么就需要提⽰⽤⼾跳转到登录⻚⾯重新登录。
instance.interceptors.response.use(
  // 响应包含以下信息data,status,statusText,headers,config
  (response) => {
    console.log('【 response 】-70', response)
    const res = response.data
    // 请求成功
    if (res.code === 200) {
      if (res instanceof Blob) {
        return Promise.resolve(response)
      } else {
        return Promise.resolve(res)
      }
    } else {
      console.log('接口信息报错', res.message)
      return Promise.reject(new Error(res.message || 'Error')) // 请求失败
    }
  },
  (error) => {
    // console.log('【 请求失败 】-82', error)
    // Message.error(err)
    // if (error) {
    // errorHandle(response.status, response.data)
    return Promise.reject(error)
    // }
    // Message.error('请求失败')
    // return true
  }
)

export default instance
