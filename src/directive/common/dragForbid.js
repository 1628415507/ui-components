/*
 * @Description:输入框禁止拖拽
 * @Date: 2024-10-30 13:52:27
 * @LastEditTime: 2024-12-11 13:22:41
 */
const handleDragClick = (event) => {
  console.log('【 dragHandler 】-7', event, event.srcElement.tagName)
  if (['INPUT', 'TEXTAREA'].includes(event.srcElement.tagName.toUpperCase())) {
    event.preventDefault() // 阻止默认的拖拽行为
  }
}

export default {
  mounted(el) {
    const dragHandler = (e) => handleDragClick(e)
    el.addEventListener('dragstart', dragHandler)
    el._dragHandler = dragHandler
  },
  unmounted(el) {
    el.removeEventListener('dragstart', el._dragHandler)
  }
}
