/*
 * @Description: 点击选中输入框文本
 * @Date: 2024-12-30 16:08:21
 * @LastEditTime: 2024-12-30 17:21:38
 */
const handleSelectClick = (el) => {
  el.querySelector('input').select()
}

export default {
  mounted(el) {
    const clickHandler = () => handleSelectClick(el)
    el.addEventListener('click', clickHandler)

    el._clickHandler = clickHandler
  },
  unmounted(el) {
    el.removeEventListener('click', el._clickHandler)
  }
}
