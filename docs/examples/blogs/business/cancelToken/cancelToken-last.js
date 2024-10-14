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
    const res = response.data;
    return res;
  },
  (error) => {
    // 是否是取消请求
    if (!Axios.isCancel(error)) {
      // 当请求超时、断网等问题时重发
      againRequest(error);
    }
  }
);

export default service;

let pendingRequsetList = [];

/**
 * 取消所有待处理的请求
 */
export const cancelPendingRequest = () => {
  // 遍历待处理的请求列表，调用每个请求的取消方法
  pendingRequsetList.forEach((item) => {
    item.cancel();
  });
  // 清空待处理的请求列表
  pendingRequsetList = [];
};

/**
 * 添加待处理的请求
 * @description 为配置对象添加取消令牌，以便在请求待处理时能够取消
 * @param {Object} config - 请求的配置对象
 */
function addPendingRequest(config) {
  // 创建一个新的取消令牌，并将取消函数存储到待处理请求列表中
  config.cancelToken = new Axios.CancelToken((cancel) => {
    pendingRequsetList.push({
      cancel,
    });
  });
}

/**
 * 处理请求失败后的重试机制
 * @description 当请求失败时，尝试再次请求，最多重试3次
 * @param {Object} err - 错误对象，包含请求的配置信息
 * @returns {Promise} 重试请求的Promise对象
 */
function againRequest(err) {
  // 获取请求的配置信息
  const config = err.config;

  // 如果没有配置信息，则直接拒绝Promise
  if (!config) Promise.reject(err);

  // 初始化重试次数，如果不存在则为0
  config._retryCount = config._retryCount || 0;

  // 如果重试次数已经达到3次，则拒绝Promise
  if (config._retryCount >= 3) {
    return Promise.reject(err);
  }

  // 每次重试前，重试次数加1
  config._retryCount += 1;

  // 创建一个Promise，用于实现指数退避机制
  const backoff = new Promise((resolve) => {
    // 设置一个定时器，1秒后 resolve Promise
    setTimeout(() => {
      resolve();
    }, 1000);
  });

  // 返回一个Promise，表示再次请求的操作
  return backoff.then(() => {
    return service(config);
  });
}
