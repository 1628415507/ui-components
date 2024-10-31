/*
 * @Description: 输入框小写转大写
 * @Date: 2024-03-25 13:08:28
 * @LastEditTime: 2024-03-27 14:05:05
 */
export default {
  mounted(el, binding, vnode) {
    el.addEventListener('input', (val) => {
      const upperCaseVal = val.target.value.toUpperCase()
      val.target.value = upperCaseVal
      vnode.ctx.emit('update:modelValue', upperCaseVal) // 更新绑定的v-model值
    })
  }
}
