// （发出第一个请求，取消后面的相同请求）
import Axios from "axios";

// 创建一个实例
const service = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 1000,
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // 判断是否有 token
    if (getToken()) {
      config.headers["Permission-Token"] = getToken();
    }
    // 添加待处理请求
    addPendingRequest(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 移除挂起的请求
    removePendingRequest(response);
    const res = response.data;
    return res;
  },
  (error) => {
    // 移除挂起的请求
    removePendingRequest(error);
    // 是否是取消请求
    if (Axios.isCancel(error)) {
      console.log("err:", error);
      return Promise.reject(error);
    } else {
      console.log("请求有问题:", error.message);
      // 当请求超时、断网等问题时重发
      return againRequest(error);
    }
  }
);

export default service;

const pendingRequest = new Map();//记录待处理请求
/**
 * 添加待处理请求
 * @description 该函数用于管理重复请求，避免同一接口的多个请求同时进行
 */
function addPendingRequest(config) {
  // 创建axios的取消令牌源，用于请求的取消控制
  const CancelToken = Axios.CancelToken;
  const source = CancelToken.source();

  // 生成请求的唯一键，用于标识不同的请求
  const requestKey = generateReqKey(config);

  // 方法一
  // 如果相同请求已在进行中，则取消当前请求（已完成的请求会进入响应拦截中被移除）
  config.cancelToken = source.token;
  if (pendingRequest.has(requestKey)) {
    source.cancel(`${config.url} 请求已取消`);
  } else {
    // 如果没有相同的请求在进行中，则设置取消令牌并存储请求键和取消函数的映射
    pendingRequest.set(requestKey, source.token);
  }

  // 方法二
 // 如果相同请求已在进行中，则取消当前请求
   /* if (pendingRequest.has(requestKey)) {
    config.cancelToken = new Axios.CancelToken((cancel) => {
      // cancel 函数的参数会作为 promise 的 error 被捕获
      cancel(`${config.url} 请求已取消`);
    });
  } else {
    config.cancelToken =
      new Axios.CancelToken((cancel) => {
        pendingRequest.set(requestKey, cancel);
      });
  }
  */
  // 以上两种方式都能取消请求，但是从 Axios `v0.22.0` 开始已被弃用，
  // 从 `v0.22.0` 开始，Axios 支持以 fetch API 方式—— `AbortController`取消请求
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
    const requestKey = generateReqKey(response.config);

    // 判断是否有这个 key，有就删除
    if (pendingRequest.has(requestKey)) {
      pendingRequest.delete(requestKey);
    }
  }
}

/**
 * 处理请求重试的函数
 * @description 它尝试重新发送因错误而失败的请求
 * @param {Object} err - 包含错误信息和配置的对象
 * @returns {Promise} 重新发送请求的Promise对象，解决或拒绝依据重试逻辑
 */
function againRequest(err) {
  const config = err.config;

  // 如果配置对象不存在，则直接拒绝Promise
  if (!config) return Promise.reject(err);

  // 设置用于记录重试计数的变量 默认为0
  config._retryCount = config._retryCount || 0;

  // 如果重试次数已经达到3次或更多，则拒绝Promise
  if (config._retryCount >= 3) {
    return Promise.reject(err);
  }
  // 重试次数
  config._retryCount += 1;

  // 延时处理，用于控制重试的时间间隔
  var backoff = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });

  // 在延时结束后，重新发起请求
  return backoff.then(() => {
    // 重新发起axios请求，使用更新后的配置
    return service(config);
  });
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
