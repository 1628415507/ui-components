/*
 * @Description: 输入框小写转大写
 * @Date: 2024-03-25 13:08:28
 * @LastEditTime: 2025-01-07 15:08:05
 */
function toUpperCase(e, vnode) {
  const upperCaseVal = e.target.value.toUpperCase()
  e.target.value = upperCaseVal
  vnode.ctx.emit('update:modelValue', upperCaseVal) // 更新绑定的v-model值
}
export default {
  mounted(el, binding, vnode) {
    let isChineseInput = false //是否是中文输入法
    // compositionstart:当用户开始使用IME输入字符组合时触发
    const compositionstartHander = () => {
      isChineseInput = true //此时为中文输入法
    }
    el.addEventListener('compositionstart', compositionstartHander)
    el._compositionstartHander = compositionstartHander
    // compositionend:当用户完成输入并从IME中选择最终字符时触发。
    const compositionendHander = (e) => {
      if (isChineseInput) {
        toUpperCase(e, vnode) //此时为直接输入，包括数字、字符和英文输入
      }
      isChineseInput = false
    }
    el.addEventListener('compositionend', compositionendHander)
    el._compositionendHander = compositionendHander

    const toUpperCaseHander = (e) => {
      if (!isChineseInput) {
        toUpperCase(e, vnode)
      }
    }
    el.addEventListener('input', toUpperCaseHander)
    el._inputHander = toUpperCaseHander
  },
  unmounted(el) {
    el.removeEventListener('compositionstart', el._compositionstartHander)
    el.removeEventListener('compositionend', el._compositionendHander)
    el.removeEventListener('input', el._inputHander)
  }
}
