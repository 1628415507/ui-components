/*
 * @Description: 回车键切换表单项聚焦
 * @Date: 2024-08-02 14:44:57
 * @LastEditTime: 2024-12-30 17:20:26
 */
import { nextTick } from 'vue'

// 是否符合聚焦条件
function focusable(element) {
  const noKeyFocus = element.dataset?.enterindex == -1 || element.tabindex == -1 // 不需要回车聚焦的元素(data-enterindex="-1")
  const isFileInput = element.type == 'file' // 是否是上传类型
  const disabled = element.disabled // 禁用的元素
  return !noKeyFocus && !isFileInput && !disabled
}
// 聚焦下一个元素
function focusNextElement(event, curFocusIndex, focusableElements) {
  let curIndex = parseInt(curFocusIndex)
  let nextIndex = curIndex + 1
  // if (nextIndex >= focusableElements.length - 1) {
  //   nextIndex = 0
  // }
  const srcElement = event.srcElement // || event.target //触发回车事件的元素
  // 表格聚焦到下一行时特殊处理（已处理过聚焦则跳过）
  if (srcElement.getAttribute('focused') == 'true') {
    setTimeout(() => {
      srcElement.setAttribute('focused', false)
    }, 300)
  } else {
    const nextElement = focusableElements[nextIndex] // || focusableElements[0]
    nextElement?.focus() //聚焦到下一个
  }
  // console.log('【 聚焦下一个元素 】-24', curIndex, nextIndex, nextElement)
  // console.log('【 nextIndex >= focusableElements.length - 1 】-46', nextIndex, focusableElements.length - 1)
  // if (focusable(nextElement)) {
  //   nextElement.focus()
  //   return
  // } else {
  //   // event.preventDefault()
  //   // focusNextElement(event, nextIndex, focusableElements)
  // }
}
const handleInputFocus = (el, binding, vnode, prevVnode) => {
  const types = binding.value?.length > 0 ? binding.value : ['input', 'select', 'textarea']
  // const code = binding.arg ? binding.arg : 'enter'
  let __index__ = 'enterIndex'
  // 绑定回车监听事件
  el.addEventListener('keyup', handleEnterFocus)
  function handleEnterFocus(event) {
    // 回车
    if (event.keyCode === 13) {
      const selectors = el.querySelectorAll(types.join(','))
      // 筛选出符合聚焦条件的元素
      const focusableDoms = Array.from(selectors)
        .filter((item) => {
          return focusable(item)
        })
        .map((item, index) => {
          item.setAttribute(__index__, index) //设置enterIndex属性
          return item
        })
      const triggerElement = event.srcElement // || event.target //触发回车事件的元素
      let curIndex = triggerElement.getAttribute(__index__)
      // console.log('【 当前元素 】-36', triggerElement, curIndex, document.activeElement, selectors, focusableDoms)
      focusNextElement(event, curIndex, focusableDoms)
    }
  }
}
export default {
  mounted: (el, binding, vnode, prevVnode) => {
    nextTick(() => {
      setTimeout(() => {
        handleInputFocus(el, binding, vnode, prevVnode)
      }, 5)
    })
  },
  updated: (el, binding, vnode, prevVnode) => {
    nextTick(() => {
      setTimeout(() => {
        handleInputFocus(el, binding, vnode, prevVnode)
      }, 5)
    })
  },
  unbind: (el, binding, vnode, prevVnode) => {
    // el.removeEventListener('keyup')
  }
}
