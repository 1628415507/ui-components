
/*
 * @Description: 

 * @Date: 2025-06-06 14:43:59
 * @LastEditTime: 2025-06-07 10:34:03
 */
import { onUnmounted } from 'vue'

export function observerDom(domEl, transitionArr, config = {}) {
  let hasTriggered = false //是否已经触发过
  let timers = []
  const observer = new IntersectionObserver(
    entries => {
      if (hasTriggered) {
        return
      }
      if (entries[0].isIntersecting) {
        hasTriggered = true
        // 顺序渐入，每个区域间隔400ms
        transitionArr.value.forEach((it, i) => {
          let delay = config?.speed || 400
          let time = i * delay
          // 如果为对象类型
          if (typeof it === 'object') {
            console.log('【 it 】-27', it)
            if (it.delay) {
              time = it.delay
            }
            const timerId = setTimeout(() => {
              transitionArr.value[i].show = true//显示过渡动画
            }, time)
            timers.push(timerId)
          } else {
            const timerId = setTimeout(() => {
              transitionArr.value[i] = true
            }, time)
            timers.push(timerId)
          }

        })
        observer.disconnect() //只触发一次（hasTriggered 标记），触发后断开监听（observer.disconnect()）。
      }
    },
    { threshold: config?.threshold || 0.2 }
  )
  // 监听进入视口
  observer.observe(domEl)
  // 清除所有定时器
  function clearTimer() {
    timers.forEach(timerId => {
      clearTimeout(timerId)
      timerId = null
    })
    timers.length = 0
  }
  onUnmounted(() => {
    clearTimer()
  })
}