import axios from 'axios'
import Cookies from 'js-cookie'
import { ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { tansParams, blobValidate } from './tools'
import cache from './cache'
import errorCode from './errorCode'
import { encrypt, decrypt, signature } from './apiAuth'

let overlayDom = document.querySelector('.el-overlay')?.style?.display

// const appIsEncrypt = env?.VITE_API_IS_DECRYPT || 'off' // 'off'
let env = {}
const repeat = false //是否重复请求
const request = axios.create({
  baseURL: env?.BASE_API || 'http://192.168.11.79/',
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
    env = config?.apiConfigEnv || {}
    // config.headers['Authorization'] = 'Bearer ' + (Cookies.get('Admin-Token') || Cookies.get('Authorization'))
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('Authorization')
    let appIsEncrypt = env?.VITE_API_IS_DECRYPT || 'off'
    const isEncrypt = (config.headers || {}).isEncrypt === false
    // config.headers['Service-Code'] = 'szh-test' //需要加密就注释掉
    if (isEncrypt || appIsEncrypt === 'off') {
      config.headers['Service-Code'] = 'szh-test'
    }
    config.baseURL = env?.BASE_API || 'http://192.168.11.79/'
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    // 锦海捷亚项目请求设置通用请求参数处理
    // debugger
    console.log('isSetBase======')
    if (config?.headers?.isSetBase) {
      setBaseParams(config, env)
    }
    encryptRequest(config, env)
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
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    env = Object.keys(env).length > 0 ? env : res?.config?.apiConfigEnv || {}
    // setTimeout(() => {
    //   hideLoading()
    // }, 200)
    decryptResponse(res, env)
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

// 锦海捷亚项目请求设置通用请求参数处理
export function setBaseParams(config, env) {
  if (config.method === 'get') {
    let baseParams = new Object()
    // const locUserData = localStorage.getItem('user')
    const secUserData = env?.store.user
    baseParams['currentUserId'] = secUserData[`${env?.USER_ID_KEY}`]
    ;(baseParams['currentUserCode'] = secUserData[`${env?.USER_CODE_KEY}`]),
      (baseParams[`${env?.COMPANY_CODE_KEY || 'currentCompanyCode'}`] =
        secUserData[`${env?.COMPANY_CODE_KEY || 'currentCompanyCode'}`]),
      (baseParams['currentPartnerCode'] = env?.VITE_API_PARTNER_CODE || '') //对接人编码
    baseParams['currentProjectCode'] = env?.VITE_APP_CODE || ''
    baseParams['currentInterfacePath'] = config.url //接口地址
    baseParams['token'] = secUserData[`${env?.TOKEN_NAME_KEY || 'Admin-Token'}`]
    baseParams['createOrgId'] = secUserData?.createOrgId || ''
    baseParams['createOrgCode'] = secUserData?.createOrgCode || ''
    baseParams['createOrgName'] = secUserData?.createOrgName || ''
    baseParams['settleOfficeId'] = secUserData?.settleOfficeId || ''
    baseParams['settleOfficeCode'] = secUserData?.settleOfficeCode || ''
    baseParams['settleOfficeName'] = secUserData?.settleOfficeName || ''
    baseParams['deptOfficeId'] = secUserData?.deptOfficeId || ''
    baseParams['deptOfficeCode'] = secUserData?.deptOfficeCode || ''
    baseParams['deptOfficeName'] = secUserData?.deptOfficeName || ''

    let url = config.url + (config.url.indexOf('?') < 0 ? '?' : '&') + tansParams(baseParams)
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  } else if (config.method === 'post' || config.method === 'put') {
    config.data = config.data || {}
    if (typeof config.data === 'object') {
      // const locUserData = localStorage.getItem('user')
      const secUserData = env?.store.user
      console.log('secUserData=========')
      console.log(env?.store.user)
      config.data['currentUserId'] = secUserData[`${env?.USER_ID_KEY}`]
      ;(config.data['currentUserCode'] = secUserData[`${env?.USER_CODE_KEY}`]),
        (config.data[`${env?.COMPANY_CODE_KEY || 'currentCompanyCode'}`] =
          secUserData[`${env?.COMPANY_CODE_KEY || 'currentCompanyCode'}`]),
        (config.data['currentPartnerCode'] = env?.VITE_API_PARTNER_CODE || '') //对接人编码
      config.data['currentProjectCode'] = env?.VITE_APP_CODE || ''
      config.data['currentInterfacePath'] = config.url //接口地址
      config.data['token'] = secUserData[`${env?.TOKEN_NAME_KEY || 'Admin-Token'}`]

      config.data['createOrgId'] = secUserData?.createOrgId || ''
      config.data['createOrgCode'] = secUserData?.createOrgCode || ''
      config.data['createOrgName'] = secUserData?.createOrgName || ''
      config.data['settleOfficeId'] = secUserData?.settleOfficeId || ''
      config.data['settleOfficeCode'] = secUserData?.settleOfficeCode || ''
      config.data['settleOfficeName'] = secUserData?.settleOfficeName || ''
      config.data['deptOfficeId'] = secUserData?.deptOfficeId || ''
      config.data['deptOfficeCode'] = secUserData?.deptOfficeCode || ''
      config.data['deptOfficeName'] = secUserData?.deptOfficeName || ''
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

export default request
