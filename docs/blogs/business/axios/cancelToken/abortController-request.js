import axios from 'axios'
import { ElMessage } from 'element-plus'
import { tansParams } from './tools'
import cache from './cache'
import errorCode from './errorCode'
import { encrypt, decrypt, signature } from './apiAuth'

let globalParamsEnv = {} //环境变量
// const appIsEncrypt = globalParamsEnv?.VITE_API_IS_DECRYPT || 'off' // 'off'
const repeat = false //是否重复请求
const request = axios.create({
  baseURL: globalParamsEnv?.BASE_API || 'http://192.168.11.79/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=utf-8',
    isSetBase: false
  },
  timeout: 100000
})

// 拦截器
request.interceptors.request.use(
  (config) => {
    // 记录初始的传参
    config.urlData = config.data ? JSON.stringify(config.data) : ''
    config.urlParams = config.params ? JSON.stringify(config.params) : ''
    addPendingRequest(config)
    const globalParams = config?.globalParams || {} //请求的接口的传参
    globalParamsEnv = config?.globalParams?.env || {}
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('Authorization')
    let appIsEncrypt = globalParamsEnv?.VITE_API_IS_DECRYPT || 'off'
    const isEncrypt = (config.headers || {}).isEncrypt === false
    if (isEncrypt || appIsEncrypt === 'off') {
      config.headers['Service-Code'] = 'szh-test'
    }
    config.baseURL = globalParamsEnv?.BASE_API || 'http://192.168.11.79/'
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    // 请求设置通用请求参数处理
    if (config?.headers?.isSetBase) {
      setBaseParams(config, globalParams)
    }
    encryptRequest(config, globalParamsEnv)
    if (config.method === 'post' || config.method === 'put') {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      }
      const requestSize = Object.keys(JSON.stringify(requestObj)).length // 请求数据大小
      const limitSize = 5 * 1024 * 1024 // 限制存放数据5M
      if (requestSize >= limitSize) {
        console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
        return config
      }
      const sessionObj = cache.session.getJSON('sessionObj')
      if (repeat === false || sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj)
      } else {
        const s_url = sessionObj.url // 请求地址
        const s_data = sessionObj.data // 请求数据
        const s_time = sessionObj.time // 请求时间
        const interval = 1000 // 间隔时间(ms)，小于此时间视为重复提交
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = '数据正在处理，请勿重复提交'
          console.warn(`[${s_url}]: ` + message)
          return Promise.reject(new Error(message))
        } else {
          cache.session.setJSON('sessionObj', requestObj)
        }
      }
      return config
    }
  },
  (error) => {
    // console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    removePendingRequest(res)
    globalParamsEnv = Object.keys(globalParamsEnv).length > 0 ? globalParamsEnv : res?.config?.globalParams?.env || {}
    // setTimeout(() => {
    //   hideLoading()
    // }, 200)
    decryptResponse(res, globalParamsEnv)
    // 未设置状态则默认请求响应失败
    const status = res.data.status || 0
    // 获取错误信息
    const message = res.data.message || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }
    if (status === 0) {
      ElMessage({ message: message, type: 'error' })
      return Promise.reject(new Error(message))
    } else {
      return Promise.resolve(res.data)
    }
  },
  (error) => {
    if (axios.isCancel(error)) {
      removePendingRequest(error)
    }
    let { message } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)
// 获取基本参数
function getBaseParams(config, globalParams) {
  let baseParams = new Object()
  // const locUserData = localStorage.getItem('user')
  const { USER_ID_KEY, USER_CODE_KEY, COMPANY_CODE_KEY, VITE_API_PARTNER_CODE, VITE_APP_CODE, TOKEN_NAME_KEY } =
    globalParams.env
  const secUserData = globalParams?.store?.user || {}
  baseParams['currentUserId'] = secUserData[`${USER_ID_KEY}`]
  baseParams['currentUserCode'] = secUserData[`${USER_CODE_KEY}`]
  baseParams[`${COMPANY_CODE_KEY || 'currentCompanyCode'}`] = secUserData[`${COMPANY_CODE_KEY || 'currentCompanyCode'}`]
  baseParams['currentPartnerCode'] = VITE_API_PARTNER_CODE || '' //对接人编码
  baseParams['currentProjectCode'] = VITE_APP_CODE || ''
  baseParams['currentInterfacePath'] = config.url //接口地址
  baseParams['token'] = secUserData[`${TOKEN_NAME_KEY || 'Admin-Token'}`]
  baseParams['createOrgId'] = secUserData?.createOrgId || ''
  baseParams['createOrgCode'] = secUserData?.createOrgCode || ''
  baseParams['createOrgName'] = secUserData?.createOrgName || ''
  baseParams['settleOfficeId'] = secUserData?.settleOfficeId || ''
  baseParams['settleOfficeCode'] = secUserData?.settleOfficeCode || ''
  baseParams['settleOfficeName'] = secUserData?.settleOfficeName || ''
  baseParams['deptOfficeId'] = secUserData?.deptOfficeId || ''
  baseParams['deptOfficeCode'] = secUserData?.deptOfficeCode || ''
  baseParams['deptOfficeName'] = secUserData?.deptOfficeName || ''

  return baseParams
}
// 设置通用请求参数处理
export function setBaseParams(config, globalParams) {
  // GET请求
  if (config.method === 'get') {
    let baseParams = getBaseParams(config, globalParams)
    let url = config.url + (config.url.indexOf('?') < 0 ? '?' : '&') + tansParams(baseParams)
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
    // POST请求
  } else if (config.method === 'post' || config.method === 'put') {
    config.data = config.data || {}
    if (typeof config.data === 'object') {
      config.data = { ...config.data, ...getBaseParams(config, globalParams) }
    }
  }
}

export function encryptRequest(config, env) {
  let appIsEncrypt = env?.VITE_API_IS_DECRYPT || 'off'
  if (appIsEncrypt === 'off') {
    return
  }
  const isEncrypt = (config.headers || {}).isEncrypt === false
  if (config.method === 'post' && !isEncrypt) {
    const reqData = config.data || {}
    const reqDataString = JSON.stringify(reqData)
    const reqDataEncryptString = encrypt(reqDataString, env?.VITE_API_DECRYPT_KEY || '')
    const securetKey = env?.VITE_API_SECURITY_KEY || ''
    const signatureData = signature(reqDataString, securetKey)
    const newReqData = {
      data: reqDataEncryptString,
      signature: signatureData,
      partnerCode: env?.VITE_API_PARTNER_CODE || ''
    }

    config.data = newReqData
  }
}

export function decryptResponse(res, env) {
  let appIsEncrypt = env?.VITE_API_IS_DECRYPT || 'off'
  if (appIsEncrypt === 'off') {
    return
  }
  const responseData = res.data
  const data = responseData.data || {}
  const signatureData = responseData.signature
  const partnerCode = responseData.partnerCode
  if (data && signatureData && partnerCode) {
    const decryptData = decrypt(data, env?.VITE_API_DECRYPT_KEY || '')
    const securetKey = env?.VITE_API_SECURITY_KEY || ''
    const againSignatureData = signature(decryptData, securetKey)
    if (signatureData === againSignatureData) {
      res.data = JSON.parse(decryptData)
    }
  }
}
//
function generateReqKey(config) {
  // 请求得到的config.data是对象格式，响应回来的response.config.data是字符串格式，需要转换成对象
  // if (typeof config.data === 'string') {
  //   config.data = JSON.parse(config.data)
  // }
  const { url, method, urlParams, urlData } = config
  return [url, method, urlParams, urlData].join('&')
}
let pendingRequestList = [] //记录待处理请求
function addPendingRequest(config) {
  const controller = new AbortController()
  config.signal = controller.signal
  const requestKey = generateReqKey(config) // 生成请求的唯一键，用于标识不同的请求
  const flag = pendingRequestList.some((item) => item.key === requestKey)
  console.log('【 flag 】-227', pendingRequestList, flag)
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

export default request
