/*
 * @Description:
 * @Date: 2024-09-18 13:52:58
 * @LastEditTime: 2024-09-18 14:22:42
 */
/**
 * 网页空闲检测
 * @param {() => void} callback 空闲时执行，即一定时长无操作时触发
 * @param {number} [timeout=15] 时长，默认15s，单位：秒
 * @param {boolean} [immediate=false] 是否立即开始，默认 false
 * @returns
 */
const onIdleDetection = (callback, timeout = 15, immediate = false) => {
  console.log('【 onIdleDetection 】-19')
  let pageTimer //定时器
  let beginTime = 0
  const onClearTimer = () => {
    pageTimer && clearTimeout(pageTimer)
    pageTimer = undefined
  }
  // 重新开始计时
  const onStartTimer = () => {
    console.log('【 onStartTimer 】-26', '操作中...')
    const currentTime = Date.now() //记录当前时间
    if (pageTimer && currentTime - beginTime < 100) {
      return
    }

    onClearTimer()
    beginTime = currentTime
    pageTimer = setTimeout(() => {
      callback()
    }, timeout * 1000)
  }
  // 监听页面显示状态改变
  const onPageVisibility = () => {
    // 页面显示状态改变时，移除延时器
    onClearTimer()
    console.log('【 document.visibilityState 】-45', document.visibilityState)
    if (document.visibilityState === 'visible') {
      const currentTime = Date.now()
      // 页面显示时，计算时间，如果超出限制时间则直接执行回调函数
      if (currentTime - beginTime >= timeout * 1000) {
        callback()
        return
      }
      // 继续计时
      pageTimer = setTimeout(() => {
        callback()
      }, timeout * 1000 - (currentTime - beginTime))
    }
  }
  // 开始事件监听
  const startDetection = () => {
    onStartTimer()
    document.addEventListener('mousedown', onStartTimer) // 监听键盘按下事件 mousedown ；
    document.addEventListener('mousemove', onStartTimer) // 监听⿏标移动事件 mousemove ；
    document.addEventListener('visibilitychange', onPageVisibility) // 监听页面被隐藏的情况
  }
  // 移处事件监听
  const stopDetection = () => {
    onClearTimer()
    document.removeEventListener('mousedown', onStartTimer)
    document.removeEventListener('mousemove', onStartTimer)
    document.removeEventListener('visibilitychange', onPageVisibility)
  }
  // 重新开始计时
  const restartDetection = () => {
    onClearTimer()
    onStartTimer()
  }

  if (immediate) {
    startDetection()
  }

  return {
    startDetection,
    stopDetection,
    restartDetection
  }
}
